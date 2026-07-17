import { StoreIcon } from './icons'

type AuthAsideProps = {
  headline?: string
  subtitle?: string
}

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

      <div className="auth-outcomes">
        <div><span>01</span><strong>Publish a professional service catalog</strong><p>Clear pricing and descriptions customers can browse on any device.</p></div>
        <div><span>02</span><strong>Turn local interest into conversations</strong><p>Every location gets one shareable link and a direct contact path.</p></div>
        <div><span>03</span><strong>Keep the whole business consistent</strong><p>Update services once without replacing printed menus everywhere.</p></div>
      </div>
      <p className="auth-proof">For independent service businesses that want to look established from day one.</p>
    </aside>
  )
}
