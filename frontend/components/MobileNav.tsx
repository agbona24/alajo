'use client'

import { useRouter, usePathname } from 'next/navigation'

export default function MobileNav() {
  const router = useRouter()
  const pathname = usePathname()

  const navItems = [
    { icon: '🏠', label: 'Home', path: '/dashboard' },
    { icon: '💰', label: 'Savings', path: '/savings' },
    { icon: '📊', label: 'Transactions', path: '/transactions' },
    { icon: '👤', label: 'Profile', path: '/profile' },
  ]

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + '/')
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
      <div className="grid grid-cols-4 gap-1">
        {navItems.map((item) => {
          const active = isActive(item.path)
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`flex flex-col items-center justify-center py-3 transition ${
                active
                  ? 'text-primary'
                  : 'text-gray-500 hover:text-primary'
              }`}
            >
              <span className="text-2xl mb-1">{item.icon}</span>
              <span className={`text-xs font-semibold ${active ? 'text-primary' : 'text-gray-600'}`}>
                {item.label}
              </span>
              {active && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-b-full"></div>
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
