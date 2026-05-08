import 'server-only'

const dictionaries = {
  bn: () => import('../../messages/bn.json').then((m) => m.default),
  en: () => import('../../messages/en.json').then((m) => m.default),
} as const

export const LOCALES = ['bn', 'en'] as const
export type Locale = (typeof LOCALES)[number]

export const hasLocale = (locale: string): locale is Locale =>
  (LOCALES as readonly string[]).includes(locale)

export const getDictionary = (locale: Locale) => dictionaries[locale]()

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>
