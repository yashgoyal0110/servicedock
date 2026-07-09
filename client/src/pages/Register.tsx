import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { AuthAside } from '../components/AuthAside'
import { Alert, Button, Card, Field, Input } from '../components/ui'
import { useAuth } from '../context/auth'

export function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await register(name, email, password)
      // Account created — go verify the email with the code we just sent.
      navigate(`/verify?email=${encodeURIComponent(email)}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-shell">
      <AuthAside
        headline="Start sharing your catalog in minutes."
        subtitle="Set up your locations and services, then share a polished public menu with a QR code."
      />

      <main className="auth-main">
        <Card className="auth-card" pad>
          <form className="stack" onSubmit={onSubmit}>
            <div className="stack-sm">
              <h1 style={{ margin: 0 }}>Create your account</h1>
              <p className="muted" style={{ margin: 0 }}>
                Set up your workspace and start building.
              </p>
            </div>

            {error && <Alert tone="error">{error}</Alert>}

            <Field htmlFor="name" label="Name">
              <Input
                autoComplete="name"
                id="name"
                onChange={(e) => setName(e.target.value)}
                required
                type="text"
                value={name}
              />
            </Field>

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

            <Field hint="At least 8 characters" htmlFor="password" label="Password">
              <Input
                autoComplete="new-password"
                id="password"
                minLength={8}
                onChange={(e) => setPassword(e.target.value)}
                required
                type="password"
                value={password}
              />
            </Field>

            <Button block loading={submitting} type="submit">
              {submitting ? 'Creating…' : 'Create account'}
            </Button>

            <p className="muted" style={{ margin: 0, textAlign: 'center' }}>
              Already have an account? <Link to="/sign-in">Sign in</Link>
            </p>
          </form>
        </Card>
      </main>
    </div>
  )
}
