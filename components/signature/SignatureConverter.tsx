'use client'

import { useSignatureStore } from '@/store/useSignatureStore'
import { SignatureUploadZone } from './SignatureUploadZone'
import { SignatureCropper } from './SignatureCropper'
import { SignatureSettings } from './SignatureSettings'
import { SignaturePreview } from './SignaturePreview'
import { RotateBar } from '@/components/RotateBar'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import type { Dictionary } from '@/app/[lang]/dictionaries'

interface Props {
  dict: Dictionary
  lang: string
}

export function SignatureConverter({ dict, lang }: Props) {
  const originalFile = useSignatureStore((s) => s.originalFile)
  const rotate       = useSignatureStore((s) => s.rotate)
  const isBn = lang === 'bn'

  if (!originalFile) {
    return <SignatureUploadZone dict={dict} lang={lang} />
  }

  return (
    <ErrorBoundary lang={lang}>
      <div className="mx-auto w-full max-w-5xl animate-scale-in px-4 py-6 flex flex-col gap-4">

        {/* Rotation toolbar */}
        <div className="animate-fade-up flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-2">
          <span className={`text-xs text-gray-400 ${isBn ? 'font-bangla' : ''}`}>
            {isBn ? 'ছবি ঘোরান' : 'Rotate image'}
          </span>
          <RotateBar onRotate={rotate} lang={lang} />
        </div>

        {/* Free-aspect crop */}
        <div className="animate-fade-up delay-75">
          <SignatureCropper lang={lang} />
        </div>

        {/* Settings + Preview/Download */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 animate-fade-up delay-150">
          <SignatureSettings dict={dict} lang={lang} />
          <SignaturePreview  dict={dict} lang={lang} />
        </div>

      </div>
    </ErrorBoundary>
  )
}
