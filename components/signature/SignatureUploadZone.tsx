'use client'

import { useRef, useState, useCallback } from 'react'
import { Upload, PenLine, Lightbulb } from 'lucide-react'
import { useSignatureStore } from '@/store/useSignatureStore'
import { cn } from '@/lib/utils'
import type { Dictionary } from '@/app/[lang]/dictionaries'

interface Props {
  dict: Dictionary
  lang: string
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp']

export function SignatureUploadZone({ dict, lang }: Props) {
  const setFile = useSignatureStore((s) => s.setFile)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const isBn = lang === 'bn'
  const sig = dict.signature

  const handleFile = useCallback(
    (file: File) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError(dict.errors.invalidFile)
        return
      }
      setError(null)
      setFile(file)
    },
    [setFile, dict.errors.invalidFile],
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const onDragLeave = useCallback((e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragging(false)
  }, [])

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
      e.target.value = ''
    },
    [handleFile],
  )

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-start">
      {/* Drop zone */}
      <div className="flex-1">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          aria-label={sig.upload.drag}
          className={cn(
            'w-full rounded-2xl border-2 border-dashed p-10 text-center',
            'cursor-pointer transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2',
            isDragging
              ? 'border-brand-green bg-brand-green-light scale-[1.01]'
              : 'border-gray-200 bg-white hover:border-brand-green hover:bg-brand-green-light',
          )}
        >
          <div className="flex flex-col items-center gap-4">
            <div
              className={cn(
                'flex h-14 w-14 items-center justify-center rounded-full transition-all duration-200',
                isDragging ? 'bg-brand-green/20 scale-110' : 'bg-gray-100',
              )}
            >
              {isDragging
                ? <PenLine className="h-7 w-7 text-brand-green" />
                : <Upload className="h-7 w-7 text-gray-400" />
              }
            </div>
            <div>
              <p className={cn('text-base font-medium text-gray-700', isBn && 'font-bangla')}>
                {sig.upload.drag}
              </p>
              <p className="mt-1 text-sm text-gray-400">{dict.upload.formats}</p>
            </div>
          </div>
        </button>

        {error && (
          <p className={cn('mt-3 text-center text-sm text-red-600', isBn && 'font-bangla')}>{error}</p>
        )}
      </div>

      {/* Tips card */}
      <div className="sm:w-64 rounded-2xl border border-amber-100 bg-amber-50 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="h-4 w-4 text-amber-500 shrink-0" />
          <h3 className={cn('text-sm font-semibold text-amber-800', isBn && 'font-bangla')}>
            {sig.tips.title}
          </h3>
        </div>
        <ul className="flex flex-col gap-2">
          {sig.tips.items.map((tip) => (
            <li key={tip} className={cn('flex items-start gap-2 text-xs text-amber-700', isBn && 'font-bangla')}>
              <span className="mt-1 h-1 w-1 rounded-full bg-amber-400 shrink-0" />
              {tip}
            </li>
          ))}
        </ul>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={onInputChange}
        aria-hidden="true"
      />
    </div>
  )
}
