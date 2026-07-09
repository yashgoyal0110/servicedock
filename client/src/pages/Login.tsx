import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { AuthAside } from '../components/AuthAside'
import { Alert, Button, Card, Field, Input } from '../components/ui'
import { useAuth } from '../context/auth'

export function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const result = await login(email, password)
      if (result.status === 'needs-verification') {
        navigate(`/verify?email=${encodeURIComponent(result.email)}`)
        return
      }
      navigate('/dashboard/stores')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-shell">
      <AuthAside
        headline="Welcome back to ServiceDock."
        subtitle="Sign in to manage your locations, services, and public QR catalogs."
      />

      <main className="auth-main">
        <Card className="auth-card" pad>
          <form className="stack" onSubmit={onSubmit}>
            <div className="stack-sm">
              <h1 style={{ margin: 0 }}>Welcome back</h1>
              <p className="muted" style={{ margin: 0 }}>
                Sign in to manage your stores and catalogs.
              </p>
            </div>

            {error && <Alert tone="error">{error}</Alert>}

            <Field htmlFor="email" label="Email">
              <Input
                autoComplete="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                required
                type="email"
                value={email}
              />
            </Field>

            <Field htmlFor="password" label="Password">
              <Input
                autoComplete="current-password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                required
                type="password"
                value={password}
              />
            </Field>

            <Button block loading={submitting} type="submit">
              {submitting ? 'Signing in…' : 'Sign in'}
            </Button>

            <p className="muted" style={{ margin: 0, textAlign: 'center' }}>
              No account? <Link to="/sign-up">Create one</Link>
            </p>
          </form>
        </Card>
      </main>
    </div>
  )
}
