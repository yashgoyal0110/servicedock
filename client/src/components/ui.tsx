import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'

function cx(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(' ')
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  block?: boolean
  loading?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  block,
  loading,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cx(
        'btn',
        `btn--${variant}`,
        size !== 'md' && `btn--${size}`,
        block && 'btn--block',
        className,
      )}
      disabled={disabled || loading}
      type={props.type ?? 'button'}
      {...props}
    >
      {loading && <span className="spinner" style={{ borderTopColor: '#fff' }} />}
      {children}
    </button>
  )
}

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string
  danger?: boolean
}

export function IconButton({
  label,
  danger,
  className,
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      aria-label={label}
      className={cx('icon-btn', danger && 'icon-btn--danger', className)}
      title={label}
      type="button"
      {...props}
    >
      {children}
    </button>
  )
}

type FieldProps = {
  label: string
  hint?: string
  children: ReactNode
  htmlFor?: string
}

export function Field({ label, hint, htmlFor, children }: FieldProps) {
  return (
    <div className="field">
      <label className="field-label" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {hint && <span className="hint">{hint}</span>}
    </div>
  )
}

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cx('input', className)} {...props} />
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cx('textarea', className)} {...props} />
}

export function Select({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cx('select', className)} {...props}>
      {children}
    </select>
  )
}

export function Card({
  className,
  children,
  pad,
}: {
  className?: string
  children: ReactNode
  pad?: boolean
}) {
  return (
    <div className={cx('card', pad && 'card--pad', className)}>{children}</div>
  )
}

export function Badge({
  tone = 'neutral',
  children,
}: {
  tone?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger'
  children: ReactNode
}) {
  return <span className={`badge badge--${tone}`}>{children}</span>
}

export function Alert({
  tone = 'info',
  children,
}: {
  tone?: 'info' | 'error' | 'success'
  children: ReactNode
}) {
  return (
    <div className={`alert alert--${tone}`} role="alert">
      {children}
    </div>
  )
}

export function Spinner() {
  return <span aria-label="Loading" className="spinner" role="status" />
}

export function PageHead({
  title,
  subtitle,
  actions,
}: {
  title: string
  subtitle?: string
  actions?: ReactNode
}) {
  return (
    <div className="page-head row-between">
      <div>
        <span className="page-kicker">Workspace</span>
        <h1>{title}</h1>
        {subtitle && <p className="muted">{subtitle}</p>}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </div>
  )
}

export function EmptyState({
  icon,
  title,
  children,
}: {
  icon?: ReactNode
  title: string
  children?: ReactNode
}) {
  return (
    <div className="empty">
      {icon}
      <h2 style={{ color: 'var(--ink)' }}>{title}</h2>
      {children && <p className="muted" style={{ marginTop: '0.4rem' }}>{children}</p>}
    </div>
  )
}
