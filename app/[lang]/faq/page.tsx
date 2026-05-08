import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from '../dictionaries'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dict = await getDictionary(lang)
  return { title: dict.nav.faq }
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const dict = await getDictionary(lang)

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className={`text-2xl font-bold text-brand-green ${lang === 'bn' ? 'font-bangla' : ''}`}>
        {dict.nav.faq}
      </h1>
    </main>
  )
}
