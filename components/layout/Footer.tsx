import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { Dictionary } from '@/app/[lang]/dictionaries'

interface Props {
  lang: string
  dict?: Dictionary
}

export function Footer({ lang, dict }: Props) {
  const isBn = lang === 'bn'

  const links = dict
    ? [
        { href: `/${lang}/faq/`, label: dict.nav.faq },
        { href: `/${lang}/about/`, label: dict.nav.about },
        { href: `/${lang}/contact/`, label: dict.nav.contact },
      ]
    : []

  return (
    <footer className="mt-auto border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <span className="text-lg">🇧🇩</span>
            <span className={cn('text-sm font-semibold text-brand-green', isBn && 'font-bangla')}>
              {isBn ? 'পাসপোর্ট ছবি' : 'BD Passport Photo'}
            </span>
          </div>

          {/* Nav links */}
          {links.length > 0 && (
            <nav className="flex items-center gap-4">
              {links.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'text-xs text-gray-400 transition-colors duration-200 hover:text-brand-green',
                    isBn && 'font-bangla',
                  )}
                >
                  {label}
                </Link>
              ))}
            </nav>
          )}
        </div>

        <div className="mt-5 border-t border-gray-100 pt-5 text-center">
          <p className={cn('text-xs text-gray-400', isBn && 'font-bangla')}>
            {isBn
              ? 'ছবি কখনো সার্ভারে যায় না — সবকিছু আপনার ব্রাউজারে চলে'
              : 'Your photo never leaves your device — all processing runs in your browser'}
          </p>
          <p className="mt-1 text-xs text-gray-300">
            {isBn ? '© ২০২৫ পাসপোর্ট ছবি' : '© 2025 BD Passport Photo'}
          </p>
        </div>
      </div>
    </footer>
  )
}
