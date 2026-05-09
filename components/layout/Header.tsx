'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { LanguageSwitcher } from './LanguageSwitcher'
import type { Dictionary } from '@/app/[lang]/dictionaries'
import { cn } from '@/lib/utils'

interface Props {
  lang: string
  dict: Dictionary
}

export function Header({ lang, dict }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const isBn = lang === 'bn'

  // Close menu when route changes
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // Prevent body scroll when menu is open on mobile
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const navLinks = [
    { href: `/${lang}/`, label: dict.nav.home },
    { href: `/${lang}/faq/`, label: dict.nav.faq },
    { href: `/${lang}/about/`, label: dict.nav.about },
    { href: `/${lang}/contact/`, label: dict.nav.contact },
  ]

  const isActive = (href: string) =>
    href === `/${lang}/` ? pathname === href : pathname.startsWith(href)

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link
          href={`/${lang}/`}
          className="flex items-center gap-2 rounded focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
        >
          <span className="text-xl leading-none">🇧🇩</span>
          <span className={cn('font-semibold text-brand-green text-sm sm:text-base', isBn && 'font-bangla')}>
            {isBn ? 'পাসপোর্ট ছবি' : 'BD Passport Photo'}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 sm:flex">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'rounded-lg px-3 py-1.5 text-sm transition-all duration-200',
                isBn && 'font-bangla',
                isActive(href)
                  ? 'bg-brand-green-light font-medium text-brand-green'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-brand-green',
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right: lang switcher + burger */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher currentLang={lang} label={dict.a11y.langSwitch} />

          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? dict.a11y.closeMenu : dict.a11y.openMenu}
            aria-expanded={menuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors duration-200 hover:border-brand-green hover:text-brand-green sm:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="border-t border-gray-100 bg-white px-4 pb-4 pt-2 animate-slide-down sm:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'rounded-xl px-4 py-3 text-sm transition-all duration-200',
                  isBn && 'font-bangla',
                  isActive(href)
                    ? 'bg-brand-green-light font-semibold text-brand-green'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-brand-green',
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
