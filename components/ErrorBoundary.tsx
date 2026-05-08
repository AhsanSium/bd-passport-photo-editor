'use client'

import { Component, type ReactNode, type ErrorInfo } from 'react'

interface Props {
  children: ReactNode
  lang?: string
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary] Photo converter error:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      const isBn = this.props.lang === 'bn'
      return (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className={`text-sm text-red-600 ${isBn ? 'font-bangla' : ''}`}>
            {isBn
              ? 'ছবি প্রক্রিয়া করতে সমস্যা হয়েছে। পেজ রিফ্রেশ করুন।'
              : 'Something went wrong. Please refresh the page and try again.'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-3 text-xs text-red-500 underline"
          >
            {isBn ? 'আবার চেষ্টা করুন' : 'Try again'}
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
