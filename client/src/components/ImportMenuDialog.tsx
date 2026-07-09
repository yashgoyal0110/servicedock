import { type ChangeEvent, type FormEvent, useId, useState } from 'react'

import { UploadIcon } from './icons'
import { Alert, Button, Spinner } from './ui'

type ImportMenuDialogProps = {
  storeId: string
  /** Called after a successful import with the number of services created. */
  onImported: (created: number) => void
}

type ImportResponse = {
  created?: number
  error?: string
}

/**
 * AI service-catalog import. Uploads an image or PDF (multipart field "file")
 * to POST /api/stores/:id/import; the server sends it to Gemini, extracts the
 * services, and bulk-creates them. Reports the created count back via
 * onImported. Ported from the Next.js import-menu-dialog.tsx.
 */
export function ImportMenuDialog({ storeId, onImported }: ImportMenuDialogProps) {
  const inputId = useId()
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null)
    setMessage(null)
    setFile(e.target.files?.[0] ?? null)
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) {
      setError('Please select a file.')
      return
    }

    setError(null)
    setMessage(null)
    setImporting(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch(`/api/stores/${storeId}/import`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      const body = (await res.json().catch(() => null)) as ImportResponse | null

      if (!res.ok) {
        throw new Error(body?.error ?? `Import failed (${res.status})`)
      }

      const created = body?.created ?? 0
      const serviceWord = created === 1 ? 'service' : 'services'
      setMessage(`${created} ${serviceWord} imported successfully.`)
      setFile(null)
      onImported(created)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed')
    } finally {
      setImporting(false)
    }
  }

  return (
    <form className="stack" onSubmit={onSubmit}>
      <p className="muted text-sm">
        Upload a service sheet, estimate, or PDF and AI will extract services
        automatically.
      </p>

      <label className="field-label" htmlFor={inputId}>
        Service sheet (PDF, PNG, JPG, or WEBP — max 10MB)
      </label>
      <label className="btn btn--secondary" htmlFor={inputId} style={{ width: 'fit-content' }}>
        <UploadIcon size={16} />
        {file ? file.name : 'Choose file'}
        <input
          accept="image/*,application/pdf"
          disabled={importing}
          id={inputId}
          onChange={onFileChange}
          style={{ display: 'none' }}
          type="file"
        />
      </label>

      <div>
        <Button disabled={importing || !file} loading={importing} type="submit">
          {importing ? 'Importing…' : 'Import'}
        </Button>
      </div>

      {importing && (
        <span className="row text-sm muted">
          <Spinner /> This can take a few seconds…
        </span>
      )}
      {message && <Alert tone="success">{message}</Alert>}
      {error && <Alert tone="error">{error}</Alert>}
    </form>
  )
}
