'use client'
import { useState } from 'react'

export default function SubscribeBox() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Not wired to Kit yet — that's the next task. For now, just confirm.
    setSubmitted(true)
  }

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '24px', alignItems: 'center',
      padding: '28px', borderRadius: '18px', border: '1px solid var(--border)',
      background: 'radial-gradient(90% 140% at 100% 0%, rgba(232,0,45,0.16), transparent 60%), var(--surface)',
    }} className="subx-grid">
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 800px) { .subx-grid { grid-template-columns: 1fr !important; } }
        .subx-input:focus { outline: none; border-color: #E8002D !important; box-shadow: 0 0 0 3px rgba(232,0,45,0.25); }
        .subx-btn { transition: transform .15s, background .15s; }
        .subx-btn:hover { transform: translateY(-1px); background: #c90027; }
      ` }} />
      <div>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 400, fontSize: '38px', lineHeight: 1, marginBottom: '10px', color: 'var(--text)' }}>
          Get every article in your inbox
        </div>
        <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
          Race week previews, What We Learned recaps and F1 Fantasy strategy, sent the moment they&apos;re published. Free, no spam, unsubscribe anytime.
        </p>
      </div>
      <div>
        {submitted ? (
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#00C851' }}>
            ✓ You&apos;re in. Check your inbox to confirm your subscription.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <input
                type="email"
                required
                placeholder="you@email.com"
                className="subx-input"
                style={{
                  flex: 1, minWidth: '180px', background: 'var(--surface2)', border: '1px solid var(--border2, rgba(255,255,255,0.12))',
                  borderRadius: '10px', padding: '12px 14px', color: 'var(--text)', fontSize: '14px',
                  fontFamily: "'DM Sans', sans-serif", transition: 'border-color .2s, box-shadow .2s',
                }}
              />
              <button
                type="submit"
                className="subx-btn"
                style={{
                  background: '#E8002D', color: '#fff', border: '1px solid #E8002D', borderRadius: '10px',
                  padding: '12px 22px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
                }}
              >
                Subscribe
              </button>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '10px', marginBottom: 0 }}>
              Free forever. Emails are managed by Kit. By subscribing you agree to our privacy notice.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
