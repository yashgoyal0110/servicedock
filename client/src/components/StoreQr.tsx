import { QRCodeCanvas } from 'qrcode.react'
import { useRef, useState } from 'react'

import { CheckIcon, CopyIcon, DownloadIcon } from './icons'
import { Button, Field, Input } from './ui'

/**
 * Embeddable QR block for the dashboard store page. Renders a canvas QR of the
 * public store URL with "Copy link" and "Download PNG" actions. Ported (and
 * simplified) from the Next.js qr-code-customizer.tsx + clipboard-share.tsx.
 *
 * Props: { url } — the fully-qualified public store URL to encode/share.
 */
type StoreQrProps = {
  url: string
}

const QR_SIZE = 256

export function StoreQr({ url }: StoreQrProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [copied, setCopied] = useState(false)

  const copyLink = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadPng = () => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }
    const link = document.createElement('a')
    link.download = 'store-qr-code.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="stack">
      <p className="muted text-sm">
        Anyone with this link can view the customer-facing catalog.
      </p>
      <div
        style={{
          padding: 12,
          background: '#fff',
          width: 'fit-content',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--line)',
        }}
      >
        <QRCodeCanvas level="H" ref={canvasRef} size={QR_SIZE} value={url} />
      </div>
      <Field htmlFor="store-public-link" label="Public link">
        <Input id="store-public-link" readOnly value={url} />
      </Field>
      <div className="row">
        <Button onClick={copyLink} variant="secondary">
          {copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
          {copied ? 'Copied!' : 'Copy link'}
        </Button>
        <Button onClick={downloadPng} variant="secondary">
          <DownloadIcon size={16} />
          Download PNG
        </Button>
      </div>
    </div>
  )
}
