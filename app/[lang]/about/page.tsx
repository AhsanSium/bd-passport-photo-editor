import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from '../dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Shield, Zap, Globe, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dict = await getDictionary(lang)
  return { title: dict.nav.about }
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const dict = await getDictionary(lang)
  const isBn = lang === 'bn'
  const a = dict.aboutPage

  const values = [
    {
      icon: Zap,
      title: isBn ? 'দ্রুত' : 'Fast',
      desc: isBn ? 'সেকেন্ডে ছবি তৈরি হয়' : 'Photo generated in seconds',
    },
    {
      icon: Shield,
      title: isBn ? 'নিরাপদ' : 'Private',
      desc: isBn ? 'কোনো সার্ভার আপলোড নেই' : 'Zero server uploads',
    },
    {
      icon: Globe,
      title: isBn ? 'বিনামূল্যে' : 'Free',
      desc: isBn ? 'সবার জন্য, সবসময়' : 'For everyone, forever',
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header lang={lang} dict={dict} />

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-gray-100 bg-linear-to-b from-brand-green-light to-white px-4 py-14">
          <div className="mx-auto max-w-2xl text-center animate-fade-up">
            <div className="mb-4 text-5xl">🇧🇩</div>
            <h1 className={cn('text-3xl font-bold text-gray-900 sm:text-4xl', isBn && 'font-bangla')}>
              {a.title}
            </h1>
            <p className={cn('mt-4 text-lg text-gray-600', isBn && 'font-bangla')}>
              {a.closingText}
            </p>
          </div>

          {/* Value cards */}
          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-4 animate-fade-up delay-150">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-xl bg-white p-4 text-center shadow-sm border border-gray-100">
                <Icon className="mx-auto mb-2 h-6 w-6 text-brand-green" />
                <p className={cn('text-sm font-semibold text-gray-800', isBn && 'font-bangla')}>{title}</p>
                <p className={cn('mt-0.5 text-xs text-gray-500', isBn && 'font-bangla')}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mx-auto max-w-2xl space-y-10 px-4 py-12">
          {/* Mission */}
          <section className="animate-fade-up">
            <h2 className={cn('mb-3 text-xl font-bold text-brand-green', isBn && 'font-bangla')}>
              {a.missionTitle}
            </h2>
            <p className={cn('leading-relaxed text-gray-600', isBn && 'font-bangla')}>
              {a.missionText}
            </p>
          </section>

          {/* Privacy */}
          <section className="animate-fade-up delay-75 rounded-2xl border border-brand-green/20 bg-brand-green-light p-6">
            <h2 className={cn('mb-3 text-xl font-bold text-brand-green-dark', isBn && 'font-bangla')}>
              {a.privacyTitle}
            </h2>
            <p className={cn('leading-relaxed text-brand-green-dark/80', isBn && 'font-bangla')}>
              {a.privacyText}
            </p>
          </section>

          {/* How it works */}
          <section className="animate-fade-up delay-150">
            <h2 className={cn('mb-4 text-xl font-bold text-gray-900', isBn && 'font-bangla')}>
              {a.howTitle}
            </h2>
            <ol className="flex flex-col gap-3">
              {a.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-green text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <span className={cn('pt-0.5 text-sm text-gray-600', isBn && 'font-bangla')}>{step}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* Stack */}
          <section className="animate-fade-up delay-225 rounded-xl border border-gray-200 bg-gray-50 p-5">
            <h2 className={cn('mb-2 text-sm font-semibold text-gray-700', isBn && 'font-bangla')}>
              {a.stackTitle}
            </h2>
            <p className="text-xs text-gray-500">{a.stackText}</p>
          </section>
        </div>
      </main>

      <Footer lang={lang} dict={dict} />
    </div>
  )
}
