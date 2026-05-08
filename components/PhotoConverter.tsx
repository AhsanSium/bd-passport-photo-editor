'use client'

import { usePhotoStore } from '@/store/usePhotoStore'
import { UploadZone } from './upload/UploadZone'
import { ImageCropper } from './editor/ImageCropper'
import { SettingsPanel } from './editor/SettingsPanel'
import { PreviewCard } from './editor/PreviewCard'
import { DownloadSection } from './download/DownloadSection'
import { ErrorBoundary } from './ErrorBoundary'
import type { Dictionary } from '@/app/[lang]/dictionaries'

interface Props {
  dict: Dictionary
  lang: string
}

export function PhotoConverter({ dict, lang }: Props) {
  const originalFile = usePhotoStore((s) => s.originalFile)

  if (!originalFile) {
    return <UploadZone dict={dict} lang={lang} />
  }

  return (
    <ErrorBoundary lang={lang}>
      <div className="mx-auto w-full max-w-5xl px-4 py-6 flex flex-col gap-6">
        {/* Cropper — full width */}
        <ImageCropper />

        {/* Settings + Preview — two-column on md+ */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <SettingsPanel dict={dict} lang={lang} />
          <PreviewCard dict={dict} lang={lang} />
        </div>

        {/* Action bar */}
        <DownloadSection dict={dict} lang={lang} />
      </div>
    </ErrorBoundary>
  )
}
