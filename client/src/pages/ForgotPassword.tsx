import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { AuthAside } from '../components/AuthAside'
import { Alert, Button, Card, Field, Input, PasswordRequirements } from '../components/ui'
import { api } from '../lib/api'
import { isStrongPassword } from '../lib/password'

export function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState<'email' | 'reset'>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const requestCode = async (event: FormEvent) => {
    event.preventDefault(); setError(null); setLoading(true)
    try { await api.post('/auth/forgot-password', { email }); setStep('reset') }
    catch (err) { setError(err instanceof Error ? err.message : 'Could not send the code') }
    finally { setLoading(false) }
  }

  const resetPassword = async (event: FormEvent) => {
    event.preventDefault(); setError(null)
    if (password !== confirm) { setError('Passwords do not match.'); return }
    setLoading(true)
    try { await api.post('/auth/reset-password', { email, code, password }); navigate('/sign-in', { replace: true }) }
    catch (err) { setError(err instanceof Error ? err.message : 'Could not reset password') }
    finally { setLoading(false) }
  }

  return <div className="auth-shell">
    <AuthAside headline="Get back to business." subtitle="Secure account recovery without support tickets or waiting for manual help." />
    <main className="auth-main"><Card className="auth-card" pad>
      {step === 'email' ? <form className="stack" onSubmit={requestCode}>
        <div className="stack-sm"><span className="page-kicker">Account recovery</span><h1>Reset your password</h1><p className="muted">Enter your account email and we’ll send a six-digit code.</p></div>
        {error && <Alert tone="error">{error}</Alert>}
        <Field htmlFor="reset-email" label="Email"><Input autoFocus id="reset-email" onChange={(e) => setEmail(e.target.value)} required type="email" value={email} /></Field>
        <Button block loading={loading} type="submit">Send recovery code</Button><Link className="auth-back-link" to="/sign-in">Back to sign in</Link>
      </form> : <form className="stack" onSubmit={resetPassword}>
        <div className="stack-sm"><span className="page-kicker">Check your inbox</span><h1>Create a new password</h1><p className="muted">Enter the code sent to <strong>{email}</strong>.</p></div>
        {error && <Alert tone="error">{error}</Alert>}
        <Field htmlFor="reset-code" label="Six-digit code"><Input autoComplete="one-time-code" className="otp-code-input" id="reset-code" inputMode="numeric" maxLength={6} onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000" required value={code} /></Field>
        <Field htmlFor="new-password" label="New password"><Input id="new-password" minLength={10} onChange={(e) => setPassword(e.target.value)} required type="password" value={password} /><PasswordRequirements password={password} /></Field>
        <Field htmlFor="confirm-password" label="Confirm password"><Input id="confirm-password" onChange={(e) => setConfirm(e.target.value)} required type="password" value={confirm} />{confirm && <span className={`password-match ${password === confirm ? 'met' : ''}`}>{password === confirm ? 'Passwords match' : 'Passwords do not match'}</span>}</Field>
        <Button block disabled={code.length !== 6 || !isStrongPassword(password) || password !== confirm} loading={loading} type="submit">Update password</Button><button className="btn btn--ghost" onClick={() => setStep('email')} type="button">Use a different email</button>
      </form>}
    </Card></main>
  </div>
}
