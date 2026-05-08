'use client'

import { usePhotoStore, type OutputFormat } from '@/store/usePhotoStore'
import { PRESETS } from '@/lib/presets'
import { cn } from '@/lib/utils'
import type { Dictionary } from '@/app/[lang]/dictionaries'

const BG_SWATCHES = [
  { color: '#FFFFFF', label: 'White' },
  { color: '#F0F0F0', label: 'Light Gray' },
  { color: '#D6E4F0', label: 'Light Blue' },
]

const FORMATS: { value: OutputFormat; label: string }[] = [
  { value: 'jpeg', label: 'JPEG' },
  { value: 'png', label: 'PNG' },
  { value: 'webp', label: 'WEBP' },
]

interface Props {
  dict: Dictionary
  lang: string
}

export function SettingsPanel({ dict, lang }: Props) {
  const preset = usePhotoStore((s) => s.preset)
  const quality = usePhotoStore((s) => s.quality)
  const outputFormat = usePhotoStore((s) => s.outputFormat)
  const bgColor = usePhotoStore((s) => s.bgColor)
  const setPreset = usePhotoStore((s) => s.setPreset)
  const setQuality = usePhotoStore((s) => s.setQuality)
  const setFormat = usePhotoStore((s) => s.setFormat)
  const setBgColor = usePhotoStore((s) => s.setBgColor)
  const isBn = lang === 'bn'

  return (
    <div className="flex flex-col gap-5 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      {/* Preset */}
      <div>
        <label className={cn('mb-2 block text-sm font-medium text-gray-700', isBn && 'font-bangla')}>
          {dict.settings.preset}
        </label>
        <select
          value={preset.id}
          onChange={(e) => {
            const p = PRESETS.find((x) => x.id === e.target.value)
            if (p) setPreset(p)
          }}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
        >
          {PRESETS.map((p) => (
            <option key={p.id} value={p.id}>
              {dict.presets[p.id as keyof typeof dict.presets] ?? p.id} — {p.widthPx}×{p.heightPx}px
            </option>
          ))}
        </select>
      </div>

      {/* Format */}
      <div>
        <label className={cn('mb-2 block text-sm font-medium text-gray-700', isBn && 'font-bangla')}>
          {dict.settings.format}
        </label>
        <div className="flex gap-2">
          {FORMATS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFormat(value)}
              className={cn(
                'flex-1 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all duration-200',
                outputFormat === value
                  ? 'border-brand-green bg-brand-green text-white'
                  : 'border-gray-200 text-gray-600 hover:border-brand-green hover:text-brand-green',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Quality */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className={cn('text-sm font-medium text-gray-700', isBn && 'font-bangla')}>
            {dict.settings.quality}
          </label>
          <span className="text-sm font-semibold text-brand-green">
            {Math.round(quality * 100)}%
          </span>
        </div>
        <input
          type="range"
          min={40}
          max={100}
          step={5}
          value={Math.round(quality * 100)}
          onChange={(e) => setQuality(Number(e.target.value) / 100)}
          className="w-full accent-brand-green"
          aria-label={dict.settings.quality}
        />
        <div className="mt-1 flex justify-between text-xs text-gray-400">
          <span>40%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Background color */}
      <div>
        <label className={cn('mb-2 block text-sm font-medium text-gray-700', isBn && 'font-bangla')}>
          {dict.settings.bgColor}
        </label>
        <div className="flex items-center gap-2">
          {BG_SWATCHES.map(({ color, label }) => (
            <button
              key={color}
              title={label}
              onClick={() => setBgColor(color)}
              aria-pressed={bgColor === color}
              className={cn(
                'h-8 w-8 rounded-full border-2 transition-all duration-200',
                bgColor === color
                  ? 'border-brand-green scale-110 shadow-md'
                  : 'border-gray-300 hover:border-brand-green',
              )}
              style={{ backgroundColor: color }}
            />
          ))}
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="h-8 w-8 cursor-pointer rounded-full border-2 border-gray-300 p-0.5"
            aria-label={dict.settings.bgColor}
          />
        </div>
      </div>
    </div>
  )
}
