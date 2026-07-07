import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function base({ size = 18, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    ...props,
  }
}

export const EditIcon = (p: IconProps) => (
  <svg {...base(p)} aria-hidden="true">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
)

export const TrashIcon = (p: IconProps) => (
  <svg {...base(p)} aria-hidden="true">
    <path d="M3 6h18" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
  </svg>
)

export const PlusIcon = (p: IconProps) => (
  <svg {...base(p)} aria-hidden="true">
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export const MapPinIcon = (p: IconProps) => (
  <svg {...base(p)} aria-hidden="true">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

export const StoreIcon = (p: IconProps) => (
  <svg {...base(p)} aria-hidden="true">
    <path d="M3 9l1.5-5h15L21 9" />
    <path d="M4 9v11h16V9" />
    <path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" />
    <path d="M9 20v-5h6v5" />
  </svg>
)

export const CreditCardIcon = (p: IconProps) => (
  <svg {...base(p)} aria-hidden="true">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <path d="M2 10h20" />
  </svg>
)

export const UserIcon = (p: IconProps) => (
  <svg {...base(p)} aria-hidden="true">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
  </svg>
)

export const LogOutIcon = (p: IconProps) => (
  <svg {...base(p)} aria-hidden="true">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="M16 17l5-5-5-5M21 12H9" />
  </svg>
)

export const QrIcon = (p: IconProps) => (
  <svg {...base(p)} aria-hidden="true">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <path d="M14 14h3v3M20 14v.01M14 20h.01M17 20h4v-3" />
  </svg>
)

export const UploadIcon = (p: IconProps) => (
  <svg {...base(p)} aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="M17 8l-5-5-5 5M12 3v12" />
  </svg>
)

export const DownloadIcon = (p: IconProps) => (
  <svg {...base(p)} aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="M7 10l5 5 5-5M12 15V3" />
  </svg>
)

export const SparklesIcon = (p: IconProps) => (
  <svg {...base(p)} aria-hidden="true">
    <path d="M12 3l1.9 4.6L18.5 9.5 13.9 11.4 12 16l-1.9-4.6L5.5 9.5l4.6-1.9Z" />
    <path d="M19 15l.8 2 .2.8-2-.8-2 .8.8-2-.8-2 2 .8Z" />
  </svg>
)

export const CheckIcon = (p: IconProps) => (
  <svg {...base(p)} aria-hidden="true">
    <path d="M20 6L9 17l-5-5" />
  </svg>
)

export const XIcon = (p: IconProps) => (
  <svg {...base(p)} aria-hidden="true">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
)

export const ArrowLeftIcon = (p: IconProps) => (
  <svg {...base(p)} aria-hidden="true">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
)

export const PhoneIcon = (p: IconProps) => (
  <svg {...base(p)} aria-hidden="true">
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1.1-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z" />
  </svg>
)

export const MenuIcon = (p: IconProps) => (
  <svg {...base(p)} aria-hidden="true">
    <path d="M3 12h18M3 6h18M3 18h18" />
  </svg>
)

export const CopyIcon = (p: IconProps) => (
  <svg {...base(p)} aria-hidden="true">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
)

export const ExternalLinkIcon = (p: IconProps) => (
  <svg {...base(p)} aria-hidden="true">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <path d="M15 3h6v6M10 14L21 3" />
  </svg>
)
