'use client'

import { usePhotoStore } from '@/store/usePhotoStore'
import { formatBytes } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { CheckCircle, AlertCircle } from 'lucide-react'
import type { Dictionary } from '@/app/[lang]/dictionaries'

interface Props {
  dict: Dictionary
  lang: string
}

export function PreviewCard({ dict, lang }: Props) {
  const processedDataUrl = usePhotoStore((s) => s.processedDataUrl)
  const estimatedFileSize = usePhotoStore((s) => s.estimatedFileSize)
  const preset = usePhotoStore((s) => s.preset)
  const isBn = lang === 'bn'

  const isWithinLimit = estimatedFileSize !== null && estimatedFileSize <= preset.maxFileSizeKb * 1024
  const specRules = Object.values(dict.spec.rules)

  return (
    <div className="flex flex-col gap-4">
      {/* Preview image */}
      <div className="flex flex-col items-center rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm">
        {processedDataUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={processedDataUrl}
              alt={dict.a11y.preview}
              className="max-h-48 w-auto rounded-lg shadow-sm object-contain"
              style={{ background: 'repeating-conic-gradient(#e5e5e5 0% 25%, transparent 0% 50%) 0 0 / 12px 12px' }}
            />
            {estimatedFileSize !== null && (
              <div className="mt-3 flex items-center gap-2">
                {isWithinLimit ? (
                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
                )}
                <span className={cn('text-sm text-gray-600', isBn && 'font-bangla')}>
                  {dict.download.size}: {formatBytes(estimatedFileSize)}
                  {!isWithinLimit && (
                    <span className="ml-1 text-amber-600">
                      {isBn ? '(সীমা অতিক্রম)' : '(over limit)'}
                    </span>
                  )}
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="flex h-40 w-32 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-white text-center text-xs text-gray-400">
            <span className={isBn ? 'font-bangla' : ''}>
              {isBn ? 'প্রিভিউ এখানে দেখাবে' : 'Preview will appear here'}
            </span>
          </div>
        )}
      </div>

      {/* Spec info */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className={cn('mb-3 text-sm font-semibold text-brand-green-dark', isBn && 'font-bangla')}>
          {dict.spec.title}
        </h3>
        <ul className="space-y-1.5 text-xs text-gray-600">
          {[dict.spec.dimensions, dict.spec.resolution, dict.spec.background, dict.spec.faceCoverage].map(
            (item) => (
              <li key={item} className={cn('flex items-center gap-2', isBn && 'font-bangla')}>
                <span className="h-1.5 w-1.5 rounded-full bg-brand-green shrink-0" />
                {item}
              </li>
            ),
          )}
        </ul>
        <div className="mt-3 border-t border-gray-100 pt-3">
          <ul className="space-y-1.5 text-xs text-gray-500">
            {specRules.map((rule) => (
              <li key={rule} className={cn('flex items-start gap-2', isBn && 'font-bangla')}>
                <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-gray-300 shrink-0" />
                {rule}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
