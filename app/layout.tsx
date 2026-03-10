'use client'

import './globals.css'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import TopBar from '@/components/TopBar'
import ChatWidget from '@/components/ChatWidget'
import { SettingsProvider } from '@/lib/settingsContext'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isDark, setIsDark] = useState(true)
  const pathname = usePathname()

  // Auto-close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    const saved = localStorage.getItem('lpi-theme')
    // Default to the Monkeytype dark theme
    const preferDark = !saved || saved === 'dark'
    setIsDark(preferDark)
    // Set BOTH class and data-theme so Tailwind dark: variants AND CSS vars both work
    document.documentElement.classList.toggle('dark', preferDark)
    document.documentElement.setAttribute('data-theme', preferDark ? 'dark' : 'light')
  }, [])

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light')
    localStorage.setItem('lpi-theme', next ? 'dark' : 'light')
  }

  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <title>LPI 101-500 Linux Learning</title>
        <meta name="description" content="Học Linux LPIC-1 / LPI 101-500 toàn diện" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Lexend+Deca:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning style={{ background: '#323437', color: '#d1d0c5', minHeight: '100vh', display: 'flex' }}>
      <SettingsProvider>
        {/* Mobile overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 md:hidden"
            style={{ background: 'rgba(0,0,0,0.6)' }}
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Sidebar — self-fixed inside the component, always sticks */}
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          mobileOpen={mobileOpen}
        />

          {/* Main area — full width on mobile, offset by sidebar on md+ */}
          <div
            className={`flex flex-col min-h-screen transition-all duration-200 ${
              sidebarCollapsed ? 'md:ml-[60px]' : 'md:ml-[260px]'
            }`}
            style={{ flex: 1, minWidth: 0 }}
          >
          <TopBar
            onMobileToggle={() => setMobileOpen(!mobileOpen)}
            onThemeToggle={toggleTheme}
            isDark={isDark}
          />
          <main
            className="flex-1 w-full mx-auto px-4 py-5 sm:px-6 sm:py-7 md:px-8 md:py-8"
            style={{ maxWidth: '960px' }}
          >
            {children}
          </main>
        </div>
        <ChatWidget />
      </SettingsProvider>
      </body>
    </html>
  )
}
