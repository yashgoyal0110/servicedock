import { type ChangeEvent, useState } from 'react'

import { UploadIcon } from './icons'
import { Alert, Spinner } from './ui'

type UploadKind = 'logo' | 'banner'

type UploadImageProps = {
  storeId: string
  kind: UploadKind
  currentUrl?: string
  onUploaded: (url: string) => void
}

type UploadResponse = {
  logo?: { url: string }
  banner?: { url: string }
}

/**
 * Reusable image uploader for a store's logo or banner. POSTs the selected
 * file (multipart field "file") to the local-disk upload endpoint and reports
 * the new URL back via onUploaded. The api helper is JSON-only, so this uses
 * fetch directly with credentials so the auth cookie is sent.
 */
export function UploadImage({
  storeId,
  kind,
  currentUrl,
  onUploaded,
}: UploadImageProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const label = kind === 'logo' ? 'Logo' : 'Banner'

  const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      return
    }

    setError(null)
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch(`/api/stores/${storeId}/${kind}`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      const body = (await res.json().catch(() => null)) as
        | (UploadResponse & { error?: string })
        | null

      if (!res.ok) {
        throw new Error(body?.error ?? `Upload failed (${res.status})`)
      }

      const url = body?.logo?.url ?? body?.banner?.url
      if (!url) {
        throw new Error('Upload succeeded but no URL was returned.')
      }

      onUploaded(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      // Reset so selecting the same file again re-triggers change.
      e.target.value = ''
    }
  }

  const lower = label.toLowerCase()

  return (
    <div className="stack-sm">
      <span className="field-label">{label}</span>

      <div
        style={{
          display: 'grid',
          placeItems: 'center',
          minHeight: 120,
          padding: '0.75rem',
          border: '1px dashed var(--line-strong)',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--surface-2)',
          overflow: 'hidden',
        }}
      >
        {currentUrl ? (
          <img
            alt={`Store ${lower}`}
            src={currentUrl}
            style={{ display: 'block', maxWidth: '100%', height: 'auto' }}
          />
        ) : (
          <span className="muted text-sm">No {lower} yet</span>
        )}
      </div>

      {/* Input is nested inside the label (no htmlFor) so the picker opens
          exactly once — combining htmlFor + nesting double-fires in some
          browsers. */}
      <label className="btn btn--secondary btn--sm">
        <UploadIcon size={16} />
        {currentUrl ? `Replace ${lower}` : `Upload ${lower}`}
        <input
          accept="image/png,image/jpeg,.png,.jpg,.jpeg"
          disabled={uploading}
          onChange={onChange}
          style={{ display: 'none' }}
          type="file"
        />
      </label>

      {uploading && (
        <span className="row text-sm muted">
          <Spinner /> Uploading…
        </span>
      )}
      {error && <Alert tone="error">{error}</Alert>}
    </div>
  )
}
