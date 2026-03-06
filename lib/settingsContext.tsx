'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export type FontSize = 'sm' | 'md' | 'lg'

export interface AppSettings {
  fontSize: FontSize
}

interface SettingsContextType {
  settings: AppSettings
  updateSettings: (partial: Partial<AppSettings>) => void
}

const DEFAULT: AppSettings = { fontSize: 'md' }

const SettingsContext = createContext<SettingsContextType>({
  settings: DEFAULT,
  updateSettings: () => {},
})

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('lpi-settings')
      if (saved) setSettings({ ...DEFAULT, ...JSON.parse(saved) })
    } catch {}
  }, [])

  const updateSettings = (partial: Partial<AppSettings>) => {
    const next = { ...settings, ...partial }
    setSettings(next)
    try {
      localStorage.setItem('lpi-settings', JSON.stringify(next))
    } catch {}
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  return useContext(SettingsContext)
}
