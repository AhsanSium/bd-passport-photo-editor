import type { Metadata } from 'next'
import { Inter, Hind_Siliguri } from 'next/font/google'
import { notFound } from 'next/navigation'
import { hasLocale } from './dictionaries'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const hindSiliguri = Hind_Siliguri({
  weight: ['400', '500', '600', '700'],
  subsets: ['bengali'],
  variable: '--font-hind-siliguri',
})

export function generateStaticParams() {
  return [{ lang: 'bn' }, { lang: 'en' }]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const isBn = lang === 'bn'
  return {
    title: {
      template: isBn ? '%s | পাসপোর্ট ছবি' : '%s | BD Passport Photo',
      default: isBn ? 'পাসপোর্ট ছবি' : 'BD Passport Photo',
    },
    description: isBn
      ? 'বিনামূল্যে বাংলাদেশ পাসপোর্ট ছবি তৈরি করুন — সম্পূর্ণ আপনার ব্রাউজারে'
      : 'Free Bangladesh passport photo converter — runs entirely in your browser',
  }
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  return (
    <div className={`${inter.variable} ${hindSiliguri.variable} font-sans antialiased min-h-screen flex flex-col`}>
      {children}
    </div>
  )
}
