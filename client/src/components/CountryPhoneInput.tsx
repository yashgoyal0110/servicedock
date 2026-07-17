import { useMemo } from 'react'

import { Input, Select } from './ui'

/** Curated list of common country dialing codes. */
export const COUNTRY_CODES = [
  { code: '+1', flag: '🇺🇸', name: 'US/Canada' },
  { code: '+44', flag: '🇬🇧', name: 'UK' },
  { code: '+91', flag: '🇮🇳', name: 'India' },
  { code: '+61', flag: '🇦🇺', name: 'Australia' },
  { code: '+54', flag: '🇦🇷', name: 'Argentina' },
  { code: '+55', flag: '🇧🇷', name: 'Brazil' },
  { code: '+52', flag: '🇲🇽', name: 'Mexico' },
  { code: '+34', flag: '🇪🇸', name: 'Spain' },
  { code: '+49', flag: '🇩🇪', name: 'Germany' },
  { code: '+33', flag: '🇫🇷', name: 'France' },
  { code: '+39', flag: '🇮🇹', name: 'Italy' },
  { code: '+81', flag: '🇯🇵', name: 'Japan' },
  { code: '+971', flag: '🇦🇪', name: 'UAE' },
  { code: '+27', flag: '🇿🇦', name: 'South Africa' },
] as const

const DEFAULT_CODE = '+1'
// Codes sorted longest-first so we match e.g. +971 before +9/+97.
const CODES_BY_LENGTH = [...COUNTRY_CODES]
  .map((c) => c.code)
  .sort((a, b) => b.length - a.length)

/** Splits a stored E.164 value into { dialCode, national }. */
function splitPhone(value: string): { dialCode: string; national: string } {
  const trimmed = (value ?? '').replace(/\s+/g, '')
  if (trimmed.startsWith('+')) {
    const match = CODES_BY_LENGTH.find((code) => trimmed.startsWith(code))
    if (match) {
      return { dialCode: match, national: trimmed.slice(match.length) }
    }
  }
  return { dialCode: DEFAULT_CODE, national: trimmed.replace(/\D/g, '') }
}

type Props = {
  value: string
  onChange: (e164: string) => void
  id?: string
  required?: boolean
}

/**
 * Country-code select + national number input. Emits an E.164 string
 * (`+<code><digits>`) via onChange. National input accepts digits only.
 */
export function CountryPhoneInput({ value, onChange, id, required }: Props) {
  const { dialCode, national } = useMemo(() => splitPhone(value), [value])
  const countryDigits = dialCode.replace(/\D/g, '').length
  const totalDigits = countryDigits + national.length
  const minNationalLength = Math.max(1, 7 - countryDigits)
  const maxNationalLength = 15 - countryDigits
  const validLength = totalDigits >= 7 && totalDigits <= 15

  const emit = (nextDial: string, nextNational: string) => {
    const digits = nextNational.replace(/\D/g, '')
    onChange(digits ? `${nextDial}${digits}` : '')
  }

  return (
    <div className="phone-input-wrap">
      <div className="row" style={{ alignItems: 'stretch', gap: '0.5rem' }}>
      <Select
        aria-label="Country code"
        onChange={(e) => emit(e.target.value, national)}
        style={{ width: 'auto', flex: '0 0 auto' }}
        value={dialCode}
      >
        {COUNTRY_CODES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.flag} {c.code}
          </option>
        ))}
      </Select>
      <Input
        aria-describedby={id ? `${id}-help` : undefined}
        aria-invalid={national.length > 0 && !validLength}
        autoComplete="tel-national"
        id={id}
        inputMode="tel"
        maxLength={maxNationalLength}
        minLength={minNationalLength}
        onChange={(e) => emit(dialCode, e.target.value)}
        placeholder="Phone number"
        required={required}
        type="tel"
        value={national}
      />
      </div>
      <span className={`phone-help ${validLength ? 'valid' : ''}`} id={id ? `${id}-help` : undefined}>
        {totalDigits}/15 digits including country code
      </span>
    </div>
  )
}
