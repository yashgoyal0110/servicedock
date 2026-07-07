import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

import { api, ApiError } from '../lib/api'

export type User = {
  id: string
  name: string
  email: string
  imageUrl?: string
}

/** Login resolves to either a signed-in user or a request to verify email. */
export type LoginResult =
  | { status: 'ok' }
  | { status: 'needs-verification'; email: string }

type AuthContextValue = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<LoginResult>
  /** Registration always requires email verification before sign-in. */
  register: (name: string, email: string, password: string) => Promise<void>
  verify: (email: string, code: string) => Promise<void>
  resend: (email: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get<{ user: User }>('/auth/me')
      .then((res) => setUser(res.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const login = async (
    email: string,
    password: string,
  ): Promise<LoginResult> => {
    try {
      const res = await api.post<{ user: User }>('/auth/login', {
        email,
        password,
      })
      setUser(res.user)
      return { status: 'ok' }
    } catch (err) {
      // Unverified accounts get a 403 with { needsVerification, email }.
      if (err instanceof ApiError && err.status === 403) {
        const data = err.data as { needsVerification?: boolean; email?: string }
        if (data?.needsVerification && data.email) {
          return { status: 'needs-verification', email: data.email }
        }
      }
      throw err
    }
  }

  const register = async (name: string, email: string, password: string) => {
    // Server sends an OTP and does NOT sign the user in yet.
    await api.post('/auth/register', { name, email, password })
  }

  const verify = async (email: string, code: string) => {
    const res = await api.post<{ user: User }>('/auth/verify', { email, code })
    setUser(res.user)
  }

  const resend = async (email: string) => {
    await api.post('/auth/resend', { email })
  }

  const logout = async () => {
    await api.post('/auth/logout')
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, verify, resend, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
