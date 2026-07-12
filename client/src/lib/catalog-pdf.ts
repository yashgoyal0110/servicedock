import { jsPDF } from 'jspdf'

/**
 * Branded, dependency-light (jsPDF only) A4 catalog generator for the public
 * storefront. Everything is laid out manually in millimetres so spacing and
 * page-breaks stay predictable — no autotable plugin.
 */

const PRODUCT_CATEGORIES = ['Repairs', 'Plans', 'AddOns'] as const
type CatalogCategory = (typeof PRODUCT_CATEGORIES)[number]

const CATEGORY_LABELS: Record<CatalogCategory, string> = {
  Repairs: 'Repairs',
  Plans: 'Plans',
  AddOns: 'Add-ons',
}

export type CatalogProduct = {
  name: string
  price: number
  description: string
  category: CatalogCategory
}

export type CatalogStore = {
  name: string
  slug: string | null
  address: string
  cityName: string
  phone: string
  logoUrl: string | null
}

// RGB triples pulled from the current warm storefront design system.
const BRAND: [number, number, number] = [233, 120, 28]
const BRAND_SOFT: [number, number, number] = [255, 232, 194]
const INK: [number, number, number] = [23, 33, 29]
const MUTED: [number, number, number] = [110, 122, 117]
const HAIRLINE: [number, number, number] = [220, 224, 216]

// A4 geometry in millimetres.
const MARGIN = 15
const FULL_BAND_H = 36
const COMPACT_BAND_H = 18
const FOOTER_Y_OFFSET = 8
const FOOTER_RULE_OFFSET = 12
const CARD_GAP = 4
const CARD_HEIGHT = 37
const CARD_COLUMNS = 3

const priceFormatter = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  maximumFractionDigits: 0,
  style: 'currency',
})

type ImageAsset = { dataUrl: string; format: 'PNG' | 'JPEG' }

/**
 * Fetch a (possibly remote) image and turn it into a data URL jsPDF can embed.
 * Returns null on any failure — a cross-origin-tainted or missing logo must
 * never break the whole export.
 */
async function loadImageAsset(url: string): Promise<ImageAsset | null> {
  try {
    const res = await fetch(url)
    if (!res.ok) {
      return null
    }
    const blob = await res.blob()
    // jsPDF only reliably rasterises PNG/JPEG; anything else (webp, svg) is skipped.
    const format: ImageAsset['format'] | null = blob.type.includes('png')
      ? 'PNG'
      : blob.type.includes('jpeg') || blob.type.includes('jpg')
        ? 'JPEG'
        : null
    if (!format) {
      return null
    }
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = () => reject(new Error('Could not read image.'))
      reader.readAsDataURL(blob)
    })
    return { dataUrl, format }
  } catch {
    return null
  }
}

const slugifyFileName = (store: CatalogStore) => {
  const base = store.slug ?? store.name
  const cleaned = base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return `${cleaned || 'store'}-catalog.pdf`
}

export async function downloadCatalogPdf(
  store: CatalogStore,
  products: CatalogProduct[],
  publicUrl: string
): Promise<void> {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const contentW = pageW - MARGIN * 2

  const logo = store.logoUrl ? await loadImageAsset(store.logoUrl) : null

  // Draws the coloured header band; `compact` is the slimmer variant reprinted
  // at the top of every continuation page. Returns the band height.
  const drawHeaderBand = (compact: boolean): number => {
    const bandH = compact ? COMPACT_BAND_H : FULL_BAND_H
    doc.setFillColor(BRAND[0], BRAND[1], BRAND[2])
    doc.rect(0, 0, pageW, bandH, 'F')

    let textX = MARGIN
    if (logo) {
      const size = compact ? 10 : 20
      const logoY = (bandH - size) / 2
      doc.setFillColor(255, 255, 255)
      doc.roundedRect(MARGIN, logoY, size, size, 2, 2, 'F')
      try {
        doc.addImage(
          logo.dataUrl,
          logo.format,
          MARGIN + 1,
          logoY + 1,
          size - 2,
          size - 2
        )
      } catch {
        // Tainted / undecodable image: leave the white chip, carry on.
      }
      textX = MARGIN + size + 5
    }

    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(compact ? 12 : 20)
    doc.text(store.name, textX, compact ? bandH / 2 + 1.5 : 16)

    if (!compact) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(BRAND_SOFT[0], BRAND_SOFT[1], BRAND_SOFT[2])
      doc.text('Service Catalog', textX, 24)
    }
    return bandH
  }

  let y = drawHeaderBand(false) + 10

  // Store contact block under the full header.
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(MUTED[0], MUTED[1], MUTED[2])
  doc.text(`${store.address}, ${store.cityName}`, MARGIN, y)
  y += 5
  if (store.phone) {
    doc.text(store.phone, MARGIN, y)
    y += 5
  }
  y += 5

  // Reserve room for the footer so content never collides with it.
  const contentBottom = pageH - FOOTER_RULE_OFFSET - 4

  const ensureSpace = (needed: number) => {
    if (y + needed > contentBottom) {
      doc.addPage()
      y = drawHeaderBand(true) + 10
    }
  }

  const cardWidth = (contentW - CARD_GAP * (CARD_COLUMNS - 1)) / CARD_COLUMNS
  let column = 0

  const categoryColor = (category: CatalogCategory): [number, number, number] => {
    if (category === 'Plans') return [212, 108, 23]
    if (category === 'AddOns') return [106, 86, 141]
    return [49, 91, 73]
  }

  const drawCatalogCard = (item: CatalogProduct) => {
    if (column === 0) {
      ensureSpace(CARD_HEIGHT)
    }

    const x = MARGIN + column * (cardWidth + CARD_GAP)
    const accent = categoryColor(item.category)

    doc.setFillColor(250, 251, 247)
    doc.setDrawColor(HAIRLINE[0], HAIRLINE[1], HAIRLINE[2])
    doc.setLineWidth(0.25)
    doc.roundedRect(x, y, cardWidth, CARD_HEIGHT, 2.2, 2.2, 'FD')
    doc.setFillColor(accent[0], accent[1], accent[2])
    doc.roundedRect(x, y, cardWidth, 3, 2.2, 2.2, 'F')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(6.5)
    doc.setTextColor(accent[0], accent[1], accent[2])
    doc.text(CATEGORY_LABELS[item.category].toUpperCase(), x + 4, y + 8)

    doc.setFontSize(10)
    doc.setTextColor(INK[0], INK[1], INK[2])
    const nameLines = (doc.splitTextToSize(item.name, cardWidth - 8) as string[]).slice(0, 2)
    doc.text(nameLines, x + 4, y + 13)

    const nameBottom = y + 13 + nameLines.length * 4
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.2)
    doc.setTextColor(MUTED[0], MUTED[1], MUTED[2])
    const description = item.description || 'Ask our team for service details.'
    const descLines = (doc.splitTextToSize(description, cardWidth - 8) as string[]).slice(0, 2)
    doc.text(descLines, x + 4, nameBottom + 1)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(BRAND[0], BRAND[1], BRAND[2])
    doc.text(priceFormatter.format(item.price), x + 4, y + CARD_HEIGHT - 4)

    column += 1
    if (column === CARD_COLUMNS) {
      column = 0
      y += CARD_HEIGHT + CARD_GAP
    }
  }

  if (products.length === 0) {
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(11)
    doc.setTextColor(MUTED[0], MUTED[1], MUTED[2])
    doc.text('No services are listed yet.', MARGIN, y + 4)
  } else {
    for (const item of products) {
      drawCatalogCard(item)
    }
  }

  // Footers: added last so the page total is known.
  const totalPages = doc.getNumberOfPages()
  for (let page = 1; page <= totalPages; page += 1) {
    doc.setPage(page)
    doc.setDrawColor(HAIRLINE[0], HAIRLINE[1], HAIRLINE[2])
    doc.setLineWidth(0.2)
    doc.line(MARGIN, pageH - FOOTER_RULE_OFFSET, pageW - MARGIN, pageH - FOOTER_RULE_OFFSET)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(MUTED[0], MUTED[1], MUTED[2])
    doc.text(`Powered by ServiceDock · ${publicUrl}`, MARGIN, pageH - FOOTER_Y_OFFSET)
    doc.text(
      `Page ${page} of ${totalPages}`,
      pageW - MARGIN,
      pageH - FOOTER_Y_OFFSET,
      { align: 'right' }
    )
  }

  doc.save(slugifyFileName(store))
}
