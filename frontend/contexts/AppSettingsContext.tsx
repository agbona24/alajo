'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { appSettingsAPI } from '@/lib/api'

interface AppSettings {
  app_name: string
  app_description: string
  app_logo: string | null
  app_favicon: string | null
  support_email: string | null
  support_phone: string | null
  currency_symbol: string
  currency_code: string
}

interface AppSettingsContextType {
  settings: AppSettings | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

const defaultSettings: AppSettings = {
  app_name: 'Alajo',
  app_description: 'Digital Savings Platform',
  app_logo: null,
  app_favicon: null,
  support_email: null,
  support_phone: null,
  currency_symbol: '₦',
  currency_code: 'NGN',
}

const AppSettingsContext = createContext<AppSettingsContextType>({
  settings: defaultSettings,
  loading: false,
  error: null,
  refetch: async () => {},
})

export const useAppSettings = () => {
  const context = useContext(AppSettingsContext)
  if (!context) {
    throw new Error('useAppSettings must be used within AppSettingsProvider')
  }
  return context
}

export const AppSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings | null>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSettings = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await appSettingsAPI.getSettings()
      setSettings(response.data)
    } catch (err: any) {
      console.error('Failed to fetch app settings:', err)
      setError(err.response?.data?.message || 'Failed to load app settings')
      // Keep default settings on error
      setSettings(defaultSettings)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  const value = {
    settings,
    loading,
    error,
    refetch: fetchSettings,
  }

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  )
}
