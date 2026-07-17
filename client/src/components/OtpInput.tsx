import { useState } from 'react'

import { CheckIcon, CopyIcon } from './icons'
import { Input } from './ui'

type OtpInputProps = {
  id: string
  value: string
  onChange: (value: string) => void
}

function cleanCode(value: string): string {
  return value.replace(/\D/g, '').slice(0, 6)
}

export function OtpInput({ id, value, onChange }: OtpInputProps) {
  const [pasted, setPasted] = useState(false)

  const pasteCode = async () => {
    try {
      const code = cleanCode(await navigator.clipboard.readText())
      if (code.length === 6) {
        onChange(code)
        setPasted(true)
        window.setTimeout(() => setPasted(false), 1600)
      }
    } catch {}
  }

  return (
    <div className="otp-input-group">
      <Input
        aria-describedby={`${id}-hint`}
        autoComplete="one-time-code"
        id={id}
        inputMode="numeric"
        maxLength={6}
        onChange={(event) => onChange(cleanCode(event.target.value))}
        placeholder="000000"
        required
        value={value}
      />
      <button className="otp-paste-button" onClick={pasteCode} type="button">
        {pasted ? <CheckIcon size={15} /> : <CopyIcon size={15} />}
        {pasted ? 'Pasted' : 'Paste code'}
      </button>
      <small className="muted" id={`${id}-hint`}>Copy the code from your email, then paste it here.</small>
    </div>
  )
}
