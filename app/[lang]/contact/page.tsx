import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from '../dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Mail, GitFork, MessageSquare, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dict = await getDictionary(lang)
  return { title: dict.nav.contact }
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const dict = await getDictionary(lang)
  const isBn = lang === 'bn'
  const c = dict.contactPage

  const channels = [
    {
      icon: Mail,
      title: c.emailTitle,
      value: c.emailAddress,
      href: `mailto:${c.emailAddress}`,
      cta: isBn ? 'ইমেইল পাঠান' : 'Send an email',
    },
    {
      icon: GitFork,
      title: c.githubTitle,
      value: c.githubText,
      href: 'https://github.com',
      cta: isBn ? 'গিটহাবে যান' : 'Go to GitHub',
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header lang={lang} dict={dict} />

      <main className="mx-auto w-full max-w-xl flex-1 px-4 py-12">
        {/* Heading */}
        <div className="mb-10 animate-fade-up">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-brand-green-light px-3 py-1 text-xs font-medium text-brand-green">
            <MessageSquare className="h-3.5 w-3.5" />
            {isBn ? 'যোগাযোগ' : 'Get in touch'}
          </div>
          <h1 className={cn('text-3xl font-bold text-gray-900', isBn && 'font-bangla')}>
            {c.title}
          </h1>
          <p className={cn('mt-2 text-gray-500', isBn && 'font-bangla')}>
            {c.subtitle}
          </p>
        </div>

        {/* Contact channels */}
        <div className="flex flex-col gap-4 animate-fade-up delay-150">
          {channels.map(({ icon: Icon, title, value, href, cta }) => (
            <a
              key={href}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-brand-green hover:shadow-md"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-green-light text-brand-green transition-colors duration-200 group-hover:bg-brand-green group-hover:text-white">
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn('text-xs font-medium text-gray-400 uppercase tracking-wide', isBn && 'font-bangla')}>
                  {title}
                </p>
                <p className={cn('truncate text-sm font-semibold text-gray-800', isBn && 'font-bangla')}>
                  {value}
                </p>
              </div>
              <div className={cn('text-xs font-medium text-brand-green flex items-center gap-1 transition-all duration-200 group-hover:gap-2', isBn && 'font-bangla')}>
                {cta}
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </a>
          ))}
        </div>

        {/* Response time */}
        <p className={cn('mt-6 text-center text-sm text-gray-400 animate-fade-up delay-225', isBn && 'font-bangla')}>
          {c.responseNote}
        </p>

        {/* Feedback topics */}
        <div className="mt-10 animate-fade-up delay-300">
          <h2 className={cn('mb-4 text-sm font-semibold text-gray-700', isBn && 'font-bangla')}>
            {c.feedbackTitle}
          </h2>
          <ul className="flex flex-col gap-2">
            {c.feedbackItems.map((item) => (
              <li
                key={item}
                className={cn(
                  'flex items-center gap-2.5 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-600',
                  isBn && 'font-bangla',
                )}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-brand-green shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </main>

      <Footer lang={lang} dict={dict} />
    </div>
  )
}
