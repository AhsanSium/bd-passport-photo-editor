'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FaqItem {
  q: string
  a: string
}

interface Props {
  items: FaqItem[]
  isBn: boolean
}

function AccordionItem({ item, isBn, index }: { item: FaqItem; isBn: boolean; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className={cn(
        'rounded-xl border border-gray-200 bg-white transition-shadow duration-200',
        open ? 'shadow-sm' : 'hover:shadow-sm',
      )}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left"
      >
        <span className={cn('font-medium text-gray-800 text-sm sm:text-base leading-snug', isBn && 'font-bangla')}>
          {item.q}
        </span>
        <ChevronDown
          className={cn(
            'mt-0.5 h-5 w-5 shrink-0 text-brand-green transition-transform duration-300',
            open && 'rotate-180',
          )}
        />
      </button>

      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: open ? '400px' : '0' }}
      >
        <p className={cn('px-5 pb-4 text-sm leading-relaxed text-gray-600', isBn && 'font-bangla')}>
          {item.a}
        </p>
      </div>
    </div>
  )
}

export function FaqAccordion({ items, isBn }: Props) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => (
        <AccordionItem key={i} item={item} isBn={isBn} index={i} />
      ))}
    </div>
  )
}
