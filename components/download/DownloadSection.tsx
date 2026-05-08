'use client'

import { useState, useCallback } from 'react'
import { Download, RotateCcw, Loader2 } from 'lucide-react'
import { usePhotoStore } from '@/store/usePhotoStore'
import { cn } from '@/lib/utils'
import type { Dictionary } from '@/app/[lang]/dictionaries'

interface Props {
  dict: Dictionary
  lang: string
}

export function DownloadSection({ dict, lang }: Props) {
  const processImage = usePhotoStore((s) => s.processImage)
  const processedDataUrl = usePhotoStore((s) => s.processedDataUrl)
  const outputFormat = usePhotoStore((s) => s.outputFormat)
  const reset = usePhotoStore((s) => s.reset)
  const originalFile = usePhotoStore((s) => s.originalFile)
  const [isProcessing, setIsProcessing] = useState(false)
  const isBn = lang === 'bn'

  const handleProcess = useCallback(async () => {
    setIsProcessing(true)
    try {
      await processImage()
    } finally {
      setIsProcessing(false)
    }
  }, [processImage])

  const handleDownload = useCallback(() => {
    if (!processedDataUrl || !originalFile) return
    const ext = outputFormat === 'jpeg' ? 'jpg' : outputFormat
    const baseName = originalFile.name.replace(/\.[^.]+$/, '')
    const a = document.createElement('a')
    a.href = processedDataUrl
    a.download = `${baseName}-passport.${ext}`
    a.click()
  }, [processedDataUrl, originalFile, outputFormat])

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <button
        type="button"
        onClick={handleProcess}
        disabled={isProcessing}
        className={cn(
          'flex flex-1 items-center justify-center gap-2 rounded-xl px-6 py-3',
          'text-sm font-semibold transition-all duration-200',
          'bg-brand-green text-white hover:bg-brand-green-mid active:bg-brand-green-dark',
          'disabled:opacity-60 disabled:cursor-not-allowed',
          'focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2',
          isBn && 'font-bangla',
        )}
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {dict.download.processing}
          </>
        ) : (
          dict.download.process
        )}
      </button>

      {processedDataUrl && (
        <button
          type="button"
          onClick={handleDownload}
          className={cn(
            'flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-brand-green px-6 py-3',
            'text-sm font-semibold text-brand-green transition-all duration-200',
            'hover:bg-brand-green-light',
            'focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2',
            isBn && 'font-bangla',
          )}
        >
          <Download className="h-4 w-4" />
          {dict.download.button}
        </button>
      )}

      <button
        type="button"
        onClick={reset}
        title={isBn ? 'নতুন ছবি' : 'Start over'}
        className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-500 transition-colors duration-200 hover:border-gray-300 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
      >
        <RotateCcw className="h-4 w-4" />
        <span className={isBn ? 'font-bangla' : ''}>{dict.download.startOver}</span>
      </button>
    </div>
  )
}
