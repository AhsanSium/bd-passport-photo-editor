import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from '../dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { FaqAccordion } from '@/components/faq/FaqAccordion'
import { cn } from '@/lib/utils'

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
  const isBn = lang === 'bn'

  return (
    <div className="flex min-h-screen flex-col">
      <Header lang={lang} dict={dict} />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-12">
        {/* Header */}
        <div className="mb-10 animate-fade-up">
          <div className="mb-3 inline-flex items-center rounded-full bg-brand-green-light px-3 py-1 text-xs font-medium text-brand-green">
            {isBn ? 'সাহায্য' : 'Help'}
          </div>
          <h1 className={cn('text-3xl font-bold text-gray-900', isBn && 'font-bangla')}>
            {dict.faqPage.title}
          </h1>
          <p className={cn('mt-2 text-gray-500', isBn && 'font-bangla')}>
            {dict.faqPage.subtitle}
          </p>
        </div>

        {/* Accordion */}
        <div className="animate-fade-up delay-150">
          <FaqAccordion items={dict.faqPage.items} isBn={isBn} />
        </div>

        {/* Still have questions */}
        <div className="mt-12 animate-fade-up delay-300 rounded-2xl bg-brand-green-light p-6 text-center">
          <p className={cn('font-medium text-brand-green-dark', isBn && 'font-bangla')}>
            {isBn ? 'আরো প্রশ্ন আছে?' : 'Still have questions?'}
          </p>
          <p className={cn('mt-1 text-sm text-brand-green', isBn && 'font-bangla')}>
            {isBn ? (
              <>
                আমাদের{' '}
                <a href={`/${lang}/contact/`} className="underline underline-offset-2 hover:no-underline">
                  যোগাযোগ পাতায়
                </a>{' '}
                যান।
              </>
            ) : (
              <>
                Head to our{' '}
                <a href={`/${lang}/contact/`} className="underline underline-offset-2 hover:no-underline">
                  contact page
                </a>
                .
              </>
            )}
          </p>
        </div>
      </main>

      <Footer lang={lang} dict={dict} />
    </div>
  )
}
