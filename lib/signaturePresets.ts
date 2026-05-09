export interface SignaturePreset {
  id: string
  labelKey: string
  widthPx: number
  heightPx: number
  maxFileSizeKb: number
}

export const SIGNATURE_PRESETS: SignaturePreset[] = [
  {
    id: 'bd_passport',
    labelKey: 'signature.presets.bd_passport',
    widthPx: 300,
    heightPx: 80,
    maxFileSizeKb: 50,
  },
  {
    id: 'bd_nid',
    labelKey: 'signature.presets.bd_nid',
    widthPx: 300,
    heightPx: 80,
    maxFileSizeKb: 50,
  },
  {
    id: 'bd_university',
    labelKey: 'signature.presets.bd_university',
    widthPx: 300,
    heightPx: 80,
    maxFileSizeKb: 50,
  },
  {
    id: 'bd_bank',
    labelKey: 'signature.presets.bd_bank',
    widthPx: 400,
    heightPx: 100,
    maxFileSizeKb: 100,
  },
  {
    id: 'general',
    labelKey: 'signature.presets.general',
    widthPx: 300,
    heightPx: 80,
    maxFileSizeKb: 100,
  },
]

export const DEFAULT_SIGNATURE_PRESET = SIGNATURE_PRESETS[0]
