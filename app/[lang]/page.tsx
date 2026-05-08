import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from './dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PhotoConverter } from '@/components/PhotoConverter'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dict = await getDictionary(lang)
  return { title: dict.hero.title }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const dict = await getDictionary(lang)

  return (
    <div className="flex min-h-screen flex-col">
      <Header lang={lang} dict={dict} />

      <main className="flex flex-1 flex-col">
        <PhotoConverter dict={dict} lang={lang} />
      </main>

      <Footer lang={lang} />
    </div>
  )
}
