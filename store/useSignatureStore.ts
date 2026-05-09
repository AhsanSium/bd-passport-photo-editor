import { create } from 'zustand'
import type { PercentCrop } from 'react-image-crop'
import type { SignaturePreset } from '@/lib/signaturePresets'
import { DEFAULT_SIGNATURE_PRESET } from '@/lib/signaturePresets'
import type { SigFormat } from '@/lib/signatureProcessor'

export type { PercentCrop }

interface SignatureState {
  originalFile: File | null
  originalDataUrl: string | null
  crop: PercentCrop | null
  threshold: number       // 80–240, default 180
  preset: SignaturePreset
  outputFormat: SigFormat
  quality: number         // 0.7–1.0, default 0.92
  processedDataUrl: string | null
  estimatedFileSize: number | null

  setFile: (file: File) => void
  setCrop: (crop: PercentCrop) => void
  setThreshold: (t: number) => void
  setPreset: (p: SignaturePreset) => void
  setFormat: (f: SigFormat) => void
  setQuality: (q: number) => void
  rotate: (degrees: 90 | -90 | 180) => Promise<void>
  processSignature: () => Promise<void>
  reset: () => void
}

const initialState: Pick<
  SignatureState,
  | 'originalFile'
  | 'originalDataUrl'
  | 'crop'
  | 'threshold'
  | 'preset'
  | 'outputFormat'
  | 'quality'
  | 'processedDataUrl'
  | 'estimatedFileSize'
> = {
  originalFile: null,
  originalDataUrl: null,
  crop: null,
  threshold: 125,
  preset: DEFAULT_SIGNATURE_PRESET,
  outputFormat: 'jpeg',
  quality: 1.0,
  processedDataUrl: null,
  estimatedFileSize: null,
}

export const useSignatureStore = create<SignatureState>((set, get) => ({
  ...initialState,

  setFile: (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      set({
        originalFile: file,
        originalDataUrl: (e.target?.result as string) ?? null,
        crop: null,
        processedDataUrl: null,
        estimatedFileSize: null,
      })
    }
    reader.readAsDataURL(file)
  },

  setCrop: (crop) => set({ crop, processedDataUrl: null, estimatedFileSize: null }),
  setThreshold: (threshold) => set({ threshold, processedDataUrl: null, estimatedFileSize: null }),
  setPreset: (preset) => set({ preset, processedDataUrl: null, estimatedFileSize: null }),
  setFormat: (outputFormat) => set({ outputFormat }),
  setQuality: (quality) => set({ quality }),

  rotate: async (degrees) => {
    const { originalDataUrl } = get()
    if (!originalDataUrl) return
    const { rotateImage } = await import('@/lib/rotateImage')
    const rotated = await rotateImage(originalDataUrl, degrees)
    // Reset crop after rotation — dimensions change so old percentages are no longer valid
    set({ originalDataUrl: rotated, crop: null, processedDataUrl: null, estimatedFileSize: null })
  },

  processSignature: async () => {
    const { originalDataUrl, crop, preset, threshold, outputFormat, quality } = get()
    if (!originalDataUrl) return
    const { processSignaturePhoto } = await import('@/lib/signatureProcessor')
    const result = await processSignaturePhoto(
      originalDataUrl,
      crop,
      preset,
      threshold,
      outputFormat,
      quality,
    )
    set({ processedDataUrl: result.dataUrl, estimatedFileSize: result.sizeBytes })
  },

  reset: () => set(initialState),
}))
