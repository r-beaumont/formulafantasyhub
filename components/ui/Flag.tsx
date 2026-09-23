// Shared flag icon. `size` is the rendered height in px; width follows the
// flag-icons 4:3-ish aspect ratio at size * 1.34.
export default function Flag({ code, size = 14 }: { code: string; size?: number }) {
  return (
    <span
      className={`fi fi-${code}`}
      style={{
        width: `${size * 1.34}px`,
        height: `${size}px`,
        borderRadius: '3px',
        display: 'inline-block',
        backgroundSize: 'cover',
        alignSelf: 'center',
        flexShrink: 0,
        boxShadow: '0 0 0 1px rgba(255,255,255,0.08)',
        transition: 'transform .2s',
      }}
    />
  )
}
