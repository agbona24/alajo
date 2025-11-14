'use client'

import { useRouter, usePathname } from 'next/navigation'

export default function MobileNav() {
  const router = useRouter()
  const pathname = usePathname()

  const navItems = [
    {
      icon: '🏠',
      activeIcon: '🏠',
      label: 'Home',
      path: '/dashboard',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: '💰',
      activeIcon: '💰',
      label: 'Savings',
      path: '/savings',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: '📊',
      activeIcon: '📊',
      label: 'Activity',
      path: '/transactions',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: '👤',
      activeIcon: '👤',
      label: 'Profile',
      path: '/profile',
      color: 'from-pink-500 to-pink-600'
    },
  ]

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === path
    }
    return pathname === path || pathname?.startsWith(path + '/')
  }

  return (
    <>
      {/* Safe area for iOS notch */}
      <div className="h-20 md:hidden"></div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50 safe-area-bottom">
        <div className="grid grid-cols-4 h-16 relative">
          {navItems.map((item) => {
            const active = isActive(item.path)
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`relative flex flex-col items-center justify-center transition-all duration-200 ${
                  active ? 'scale-110' : 'scale-100'
                }`}
                style={{
                  transform: active ? 'translateY(-8px)' : 'translateY(0)',
                }}
              >
                {/* Active indicator background */}
                {active && (
                  <div className={`absolute -top-1 w-14 h-14 bg-gradient-to-br ${item.color} rounded-2xl shadow-lg animate-fade-in-up flex items-center justify-center`}>
                    <span className="text-2xl filter drop-shadow-sm">{item.activeIcon}</span>
                  </div>
                )}

                {/* Inactive state */}
                {!active && (
                  <>
                    <span className="text-2xl mb-1 opacity-60">{item.icon}</span>
                    <span className="text-xs text-gray-500 font-medium">{item.label}</span>
                  </>
                )}

                {/* Active label */}
                {active && (
                  <span className="text-xs text-white font-bold mt-16">{item.label}</span>
                )}
              </button>
            )
          })}
        </div>

        {/* iPhone safe area */}
        <div className="h-safe-bottom bg-white"></div>
      </nav>
    </>
  )
}
