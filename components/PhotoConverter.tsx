'use client'

import { usePhotoStore } from '@/store/usePhotoStore'
import { UploadZone } from './upload/UploadZone'
import { ImageCropper } from './editor/ImageCropper'
import { SettingsPanel } from './editor/SettingsPanel'
import { PreviewCard } from './editor/PreviewCard'
import { DownloadSection } from './download/DownloadSection'
import { RotateBar } from './RotateBar'
import { ErrorBoundary } from './ErrorBoundary'
import type { Dictionary } from '@/app/[lang]/dictionaries'

interface Props {
  dict: Dictionary
  lang: string
}

export function PhotoConverter({ dict, lang }: Props) {
  const originalFile = usePhotoStore((s) => s.originalFile)
  const rotate = usePhotoStore((s) => s.rotate)

  if (!originalFile) {
    return <UploadZone dict={dict} lang={lang} />
  }

  return (
    <ErrorBoundary lang={lang}>
      <div className="mx-auto w-full max-w-5xl animate-scale-in px-4 py-6 flex flex-col gap-4">
        {/* Rotation toolbar */}
        <div className="animate-fade-up flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-2">
          <span className={`text-xs text-gray-400 ${lang === 'bn' ? 'font-bangla' : ''}`}>
            {lang === 'bn' ? 'ছবি ঘোরান' : 'Rotate image'}
          </span>
          <RotateBar onRotate={rotate} lang={lang} />
        </div>

        {/* Cropper */}
        <div className="animate-fade-up delay-75">
          <ImageCropper />
        </div>

        {/* Settings + Preview */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 animate-fade-up delay-150">
          <SettingsPanel dict={dict} lang={lang} />
          <PreviewCard dict={dict} lang={lang} />
        </div>

        {/* Action bar */}
        <div className="animate-fade-up delay-225">
          <DownloadSection dict={dict} lang={lang} />
        </div>
      </div>
    </ErrorBoundary>
  )
}
