'use client'

import { useState, useCallback } from 'react'
import { Download, RotateCcw, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { useSignatureStore } from '@/store/useSignatureStore'
import { formatBytes } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { Dictionary } from '@/app/[lang]/dictionaries'

interface Props {
  dict: Dictionary
  lang: string
}

export function SignaturePreview({ dict, lang }: Props) {
  const processedDataUrl = useSignatureStore((s) => s.processedDataUrl)
  const estimatedFileSize = useSignatureStore((s) => s.estimatedFileSize)
  const originalDataUrl = useSignatureStore((s) => s.originalDataUrl)
  const originalFile = useSignatureStore((s) => s.originalFile)
  const preset = useSignatureStore((s) => s.preset)
  const outputFormat = useSignatureStore((s) => s.outputFormat)
  const processSignature = useSignatureStore((s) => s.processSignature)
  const reset = useSignatureStore((s) => s.reset)
  const [isProcessing, setIsProcessing] = useState(false)
  const isBn = lang === 'bn'
  const sig = dict.signature

  const isWithinLimit =
    estimatedFileSize !== null && estimatedFileSize <= preset.maxFileSizeKb * 1024

  const handleProcess = useCallback(async () => {
    setIsProcessing(true)
    try {
      await processSignature()
    } finally {
      setIsProcessing(false)
    }
  }, [processSignature])

  const handleDownload = useCallback(() => {
    if (!processedDataUrl || !originalFile) return
    const ext = outputFormat === 'jpeg' ? 'jpg' : 'png'
    const base = originalFile.name.replace(/\.[^.]+$/, '')
    const a = document.createElement('a')
    a.href = processedDataUrl
    a.download = `${base}-signature.${ext}`
    a.click()
  }, [processedDataUrl, originalFile, outputFormat])

  return (
    <div className="flex flex-col gap-4">
      {/* Original thumbnail */}
      {originalDataUrl && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
          <p className={cn('mb-2 text-xs font-medium text-gray-400 uppercase tracking-wide', isBn && 'font-bangla')}>
            {isBn ? 'মূল ছবি' : 'Original'}
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={originalDataUrl}
            alt="Original signature"
            className="h-16 w-full rounded-lg object-contain bg-white"
          />
        </div>
      )}

      {/* Processed result */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <p className={cn('mb-3 text-xs font-medium text-gray-400 uppercase tracking-wide', isBn && 'font-bangla')}>
          {isBn ? 'পরিষ্কার ফলাফল' : 'Cleaned result'}
        </p>

        {processedDataUrl ? (
          <>
            {/* Checkerboard = transparent areas */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={processedDataUrl}
              alt={isBn ? 'পরিষ্কার স্বাক্ষর' : 'Cleaned signature'}
              className="h-16 w-full rounded-lg object-contain border border-gray-100"
              style={{ background: '#fff' }}
            />
            <div className={cn('mt-3 flex items-center gap-2 text-sm', isBn && 'font-bangla')}>
              {isWithinLimit
                ? <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                : <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
              }
              <span className="text-gray-600">
                {sig.size}: {estimatedFileSize !== null ? formatBytes(estimatedFileSize) : '—'}
              </span>
              <span className="text-gray-400">·</span>
              <span className="text-gray-500">
                {preset.widthPx}×{preset.heightPx}px
              </span>
            </div>
          </>
        ) : (
          <div className="flex h-16 items-center justify-center rounded-lg border-2 border-dashed border-gray-100 bg-gray-50">
            <span className={cn('text-xs text-gray-400', isBn && 'font-bangla')}>
              {isBn ? 'প্রিভিউ এখানে দেখাবে' : 'Preview will appear here'}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleProcess}
          disabled={isProcessing}
          className={cn(
            'flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3',
            'text-sm font-semibold transition-all duration-200',
            'bg-brand-green text-white hover:bg-brand-green-mid active:bg-brand-green-dark',
            'disabled:opacity-60 disabled:cursor-not-allowed',
            'focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2',
            isBn && 'font-bangla',
          )}
        >
          {isProcessing ? (
            <><Loader2 className="h-4 w-4 animate-spin" />{sig.processing}</>
          ) : sig.process}
        </button>

        {processedDataUrl && (
          <button
            type="button"
            onClick={handleDownload}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-brand-green px-5 py-3',
              'text-sm font-semibold text-brand-green transition-all duration-200 hover:bg-brand-green-light',
              'focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2',
              isBn && 'font-bangla',
            )}
          >
            <Download className="h-4 w-4" />{sig.download}
          </button>
        )}

        <button
          type="button"
          onClick={reset}
          className={cn(
            'flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 px-4 py-3',
            'text-sm text-gray-500 transition-colors duration-200 hover:border-gray-300 hover:text-gray-700',
            isBn && 'font-bangla',
          )}
        >
          <RotateCcw className="h-4 w-4" />
          {sig.startOver}
        </button>
      </div>
    </div>
  )
}
