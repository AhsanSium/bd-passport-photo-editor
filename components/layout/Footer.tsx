import { cn } from '@/lib/utils'

interface Props {
  lang: string
}

export function Footer({ lang }: Props) {
  const isBn = lang === 'bn'
  return (
    <footer className="mt-auto border-t border-gray-100 bg-white py-8">
      <div className="mx-auto max-w-5xl px-4 text-center">
        <p className={cn('text-sm text-gray-400', isBn && 'font-bangla')}>
          {isBn
            ? 'ছবি কখনো সার্ভারে যায় না — সবকিছু আপনার ব্রাউজারে'
            : 'Your photo never leaves your device — all processing runs in the browser'}
        </p>
        <p className="mt-2 text-xs text-gray-300">
          {isBn ? '© ২০২৫ পাসপোর্ট ছবি' : '© 2025 BD Passport Photo'}
        </p>
      </div>
    </footer>
  )
}
