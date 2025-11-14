'use client'

import { useRouter } from 'next/navigation'

interface AppHeaderProps {
  title?: string
  subtitle?: string
  showBack?: boolean
  transparent?: boolean
  gradient?: boolean
  action?: {
    icon: string
    onClick: () => void
  }
  children?: React.ReactNode
}

export default function AppHeader({
  title,
  subtitle,
  showBack = false,
  transparent = false,
  gradient = false,
  action,
  children
}: AppHeaderProps) {
  const router = useRouter()

  return (
    <header
      className={`sticky top-0 z-40 ${
        transparent
          ? 'bg-transparent'
          : gradient
          ? 'bg-gradient-to-r from-primary to-secondary text-white'
          : 'bg-white border-b border-gray-200'
      }`}
    >
      {/* Status bar spacer for iOS */}
      <div className="h-safe-top md:hidden"></div>

      <div className="flex items-center justify-between px-4 h-14">
        {/* Left side - Back button or logo */}
        <div className="flex items-center gap-3">
          {showBack ? (
            <button
              onClick={() => router.back()}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition active:scale-95 ${
                gradient || transparent
                  ? 'bg-white/20 backdrop-blur-sm text-white active:bg-white/30'
                  : 'bg-gray-100 text-gray-700 active:bg-gray-200'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-2xl">💰</span>
              <span className={`text-lg font-bold ${gradient ? 'text-white' : 'bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'}`}>
                Hajo
              </span>
            </div>
          )}

          {/* Title */}
          {title && (
            <div>
              <h1 className={`text-lg font-bold ${gradient ? 'text-white' : 'text-gray-900'}`}>
                {title}
              </h1>
              {subtitle && (
                <p className={`text-xs ${gradient ? 'text-white/80' : 'text-gray-500'}`}>
                  {subtitle}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right side - Action button */}
        {action && (
          <button
            onClick={action.onClick}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition active:scale-95 ${
              gradient || transparent
                ? 'bg-white/20 backdrop-blur-sm text-white active:bg-white/30'
                : 'bg-gray-100 text-gray-700 active:bg-gray-200'
            }`}
          >
            <span className="text-xl">{action.icon}</span>
          </button>
        )}

        {/* Custom children */}
        {children}
      </div>
    </header>
  )
}
