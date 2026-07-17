import { type FormEvent, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import { AddressSearch } from '../components/AddressSearch'
import { CountryPhoneInput } from '../components/CountryPhoneInput'
import {
  MapPinIcon,
  LockIcon,
  PhoneIcon,
  PlusIcon,
  StoreIcon,
  TrashIcon,
} from '../components/icons'
import {
  Alert,
  Badge,
  Button,
  Card,
  EmptyState,
  Field,
  IconButton,
  Input,
  PageHead,
  Spinner,
  Textarea,
} from '../components/ui'
import { api } from '../lib/api'

type Store = {
  id: string
  name: string
  address: string
  cityName: string
  province: string
  phone: string
}

const EMPTY_FORM = {
  name: '',
  description: '',
  address: '',
  citySlug: '',
  cityName: '',
  province: '',
  latitude: '',
  longitude: '',
  phone: '',
}

export function Stores() {
  const [stores, setStores] = useState<Store[]>([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const load = () => {
    api
      .get<{ stores: Store[] }>('/stores')
      .then((res) => setStores(res.stores))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const openForm = () => {
    setShowForm(true)
    requestAnimationFrame(() =>
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    )
  }

  const onCreate = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await api.post('/stores', {
        ...form,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
      })
      setForm(EMPTY_FORM)
      setShowForm(false)
      load()
      window.dispatchEvent(new Event('servicedock:locations-changed'))
    } catch (err) {
      // Surfaces the plan-limit message from the server (403 PLAN_LIMIT).
      setError(err instanceof Error ? err.message : 'Failed to create location')
    }
  }

  const onDelete = async (id: string) => {
    setError(null)
    try {
      await api.del(`/stores/${id}`)
      load()
      window.dispatchEvent(new Event('servicedock:locations-changed'))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete')
    }
  }

  return (
    <>
      <PageHead
        actions={
          <Button onClick={openForm}>
            <PlusIcon size={16} />
            Add location
          </Button>
        }
        subtitle="Your service locations"
        title="Locations"
      />

      <div className="stack">
        <section className="location-hero">
          <div>
            <span className="location-hero__eyebrow">Your network</span>
            <h2>Turn every location into a storefront.</h2>
            <p>Publish services, share a beautiful catalog, and make it effortless for nearby customers to reach you.</p>
          </div>
          <div className="location-hero__stat">
            <strong>{stores.length.toString().padStart(2, '0')}</strong>
            <span>live {stores.length === 1 ? 'location' : 'locations'}</span>
          </div>
        </section>

        {error && <Alert tone="error">{error}</Alert>}

        {loading ? (
          <div className="row" style={{ justifyContent: 'center', padding: '2rem' }}>
            <Spinner />
          </div>
        ) : stores.length === 0 ? (
          <Card className="empty-card" pad>
            <EmptyState icon={<StoreIcon size={40} />} title="Your first storefront starts here">
              Add a location and we’ll turn its services into a polished, shareable customer experience.
            </EmptyState>
            <div className="empty-card__action"><Button onClick={openForm}><PlusIcon size={16} /> Create your first location</Button></div>
            <div className="publishing-lock" role="status">
              <LockIcon size={18} />
              <div><strong>QR code and public URL locked</strong><span>Add your first location to unlock customer sharing.</span></div>
            </div>
          </Card>
        ) : (
          <div
            className="grid"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}
          >
            {stores.map((s) => (
              <Card className="location-card" key={s.id}>
                <div className="location-card__visual"><StoreIcon size={24} /><span>Public page live</span></div>
                <div className="card-body stack-sm">
                  <div className="row-between">
                    <Link to={`/dashboard/stores/${s.id}`}>
                      <strong>{s.name}</strong>
                    </Link>
                    <Badge tone="success">Active</Badge>
                  </div>
                  <div className="row text-sm muted">
                    <MapPinIcon size={16} />
                    <span>
                      {s.address}, {s.cityName}, {s.province}
                    </span>
                  </div>
                  <div className="row text-sm muted">
                    <PhoneIcon size={16} />
                    <span>{s.phone}</span>
                  </div>
                  <div className="row-between">
                    <Link className="location-card__manage text-sm" to={`/dashboard/stores/${s.id}`}>
                      Manage storefront <span aria-hidden="true">→</span>
                    </Link>
                    <IconButton
                      danger
                      label="Delete location"
                      onClick={() => onDelete(s.id)}
                    >
                      <TrashIcon size={16} />
                    </IconButton>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {showForm && (
          <Card className="location-form-card">
            <div className="location-form-head">
              <div>
                <span className="page-kicker">New storefront</span>
                <h2>Let’s put your location on the map</h2>
                <p className="muted">Start with an address. We’ll do the tedious parts for you.</p>
              </div>
              <button aria-label="Close location form" className="location-form-close" onClick={() => setShowForm(false)} type="button">×</button>
            </div>
            <form className="location-form" onSubmit={onCreate} ref={formRef}>
              <div className="location-form__main">
                <section className="form-section">
                  <span className="form-step">01</span>
                  <div className="form-section__body">
                    <h3>Find the address</h3>
                    <p className="muted text-sm">Search for the business address and choose the right match.</p>
                    <AddressSearch onSelect={(fields) => setForm({ ...form, ...fields })} />
                  </div>
                </section>
                <section className="form-section">
                  <span className="form-step">02</span>
                  <div className="form-section__body">
                    <h3>Introduce the business</h3>
                    <div className="form-grid">
                      <Field htmlFor="store-name" label="Location name">
                        <Input id="store-name" onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Riverside Auto Care" required value={form.name} />
                      </Field>
                      <Field htmlFor="store-phone" label="Customer phone">
                        <CountryPhoneInput
                          id="store-phone"
                          onChange={(phone) => setForm({ ...form, phone })}
                          required
                          value={form.phone}
                        />
                      </Field>
                    </div>
                    <Field htmlFor="store-description" label="What makes this location special?">
                      <Textarea id="store-description" onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Tell customers what you do best, what to expect, and why they should choose you." required value={form.description} />
                    </Field>
                  </div>
                </section>
                <section className="form-section">
                  <span className="form-step">03</span>
                  <div className="form-section__body">
                    <h3>Review location details</h3>
                    <p className="muted text-sm">These are filled automatically from your address search. You can fine-tune them if needed.</p>
                    <div className="form-grid">
                      <Field htmlFor="store-address" label="Street address"><Input id="store-address" onChange={(e) => setForm({ ...form, address: e.target.value })} required value={form.address} /></Field>
                      <Field htmlFor="store-cityName" label="City"><Input id="store-cityName" onChange={(e) => setForm({ ...form, cityName: e.target.value })} required value={form.cityName} /></Field>
                      <Field htmlFor="store-province" label="Province / state"><Input id="store-province" onChange={(e) => setForm({ ...form, province: e.target.value })} required value={form.province} /></Field>
                      <Field htmlFor="store-citySlug" label="Public URL name"><Input id="store-citySlug" onChange={(e) => setForm({ ...form, citySlug: e.target.value })} required value={form.citySlug} /></Field>
                      <Field htmlFor="store-latitude" label="Latitude">
                        <Input id="store-latitude" onChange={(e) => setForm({ ...form, latitude: e.target.value })} required value={form.latitude} />
                      </Field>
                      <Field htmlFor="store-longitude" label="Longitude">
                        <Input id="store-longitude" onChange={(e) => setForm({ ...form, longitude: e.target.value })} required value={form.longitude} />
                      </Field>
                    </div>
                  </div>
                </section>
              </div>
              <aside className="location-form__preview">
                <span className="preview-label">Customer preview</span>
                <div className="mini-storefront">
                  <div className="mini-storefront__cover"><MapPinIcon size={24} /></div>
                  <div className="mini-storefront__body">
                    <span className="mini-storefront__status">Open for business</span>
                    <strong>{form.name || 'Your location name'}</strong>
                    <p>{form.address || 'Your address will appear here'}{form.cityName ? `, ${form.cityName}` : ''}</p>
                    <div className="mini-storefront__service"><span>Signature service</span><b>View</b></div>
                    <div className="mini-storefront__service"><span>Popular service</span><b>View</b></div>
                  </div>
                </div>
                <p className="preview-note">Customers will get a clean, mobile-friendly page they can open from your QR code.</p>
              </aside>
              <div className="location-form__footer">
                <span className="muted text-sm">You can add logos, photos, and services next.</span>
                <div className="row">
                  <Button onClick={() => setShowForm(false)} type="button" variant="ghost">Save for later</Button>
                  <Button type="submit">Create location <span aria-hidden="true">→</span></Button>
                </div>
              </div>
            </form>
          </Card>
        )}
      </div>
    </>
  )
}
