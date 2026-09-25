import { ImageResponse } from 'next/og'
import { getArticleBySlug } from '@/lib/articles'

export const runtime = 'edge'

// Pinned to the installed flag-icons version (see node_modules/flag-icons/package.json)
// so the OG card uses the exact same flag artwork the on-site <Flag> component's
// `fi fi-{code}` CSS classes are built from. Edge functions have no filesystem
// access, so the SVG is fetched from jsdelivr's npm mirror rather than read
// from node_modules directly — bump this if flag-icons is upgraded.
const FLAG_ICONS_VERSION = '7.5.0'

const FALLBACK_GRADIENT = 'linear-gradient(135deg, #0E1318 0%, #080C10 60%, #0E1318 100%)'

// Edge Runtime has no Node `Buffer` global — this is the Web-standard
// (btoa-based) way to turn fetched binary data into a base64 data URI.
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = ''
  const bytes = new Uint8Array(buffer)
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i])
  return btoa(binary)
}

async function fetchAsDataUri(url: string, mime: string): Promise<string | null> {
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const buf = await res.arrayBuffer()
    return `data:${mime};base64,${arrayBufferToBase64(buf)}`
  } catch {
    return null
  }
}

// Google Fonts serves woff2 to modern browsers but woff/ttf/otf to old
// ones — Satori (which @vercel/og's ImageResponse is built on) doesn't
// support woff2, so an old-Chrome UA string is the standard trick to get a
// format it can actually parse. This UA gets back plain woff (confirmed by
// testing the endpoint directly), which Satori does support.
async function loadGoogleFont(family: string, weight: number): Promise<ArrayBuffer | null> {
  try {
    const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&display=swap`
    const css = await fetch(cssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.0 Safari/537.36',
      },
    }).then(res => res.text())
    const match = css.match(/src: url\(([^)]+)\) format\('(?:woff|opentype|truetype)'\)/)
    if (!match) return null
    const fontRes = await fetch(match[1])
    if (!fontRes.ok) return null
    return await fontRes.arrayBuffer()
  } catch {
    return null
  }
}

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const article = getArticleBySlug(params.slug)
  const origin = new URL(req.url).origin

  const title = article?.title ?? 'Formula Hub'
  const isFlag = !!article && /^[a-z]{2}$/.test(article.thumbnailIcon)

  // Fonts, flag SVG and the logo PNG all load in parallel — each one fails
  // safely to `null` rather than failing the route, per the graceful-
  // degradation requirement (see the fontFamily/img fallbacks below).
  const [bebas, dmSans400, dmSans800, jbMono600, flagDataUri, logoDataUri] = await Promise.all([
    loadGoogleFont('Bebas Neue', 400),
    loadGoogleFont('DM Sans', 400),
    loadGoogleFont('DM Sans', 800),
    loadGoogleFont('JetBrains Mono', 600),
    isFlag ? fetchAsDataUri(`https://cdn.jsdelivr.net/npm/flag-icons@${FLAG_ICONS_VERSION}/flags/4x3/${article!.thumbnailIcon}.svg`, 'image/svg+xml') : Promise.resolve(null),
    fetchAsDataUri(`${origin}/logo.png`, 'image/png'),
  ])

  const fonts: { name: string; data: ArrayBuffer; weight: 400 | 800; style: 'normal' }[] = []
  if (bebas) fonts.push({ name: 'Bebas Neue', data: bebas, weight: 400, style: 'normal' })
  if (dmSans400) fonts.push({ name: 'DM Sans', data: dmSans400, weight: 400, style: 'normal' })
  if (dmSans800) fonts.push({ name: 'DM Sans', data: dmSans800, weight: 800, style: 'normal' })
  if (jbMono600) fonts.push({ name: 'JetBrains Mono', data: jbMono600, weight: 400, style: 'normal' })

  const bebasFamily = bebas ? "'Bebas Neue'" : 'sans-serif'
  const dmSansFamily = (dmSans400 || dmSans800) ? "'DM Sans'" : 'sans-serif'
  const monoFamily = jbMono600 ? "'JetBrains Mono'" : 'monospace'

  const titleSize = title.length > 60 ? 52 : title.length > 40 ? 60 : 70
  const eyebrow = article ? `${article.category} · ${article.articleType}` : null
  const byline = article ? `Rob Beaumont · ${article.date}` : null

  // Full-bleed background: the article's own multi-stop gradient (the
  // `thumbnail` field — the actual per-category gradient; `thumbnailBg` is
  // just a flat tint, not a gradient, so it isn't the right source for a
  // full-bleed background). Every value in lib/articles.ts already starts
  // with an explicit angle (e.g. "135deg,"), which is required to avoid the
  // Satori colour-stop parser bug fixed in this file previously — keep that
  // pattern for any future gradients added here.
  const background = article?.thumbnail ?? FALLBACK_GRADIENT

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          background,
        }}
      >
        {/* Downward scrim so title/byline stay legible on any gradient */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(180deg, transparent 40%, rgba(8,12,16,0.55) 100%)',
          }}
        />

        {/* Top-left: flag chip + category/type eyebrow */}
        {(flagDataUri || eyebrow) && (
          <div style={{ position: 'absolute', top: 48, left: 56, display: 'flex', alignItems: 'center', gap: 16 }}>
            {flagDataUri && (
              <img
                src={flagDataUri}
                width={74}
                height={56}
                style={{ borderRadius: 6, boxShadow: '0 0 0 1px rgba(255,255,255,0.18)' }}
              />
            )}
            {eyebrow && (
              <span
                style={{
                  fontFamily: monoFamily,
                  fontSize: 15,
                  fontWeight: 400,
                  color: 'rgba(255,255,255,0.8)',
                  textTransform: 'uppercase',
                  letterSpacing: 2,
                }}
              >
                {eyebrow}
              </span>
            )}
          </div>
        )}

        {/* Top-right: logo lockup — matches components/Navbar.tsx exactly
            (Image + "FORMULA" in DM Sans 800 white, "HUB" in DM Sans 800
            red), scaled up for a 1200x630 card. Falls back to a text-only
            wordmark if the logo image couldn't be fetched. */}
        <div style={{ position: 'absolute', top: 44, right: 56, display: 'flex', alignItems: 'center', gap: 12 }}>
          {logoDataUri && (
            <img src={logoDataUri} width={42} height={42} style={{ borderRadius: '50%' }} />
          )}
          <span style={{ display: 'flex', fontFamily: dmSansFamily, fontWeight: 800, fontSize: 26, letterSpacing: 1.2, color: '#F0F4F8' }}>
            FORMULA
            <span style={{ color: '#E8002D', marginLeft: 8 }}>HUB</span>
          </span>
        </div>

        {/* Lower-left: title + byline */}
        <div style={{ position: 'absolute', left: 56, right: 56, bottom: 52, display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontFamily: bebasFamily,
              fontSize: titleSize,
              lineHeight: 0.94,
              color: '#F0F4F8',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              maxWidth: 1040,
            }}
          >
            {title}
          </div>
          {byline && (
            <div style={{ marginTop: 18, fontFamily: dmSansFamily, fontWeight: 400, fontSize: 17, color: 'rgba(255,255,255,0.82)' }}>
              {byline}
            </div>
          )}
        </div>
      </div>
    ),
    // Only pass `fonts` when at least one actually loaded — an explicit
    // empty array makes Satori throw ("No fonts are loaded"), whereas
    // omitting the key lets next/og fall back to its own built-in default
    // font, so the route still returns 200 even if every Google Fonts
    // fetch fails (e.g. total network outage to fonts.googleapis.com).
    fonts.length > 0 ? { width: 1200, height: 630, fonts } : { width: 1200, height: 630 }
  )
}
