import Link from 'next/link'
import { LanguageSwitcher } from './LanguageSwitcher'
import type { Dictionary } from '@/app/[lang]/dictionaries'
import { cn } from '@/lib/utils'

interface Props {
  lang: string
  dict: Dictionary
}

export function Header({ lang, dict }: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link
          href={`/${lang}/`}
          className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2 rounded"
        >
          <span className="text-xl leading-none">🇧🇩</span>
          <span
            className={cn(
              'font-semibold text-brand-green text-sm sm:text-base',
              lang === 'bn' && 'font-bangla',
            )}
          >
            {lang === 'bn' ? 'পাসপোর্ট ছবি' : 'BD Passport Photo'}
          </span>
        </Link>

        <nav className="hidden items-center gap-5 sm:flex">
          {[
            { href: `/${lang}/faq/`, label: dict.nav.faq },
            { href: `/${lang}/about/`, label: dict.nav.about },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'text-sm text-gray-500 hover:text-brand-green transition-colors duration-200',
                lang === 'bn' && 'font-bangla',
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        <LanguageSwitcher currentLang={lang} label={dict.a11y.langSwitch} />
      </div>
    </header>
  )
}
