'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, FileText } from 'lucide-react'
import { getAllLessons, topics } from '@/lib/curriculum'

interface SearchModalProps {
  open: boolean
  onClose: () => void
}

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const allLessons = getAllLessons()

  useEffect(() => {
    if (open) {
      setQuery('')
      setTimeout(() => inputRef.current?.focus(), 60)
    }
  }, [open])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const q = query.trim().toLowerCase()
  const results = q.length < 2
    ? []
    : allLessons.filter(l => {
        const topic = topics.find(t => t.id === l.topicId)
        return (
          l.title.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q) ||
          l.id.includes(q) ||
          topic?.title.toLowerCase().includes(q)
        )
      }).slice(0, 10)

  const handleSelect = (id: string) => {
    router.push(`/lesson/${id}`)
    onClose()
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center pt-[18vh]"
      style={{ background: 'rgba(0,0,0,0.65)' }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '560px',
          maxWidth: 'calc(100vw - 32px)',
          background: '#2c2e31',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '14px',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        }}
      >
        {/* Input row */}
        <div
          className="flex items-center gap-3 px-4 py-3"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <Search size={15} style={{ color: '#646669', flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="tìm kiếm bài học..."
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: '#d1d0c5' }}
          />
          {query ? (
            <button onClick={() => setQuery('')} style={{ color: '#646669' }} className="hover:text-white transition-colors">
              <X size={14} />
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <kbd className="text-xs px-1.5 py-0.5 rounded font-mono" style={{ background: 'rgba(255,255,255,0.06)', color: '#646669' }}>⌘K</kbd>
              <kbd className="text-xs px-1.5 py-0.5 rounded font-mono" style={{ background: 'rgba(255,255,255,0.06)', color: '#646669' }}>Esc</kbd>
            </div>
          )}
        </div>

        {/* Results */}
        {q.length >= 2 ? (
          <div className="max-h-[340px] overflow-y-auto py-1">
            {results.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm" style={{ color: '#646669' }}>
                Không tìm thấy kết quả cho &quot;{query}&quot;
              </p>
            ) : (
              results.map(lesson => {
                const topic = topics.find(t => t.id === lesson.topicId)
                return (
                  <button
                    key={lesson.id}
                    onClick={() => handleSelect(lesson.id)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                    style={{ background: 'transparent' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <FileText size={14} style={{ color: '#646669', flexShrink: 0 }} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono flex-shrink-0" style={{ color: '#e2b714' }}>
                          {lesson.id}
                        </span>
                        <span className="text-sm font-medium truncate" style={{ color: '#d1d0c5' }}>
                          {lesson.title}
                        </span>
                      </div>
                      <p className="text-xs truncate mt-0.5" style={{ color: '#646669' }}>
                        Topic {topic?.id}: {topic?.title}
                      </p>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        ) : (
          <div className="px-4 py-4 text-xs" style={{ color: '#646669' }}>
            Nhập ít nhất 2 ký tự để tìm trong {allLessons.length} bài học
          </div>
        )}
      </div>
    </div>
  )
}
