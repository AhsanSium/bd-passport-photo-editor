'use client'

import { useRef, useState, useCallback } from 'react'
import { Upload, ImageIcon } from 'lucide-react'
import { usePhotoStore } from '@/store/usePhotoStore'
import { cn } from '@/lib/utils'
import type { Dictionary } from '@/app/[lang]/dictionaries'

interface Props {
  dict: Dictionary
  lang: string
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp']

export function UploadZone({ dict, lang }: Props) {
  const setFile = usePhotoStore((s) => s.setFile)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const isBn = lang === 'bn'

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
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false)
    }
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
    <div className="flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-lg">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          aria-label={dict.a11y.uploadZone}
          className={cn(
            'w-full rounded-2xl border-2 border-dashed p-12 text-center',
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
                'flex h-16 w-16 items-center justify-center rounded-full transition-all duration-200',
                isDragging ? 'bg-brand-green/20' : 'bg-gray-100',
              )}
            >
              {isDragging ? (
                <ImageIcon className="h-8 w-8 text-brand-green" />
              ) : (
                <Upload className="h-8 w-8 text-gray-400" />
              )}
            </div>

            <div>
              <p className={cn('text-base font-medium text-gray-700', isBn && 'font-bangla')}>
                {dict.upload.drag}
              </p>
              <p className="mt-1 text-sm text-gray-400">{dict.upload.formats}</p>
            </div>
          </div>
        </button>

        {error && (
          <p className={cn('mt-3 text-center text-sm text-red-600', isBn && 'font-bangla')}>
            {error}
          </p>
        )}
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
