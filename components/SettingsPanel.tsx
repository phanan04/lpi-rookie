'use client'

import { X, Sun, Moon, RotateCcw, Download, Upload } from 'lucide-react'
import { useSettings, type FontSize } from '@/lib/settingsContext'
import { loadProgress, resetProgress } from '@/lib/progress'

interface SettingsPanelProps {
  open: boolean
  onClose: () => void
  isDark: boolean
  onThemeToggle: () => void
}

const C = {
  border: 'rgba(255,255,255,0.06)',
  text: '#d1d0c5',
  sub: '#646669',
  accent: '#e2b714',
}

const FONT_OPTIONS: { value: FontSize; label: string; sample: string }[] = [
  { value: 'sm', label: 'Nhỏ', sample: '12' },
  { value: 'md', label: 'Vừa', sample: '14' },
  { value: 'lg', label: 'Lớn', sample: '16' },
]

export default function SettingsPanel({ open, onClose, isDark, onThemeToggle }: SettingsPanelProps) {
  const { settings, updateSettings } = useSettings()

  const handleExport = () => {
    const data = loadProgress()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'lpi-progress.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string)
          localStorage.setItem('lpi-progress', JSON.stringify(data))
          window.dispatchEvent(new Event('lpi-progress-update'))
          window.location.reload()
        } catch {
          alert('File không hợp lệ')
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  const handleReset = () => {
    if (confirm('⚠️ Xoá toàn bộ tiến độ? Hành động này không thể hoàn tác.')) {
      resetProgress()
      window.dispatchEvent(new Event('lpi-progress-update'))
      window.location.reload()
    }
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-50"
          style={{ background: 'rgba(0,0,0,0.45)' }}
          onClick={onClose}
        />
      )}
      <div
        className="fixed top-0 right-0 h-screen z-50 flex flex-col"
        style={{
          width: '300px',
          background: '#2c2e31',
          borderLeft: `1px solid ${C.border}`,
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.2s ease',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ borderBottom: `1px solid ${C.border}` }}
        >
          <h2 className="font-semibold text-sm" style={{ color: C.text }}>cài đặt</h2>
          <button onClick={onClose} style={{ color: C.sub }} className="transition-colors hover:text-white">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-7">
          {/* Theme */}
          <section>
            <p className="text-xs uppercase tracking-widest mb-3 font-semibold" style={{ color: C.sub }}>
              giao diện
            </p>
            <div className="flex gap-2">
              {[
                { val: true, label: 'tối', Icon: Moon },
                { val: false, label: 'sáng', Icon: Sun },
              ].map(({ val, label, Icon }) => (
                <button
                  key={label}
                  onClick={() => { if (isDark !== val) onThemeToggle() }}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-medium transition-colors"
                  style={{
                    background: isDark === val ? 'rgba(226,183,20,0.1)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${isDark === val ? 'rgba(226,183,20,0.3)' : C.border}`,
                    color: isDark === val ? C.accent : C.sub,
                  }}
                >
                  <Icon size={13} />
                  {label}
                </button>
              ))}
            </div>
          </section>

          {/* Font size */}
          <section>
            <p className="text-xs uppercase tracking-widest mb-3 font-semibold" style={{ color: C.sub }}>
              cỡ chữ bài học
            </p>
            <div className="flex gap-2">
              {FONT_OPTIONS.map(({ value, label, sample }) => (
                <button
                  key={value}
                  onClick={() => updateSettings({ fontSize: value })}
                  className="flex-1 flex flex-col items-center gap-1.5 rounded-lg py-3 text-xs font-medium transition-colors"
                  style={{
                    background: settings.fontSize === value ? 'rgba(226,183,20,0.1)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${settings.fontSize === value ? 'rgba(226,183,20,0.3)' : C.border}`,
                    color: settings.fontSize === value ? C.accent : C.sub,
                  }}
                >
                  <span className="font-bold" style={{ fontSize: `${sample}px`, lineHeight: 1 }}>A</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>
            <p className="text-xs mt-2" style={{ color: '#404244' }}>
              ảnh hưởng đến nội dung bài học
            </p>
          </section>

          {/* Progress management */}
          <section>
            <p className="text-xs uppercase tracking-widest mb-3 font-semibold" style={{ color: C.sub }}>
              tiến độ học
            </p>
            <div className="space-y-2">
              <button
                onClick={handleExport}
                className="w-full flex items-center gap-3 rounded-lg px-4 py-2.5 text-xs transition-colors"
                style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`, color: C.text }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
              >
                <Download size={13} style={{ color: C.sub }} />
                xuất tiến độ (.json)
              </button>
              <button
                onClick={handleImport}
                className="w-full flex items-center gap-3 rounded-lg px-4 py-2.5 text-xs transition-colors"
                style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`, color: C.text }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
              >
                <Upload size={13} style={{ color: C.sub }} />
                nhập tiến độ (.json)
              </button>
              <button
                onClick={handleReset}
                className="w-full flex items-center gap-3 rounded-lg px-4 py-2.5 text-xs transition-colors"
                style={{ background: 'rgba(202,71,84,0.06)', border: '1px solid rgba(202,71,84,0.2)', color: '#ca4754' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(202,71,84,0.12)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(202,71,84,0.06)')}
              >
                <RotateCcw size={13} />
                xoá toàn bộ tiến độ
              </button>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
