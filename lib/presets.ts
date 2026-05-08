export interface PhotoPreset {
  id: string
  labelKey: string
  widthMm: number
  heightMm: number
  widthPx: number
  heightPx: number
  dpi: number
  maxFileSizeKb: number
}

export const PRESETS: PhotoPreset[] = [
  {
    id: 'bd_standard',
    labelKey: 'presets.bd_standard',
    widthMm: 35,
    heightMm: 45,
    widthPx: 413,
    heightPx: 531,
    dpi: 300,
    maxFileSizeKb: 100,
  },
  {
    id: 'us_passport',
    labelKey: 'presets.us_passport',
    widthMm: 51,
    heightMm: 51,
    widthPx: 600,
    heightPx: 600,
    dpi: 300,
    maxFileSizeKb: 240,
  },
  {
    id: 'eu_schengen',
    labelKey: 'presets.eu_schengen',
    widthMm: 35,
    heightMm: 45,
    widthPx: 413,
    heightPx: 531,
    dpi: 300,
    maxFileSizeKb: 200,
  },
  {
    id: 'india_visa',
    labelKey: 'presets.india_visa',
    widthMm: 51,
    heightMm: 51,
    widthPx: 600,
    heightPx: 600,
    dpi: 300,
    maxFileSizeKb: 300,
  },
  {
    id: 'uk_passport',
    labelKey: 'presets.uk_passport',
    widthMm: 35,
    heightMm: 45,
    widthPx: 413,
    heightPx: 531,
    dpi: 300,
    maxFileSizeKb: 200,
  },
]

export const DEFAULT_PRESET = PRESETS[0]
