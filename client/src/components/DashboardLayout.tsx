import { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

import { useAuth } from '../context/auth'
import { api } from '../lib/api'
import {
  CreditCardIcon,
  LockIcon,
  LogOutIcon,
  MenuIcon,
  StoreIcon,
  UserIcon,
} from './icons'
import { Button } from './ui'

const NAV = [
  { to: '/dashboard/stores', label: 'Locations', icon: StoreIcon },
  { to: '/dashboard/billing', label: 'Billing', icon: CreditCardIcon },
  { to: '/dashboard/account', label: 'Account', icon: UserIcon },
]

export function DashboardLayout() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [locationCount, setLocationCount] = useState<number | null>(null)
  const initial = (user?.name || user?.email || '?').charAt(0).toUpperCase()

  useEffect(() => {
    const refreshLocationCount = () => {
      api.get<{ stores: Array<{ id: string }> }>('/stores')
        .then(({ stores }) => setLocationCount(stores.length))
        .catch(() => setLocationCount(null))
    }
    refreshLocationCount()
    window.addEventListener('servicedock:locations-changed', refreshLocationCount)
    return () => window.removeEventListener('servicedock:locations-changed', refreshLocationCount)
  }, [])

  return (
    <div className="app-shell">
      <button
        aria-label="Close menu"
        className={`sidebar-backdrop ${open ? 'show' : ''}`}
        onClick={() => setOpen(false)}
        type="button"
      />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="brand">
          <span className="brand-mark">
            <StoreIcon size={18} />
          </span>
          ServiceDock
        </div>
        <div className="sidebar-label">Manage</div>
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            end={to === '/dashboard/stores'}
            key={to}
            onClick={() => setOpen(false)}
            to={to}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
        <div className="spacer" />
        <div className={`sidebar-promo ${locationCount === 0 ? 'sidebar-promo--locked' : ''}`}>
          <span className="sidebar-promo__eyebrow">{locationCount === 0 ? <><LockIcon size={12} /> Publishing locked</> : 'Your storefront'}</span>
          <strong>{locationCount === null ? 'Checking storefront…' : locationCount === 0 ? 'Create a location first' : 'Ready to be discovered'}</strong>
          <p>{locationCount === null ? 'Loading your publishing status.' : locationCount === 0 ? 'Your QR code and public URL unlock with your first location.' : 'Keep your services fresh and share your QR anywhere.'}</p>
        </div>
        <button className="nav-link" onClick={() => logout()} type="button">
          <LogOutIcon size={18} />
          Sign out
        </button>
      </aside>

      <div className="app-main">
        <header className="topbar">
          <button
            aria-label="Open menu"
            className="icon-btn menu-btn"
            onClick={() => setOpen(true)}
            type="button"
          >
            <MenuIcon size={18} />
          </button>
          <div className="topbar-copy">
            <strong>Good to see you, {user?.name?.split(' ')[0] ?? 'there'}.</strong>
            <span>Make every customer touchpoint count.</span>
          </div>
          <div className="spacer" />
          <div className="row">
            <span className="topbar-email text-sm muted">{user?.email}</span>
            <span className="avatar">{initial}</span>
          </div>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

/** Small helper other pages can reuse for a "sign out" CTA if needed. */
export function SignOutButton() {
  const { logout } = useAuth()
  return (
    <Button onClick={() => logout()} variant="secondary">
      Sign out
    </Button>
  )
}
