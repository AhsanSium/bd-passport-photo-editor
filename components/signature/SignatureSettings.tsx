'use client'

import { useSignatureStore } from '@/store/useSignatureStore'
import { SIGNATURE_PRESETS } from '@/lib/signaturePresets'
import type { SigFormat } from '@/lib/signatureProcessor'
import { cn } from '@/lib/utils'
import type { Dictionary } from '@/app/[lang]/dictionaries'

interface Props {
  dict: Dictionary
  lang: string
}

const FORMATS: { value: SigFormat; label: string }[] = [
  { value: 'jpeg', label: 'JPEG' },
  { value: 'png', label: 'PNG' },
]

export function SignatureSettings({ dict, lang }: Props) {
  const preset = useSignatureStore((s) => s.preset)
  const threshold = useSignatureStore((s) => s.threshold)
  const outputFormat = useSignatureStore((s) => s.outputFormat)
  const setPreset = useSignatureStore((s) => s.setPreset)
  const setThreshold = useSignatureStore((s) => s.setThreshold)
  const setFormat = useSignatureStore((s) => s.setFormat)
  const isBn = lang === 'bn'
  const sig = dict.signature

  return (
    <div className="flex flex-col gap-5 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      {/* Preset */}
      <div>
        <label className={cn('mb-2 block text-sm font-medium text-gray-700', isBn && 'font-bangla')}>
          {sig.settings.preset}
        </label>
        <select
          value={preset.id}
          onChange={(e) => {
            const p = SIGNATURE_PRESETS.find((x) => x.id === e.target.value)
            if (p) setPreset(p)
          }}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
        >
          {SIGNATURE_PRESETS.map((p) => {
            const label =
              sig.presets[p.id as keyof typeof sig.presets] ?? p.id
            return (
              <option key={p.id} value={p.id}>
                {label} — {p.widthPx}×{p.heightPx}px
              </option>
            )
          })}
        </select>
      </div>

      {/* Ink threshold */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className={cn('text-sm font-medium text-gray-700', isBn && 'font-bangla')}>
            {sig.settings.threshold}
          </label>
          <span className="text-sm font-semibold text-brand-green">{threshold}</span>
        </div>
        <input
          type="range"
          min={80}
          max={240}
          step={5}
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
          className="w-full accent-brand-green"
          aria-label={sig.settings.threshold}
        />
        <p className={cn('mt-1 text-xs text-gray-400', isBn && 'font-bangla')}>
          {sig.settings.thresholdHint}
        </p>
      </div>

      {/* Format */}
      <div>
        <label className={cn('mb-2 block text-sm font-medium text-gray-700', isBn && 'font-bangla')}>
          {sig.settings.format}
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
    </div>
  )
}
