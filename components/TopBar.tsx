'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Settings, Menu } from 'lucide-react'
import SearchModal from './SearchModal'
import SettingsPanel from './SettingsPanel'

interface TopBarProps {
  breadcrumb?: string
  onMobileToggle: () => void
  onThemeToggle: () => void
  isDark: boolean
}

export default function TopBar({ breadcrumb, onMobileToggle, onThemeToggle, isDark }: TopBarProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <>
    <header
      style={{
        background: '#2c2e31',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        height: '52px',
      }}
      className="sticky top-0 z-40 flex items-center px-5 gap-4"
    >
      {/* Mobile toggle */}
      <button
        onClick={onMobileToggle}
        className="md:hidden p-1 transition-colors text-sm"
        style={{ color: '#646669' }}
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>

      {/* Breadcrumb */}
      <div className="flex-1 min-w-0">
        <div className="text-sm truncate" style={{ color: '#646669', fontFamily: 'Lexend Deca, sans-serif' }}>
          <Link
            href="/"
            className="transition-colors hover:text-white"
            style={{ color: '#646669' }}
          >
            lpi 101-500
          </Link>
          {breadcrumb && (
            <>
              <span className="mx-2" style={{ color: '#404244' }}>›</span>
              <span style={{ color: '#d1d0c5', fontWeight: 500 }}>{breadcrumb}</span>
            </>
          )}
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => setSearchOpen(true)}
          className="w-8 h-8 rounded flex items-center justify-center transition-colors"
          style={{ color: '#646669' }}
          title="Tìm kiếm (Ctrl+K)"
          onMouseEnter={(e) => (e.currentTarget.style.color = '#d1d0c5')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#646669')}
        >
          <Search size={15} />
        </button>
        <button
          onClick={() => setSettingsOpen(true)}
          className="w-8 h-8 rounded flex items-center justify-center transition-colors"
          style={{ color: '#646669' }}
          title="Cài đặt"
          onMouseEnter={(e) => (e.currentTarget.style.color = '#d1d0c5')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#646669')}
        >
          <Settings size={15} />
        </button>
      </div>
    </header>

    <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    <SettingsPanel
      open={settingsOpen}
      onClose={() => setSettingsOpen(false)}
      isDark={isDark}
      onThemeToggle={onThemeToggle}
    />
    </>
  )
}
