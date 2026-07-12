import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import {
  ExternalLinkIcon,
  MapPinIcon,
  StoreIcon,
} from '../components/icons'
import { Alert, EmptyState, Spinner } from '../components/ui'
import { api } from '../lib/api'
import '../styles/public.css'

type PublicStoreSummary = {
  id: string
  name: string
  slug: string | null
  cityName: string
  address: string
  logoUrl: string | null
}

// Prefer the human-friendly slug for the public URL, fall back to the id.
const storePath = (city: string, store: PublicStoreSummary) =>
  `/stores/${city}/${store.slug ?? store.id}`

// Minimal public top bar — the directory renders outside the dashboard shell.
function PublicNav() {
  return (
    <nav className="public-nav">
      <Link className="public-nav__brand" to="/">
        <span className="brand-mark">
          <StoreIcon size={18} />
        </span>
        ServiceDock
      </Link>
      <Link className="btn btn--secondary btn--sm" to="/sign-up">
        Create your own
      </Link>
    </nav>
  )
}

function PublicFooter() {
  return (
    <footer className="public-footer">
      Powered by <Link to="/">ServiceDock</Link>
    </footer>
  )
}

export function PublicCity() {
  const { city } = useParams<{ city: string }>()
  const [stores, setStores] = useState<PublicStoreSummary[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!city) {
      return
    }
    setLoading(true)
    api
      .get<{ stores: PublicStoreSummary[] }>(`/public/stores/${city}`)
      .then((res) => setStores(res.stores))
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Failed to load stores')
      )
      .finally(() => setLoading(false))
  }, [city])

  if (loading) {
    return (
      <div className="public-shell">
        <PublicNav />
        <div className="public-state">
          <div className="stack">
            <Spinner />
            <p className="muted">Loading providers…</p>
          </div>
        </div>
        <PublicFooter />
      </div>
    )
  }

  const cityName = stores[0]?.cityName ?? city

  return (
    <div className="public-shell">
      <PublicNav />
      <main className="public-container">
        <div className="public-page-head">
          <h1>Service providers in {cityName}</h1>
          <p className="muted">
            Browse published storefronts and open a catalog.
          </p>
        </div>

        {error ? <Alert tone="error">{error}</Alert> : null}

        {stores.length === 0 ? (
          <EmptyState
            icon={<StoreIcon size={30} />}
            title="Nothing here yet"
          >
            No stores are published in this area yet.
          </EmptyState>
        ) : (
          <div className="store-grid">
            {stores.map((store) => (
              <Link
                className="store-card"
                key={store.id}
                to={storePath(city ?? '', store)}
              >
                {store.logoUrl ? (
                  <img
                    alt={`${store.name} logo`}
                    className="store-card__logo"
                    src={store.logoUrl}
                  />
                ) : (
                  <div className="store-card__logo store-card__logo--fallback">
                    <StoreIcon size={26} />
                  </div>
                )}
                <div className="store-card__name">{store.name}</div>
                <div className="store-card__meta">
                  <MapPinIcon size={15} />
                  <span>
                    {store.address}, {store.cityName}
                  </span>
                </div>
                <span className="store-card__cta">
                  View catalog
                  <ExternalLinkIcon size={14} />
                </span>
              </Link>
            ))}
          </div>
        )}
      </main>
      <PublicFooter />
    </div>
  )
}
