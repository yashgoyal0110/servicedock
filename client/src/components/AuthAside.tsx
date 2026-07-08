import { MapPinIcon, QrIcon, SparklesIcon, StoreIcon } from './icons'

type AuthAsideProps = {
  headline?: string
  subtitle?: string
}

const SAMPLE_SERVICES = [
  ['Oil change', '$49'],
  ['Brake inspection', '$89'],
  ['Tire rotation', '$29'],
] as const

/**
 * Marketing panel shown beside the auth forms on wide screens. Uses an
 * illustrative product preview (a sample public menu) rather than empty space
 * or stock imagery, so it reads as a real business tool.
 */
export function AuthAside({
  headline = 'Run your storefront like the pros.',
  subtitle = 'Digital catalogs, QR menus, and branded PDFs — everything your local business needs to look sharp and win more customers.',
}: AuthAsideProps) {
  return (
    <aside className="auth-aside">
      <div className="row auth-brand">
        <span className="brand-mark">
          <StoreIcon size={18} />
        </span>
        ServiceDock
      </div>

      <div>
        <span className="auth-eyebrow">The local business toolkit</span>
        <h2 className="auth-headline">{headline}</h2>
        <p className="auth-sub">{subtitle}</p>
      </div>

      <div className="auth-preview">
        <div className="auth-preview-head">
          <span className="auth-preview-logo">R</span>
          <div>
            <strong>Riverside Auto Care</strong>
            <div className="auth-preview-sub">
              <MapPinIcon size={12} /> Austin, Texas
            </div>
          </div>
          <span className="auth-preview-qr">
            <QrIcon size={20} />
          </span>
        </div>
        {SAMPLE_SERVICES.map(([name, price]) => (
          <div className="auth-preview-row" key={name}>
            <span>{name}</span>
            <b>{price}</b>
          </div>
        ))}
      </div>

      <div className="auth-features">
        <span className="auth-chip">
          <QrIcon size={14} /> QR menus
        </span>
        <span className="auth-chip">
          <StoreIcon size={14} /> Multi-location
        </span>
        <span className="auth-chip">
          <SparklesIcon size={14} /> AI import
        </span>
      </div>
      <p className="auth-proof">Built for independent teams who care how their business shows up.</p>
    </aside>
  )
}
