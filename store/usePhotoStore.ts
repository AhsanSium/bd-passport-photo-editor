import { create } from 'zustand'
import type { PercentCrop, PixelCrop } from 'react-image-crop'
import type { PhotoPreset } from '@/lib/presets'
import { DEFAULT_PRESET } from '@/lib/presets'

export type { PercentCrop, PixelCrop }

export type OutputFormat = 'jpeg' | 'png' | 'webp'

interface PhotoState {
  originalFile: File | null
  originalDataUrl: string | null
  crop: PercentCrop | null
  completedCrop: PixelCrop | null
  preset: PhotoPreset
  outputFormat: OutputFormat
  quality: number
  bgColor: string
  processedDataUrl: string | null
  estimatedFileSize: number | null

  setFile: (file: File) => void
  setCrop: (crop: PercentCrop) => void
  setCompletedCrop: (crop: PixelCrop) => void
  setPreset: (preset: PhotoPreset) => void
  setFormat: (format: OutputFormat) => void
  setQuality: (q: number) => void
  setBgColor: (color: string) => void
  processImage: () => Promise<void>
  reset: () => void
}

const initialState: Pick<
  PhotoState,
  | 'originalFile'
  | 'originalDataUrl'
  | 'crop'
  | 'completedCrop'
  | 'preset'
  | 'outputFormat'
  | 'quality'
  | 'bgColor'
  | 'processedDataUrl'
  | 'estimatedFileSize'
> = {
  originalFile: null,
  originalDataUrl: null,
  crop: null,
  completedCrop: null,
  preset: DEFAULT_PRESET,
  outputFormat: 'jpeg',
  quality: 0.9,
  bgColor: '#FFFFFF',
  processedDataUrl: null,
  estimatedFileSize: null,
}

export const usePhotoStore = create<PhotoState>((set, get) => ({
  ...initialState,

  setFile: (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      set({
        originalFile: file,
        originalDataUrl: (e.target?.result as string) ?? null,
        processedDataUrl: null,
        estimatedFileSize: null,
        crop: null,
        completedCrop: null,
      })
    }
    reader.readAsDataURL(file)
  },

  setCrop: (crop) => set({ crop }),
  setCompletedCrop: (completedCrop) => set({ completedCrop }),
  setPreset: (preset) => set({ preset, processedDataUrl: null, estimatedFileSize: null }),
  setFormat: (outputFormat) => set({ outputFormat }),
  setQuality: (quality) => set({ quality }),
  setBgColor: (bgColor) => set({ bgColor }),

  processImage: async () => {
    const { originalDataUrl, completedCrop, preset, quality, bgColor, outputFormat } = get()
    if (!originalDataUrl) return
    const { processPassportPhoto } = await import('@/lib/imageProcessor')
    const result = await processPassportPhoto(
      originalDataUrl,
      completedCrop,
      preset,
      quality,
      bgColor,
      outputFormat,
    )
    set({ processedDataUrl: result.dataUrl, estimatedFileSize: result.sizeBytes })
  },

  reset: () => set(initialState),
}))
