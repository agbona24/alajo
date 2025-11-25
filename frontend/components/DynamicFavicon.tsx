'use client'

import { useEffect } from 'react'
import { useAppSettings } from '@/contexts/AppSettingsContext'

export default function DynamicFavicon() {
  const { settings } = useAppSettings()

  useEffect(() => {
    const favicon = settings?.app_favicon

    if (favicon) {
      // Remove existing favicon links
      const existingFavicons = document.querySelectorAll("link[rel*='icon']")
      existingFavicons.forEach(link => link.remove())

      // Add new favicon
      const link = document.createElement('link')
      link.rel = 'icon'
      link.type = 'image/png'
      link.href = favicon
      document.head.appendChild(link)

      // Add apple touch icon
      const appleLink = document.createElement('link')
      appleLink.rel = 'apple-touch-icon'
      appleLink.href = favicon
      document.head.appendChild(appleLink)
    }
  }, [settings?.app_favicon])

  return null
}
