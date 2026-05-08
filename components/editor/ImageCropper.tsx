'use client'

import { useRef, useCallback } from 'react'
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type PercentCrop,
  type PixelCrop,
} from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { usePhotoStore } from '@/store/usePhotoStore'

export function ImageCropper() {
  const originalDataUrl = usePhotoStore((s) => s.originalDataUrl)
  const crop = usePhotoStore((s) => s.crop)
  const preset = usePhotoStore((s) => s.preset)
  const setCrop = usePhotoStore((s) => s.setCrop)
  const setCompletedCrop = usePhotoStore((s) => s.setCompletedCrop)
  const imgRef = useRef<HTMLImageElement>(null)
  const aspect = preset.widthPx / preset.heightPx

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { naturalWidth: width, naturalHeight: height } = e.currentTarget
      const initial = centerCrop(
        makeAspectCrop({ unit: '%', width: 90 }, aspect, width, height),
        width,
        height,
      )
      setCrop(initial)
    },
    [aspect, setCrop],
  )

  if (!originalDataUrl) return null

  return (
    <div className="flex justify-center rounded-xl overflow-hidden bg-gray-50">
      <ReactCrop
        crop={crop as PercentCrop | undefined}
        onChange={(_px: PixelCrop, pct: PercentCrop) => setCrop(pct)}
        onComplete={(px: PixelCrop) => setCompletedCrop(px)}
        aspect={aspect}
        className="max-h-[55vh]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={originalDataUrl}
          alt="Source photo for cropping"
          onLoad={onImageLoad}
          className="max-h-[55vh] w-auto object-contain"
        />
      </ReactCrop>
    </div>
  )
}
