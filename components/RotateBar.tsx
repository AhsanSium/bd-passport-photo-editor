'use client'

import { useState } from 'react'
import { RotateCcw, RotateCw, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  onRotate: (degrees: 90 | -90) => Promise<void>
  lang: string
}

export function RotateBar({ onRotate, lang }: Props) {
  const [rotating, setRotating] = useState<'left' | 'right' | null>(null)
  const isBn = lang === 'bn'

  const handleRotate = async (dir: 'left' | 'right') => {
    if (rotating) return
    setRotating(dir)
    try {
      await onRotate(dir === 'left' ? -90 : 90)
    } finally {
      setRotating(null)
    }
  }

  const btnClass = cn(
    'flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5',
    'text-sm text-gray-600 transition-all duration-200',
    'hover:border-brand-green hover:text-brand-green hover:bg-brand-green-light',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-1',
  )

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => handleRotate('left')}
        disabled={rotating !== null}
        className={btnClass}
        aria-label={isBn ? 'বাম দিকে ৯০° ঘোরান' : 'Rotate 90° left'}
      >
        {rotating === 'left'
          ? <Loader2 className="h-4 w-4 animate-spin" />
          : <RotateCcw className="h-4 w-4" />
        }
        <span className={cn('hidden sm:inline text-xs font-medium', isBn && 'font-bangla')}>
          {isBn ? 'বামে ঘোরান' : 'Rotate left'}
        </span>
      </button>

      <button
        type="button"
        onClick={() => handleRotate('right')}
        disabled={rotating !== null}
        className={btnClass}
        aria-label={isBn ? 'ডান দিকে ৯০° ঘোরান' : 'Rotate 90° right'}
      >
        {rotating === 'right'
          ? <Loader2 className="h-4 w-4 animate-spin" />
          : <RotateCw className="h-4 w-4" />
        }
        <span className={cn('hidden sm:inline text-xs font-medium', isBn && 'font-bangla')}>
          {isBn ? 'ডানে ঘোরান' : 'Rotate right'}
        </span>
      </button>
    </div>
  )
}
