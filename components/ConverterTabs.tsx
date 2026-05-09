'use client'

import { useState } from 'react'
import { Camera, PenLine } from 'lucide-react'
import { PhotoConverter } from './PhotoConverter'
import { SignatureConverter } from './signature/SignatureConverter'
import type { Dictionary } from '@/app/[lang]/dictionaries'
import { cn } from '@/lib/utils'

type Tab = 'photo' | 'signature'

interface Props {
  dict: Dictionary
  lang: string
}

export function ConverterTabs({ dict, lang }: Props) {
  const [active, setActive] = useState<Tab>('photo')
  const isBn = lang === 'bn'

  const tabs: { id: Tab; label: string; Icon: typeof Camera }[] = [
    { id: 'photo', label: dict.signature.tabPhoto, Icon: Camera },
    { id: 'signature', label: dict.signature.tabSignature, Icon: PenLine },
  ]

  return (
    <div className="flex flex-col flex-1">
      {/* Tab bar */}
      <div className="border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl gap-0 px-4">
          {tabs.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActive(id)}
              className={cn(
                'flex items-center gap-2 border-b-2 px-5 py-3.5 text-sm font-medium transition-all duration-200',
                isBn && 'font-bangla',
                active === id
                  ? 'border-brand-green text-brand-green'
                  : 'border-transparent text-gray-400 hover:text-brand-green',
              )}
              aria-selected={active === id}
              role="tab"
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Panels — both mounted, only active shown (preserves store state on switch) */}
      <div role="tabpanel" className={active === 'photo' ? 'flex flex-col flex-1' : 'hidden'}>
        <PhotoConverter dict={dict} lang={lang} />
      </div>
      <div role="tabpanel" className={active === 'signature' ? 'flex flex-col flex-1' : 'hidden'}>
        <SignatureConverter dict={dict} lang={lang} />
      </div>
    </div>
  )
}
