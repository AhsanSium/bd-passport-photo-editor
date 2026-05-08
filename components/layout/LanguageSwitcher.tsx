'use client'

import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface Props {
  currentLang: string
  label: string
}

export function LanguageSwitcher({ currentLang, label }: Props) {
  const pathname = usePathname()
  const router = useRouter()

  const switchTo = (newLocale: string) => {
    const segments = pathname.split('/')
    segments[1] = newLocale
    router.push(segments.join('/') || '/')
  }

  return (
    <div
      className="flex items-center gap-0.5 rounded-full border border-gray-200 bg-gray-50 p-0.5"
      role="group"
      aria-label={label}
    >
      {(['bn', 'en'] as const).map((locale) => (
        <button
          key={locale}
          onClick={() => switchTo(locale)}
          aria-pressed={currentLang === locale}
          className={cn(
            'rounded-full px-3 py-1 text-sm font-medium transition-all duration-200',
            currentLang === locale
              ? 'bg-brand-green text-white shadow-sm'
              : 'text-gray-500 hover:text-brand-green',
          )}
        >
          {locale === 'bn' ? 'বাংলা' : 'EN'}
        </button>
      ))}
    </div>
  )
}
