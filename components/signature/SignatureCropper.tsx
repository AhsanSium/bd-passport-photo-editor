'use client'

import { useCallback } from 'react'
import ReactCrop, { type PercentCrop, type PixelCrop } from 'react-image-crop'
import { Crop } from 'lucide-react'
import 'react-image-crop/dist/ReactCrop.css'
import { useSignatureStore } from '@/store/useSignatureStore'

interface Props {
  lang: string
}

export function SignatureCropper({ lang }: Props) {
  const originalDataUrl = useSignatureStore((s) => s.originalDataUrl)
  const crop            = useSignatureStore((s) => s.crop)
  const setCrop         = useSignatureStore((s) => s.setCrop)
  const isBn = lang === 'bn'

  const onImageLoad = useCallback(
    () => {
      // Start with 10 % inset on every side — keeps the default selection away
      // from dark edges (table surface, notebook binding, photo borders).
      const initial: PercentCrop = { unit: '%', x: 10, y: 10, width: 80, height: 80 }
      setCrop(initial)
    },
    [setCrop],
  )

  if (!originalDataUrl) return null

  return (
    <div className="flex flex-col gap-2">
      {/* Instruction strip */}
      <div className="flex items-center gap-2 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2">
        <Crop className="h-4 w-4 shrink-0 text-amber-500" />
        <p className={`text-xs text-amber-700 ${isBn ? 'font-bangla' : ''}`}>
          {isBn
            ? 'ক্রপ হ্যান্ডেল টেনে শুধুমাত্র সাদা কাগজের স্বাক্ষর অংশটি নির্বাচন করুন — অন্ধকার প্রান্ত, টেবিল বা নোটবুকের বাইন্ডিং বাদ দিন।'
            : 'Drag the crop handles to select only the signature on white paper — exclude dark edges, tables, or notebook bindings.'}
        </p>
      </div>

      {/* Crop UI */}
      <div className="flex justify-center overflow-hidden rounded-xl bg-gray-50">
        <ReactCrop
          crop={crop as PercentCrop | undefined}
          onChange={(_px: PixelCrop, pct: PercentCrop) => setCrop(pct)}
          className="max-h-[52vh]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={originalDataUrl}
            alt="Signature source for cropping"
            onLoad={onImageLoad}
            className="max-h-[52vh] w-auto object-contain"
          />
        </ReactCrop>
      </div>
    </div>
  )
}
