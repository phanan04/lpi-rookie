'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, FileText, BookOpen } from 'lucide-react'
import { getAllLessons, topics } from '@/lib/curriculum'
import type { Lesson, SectionType } from '@/lib/types'

interface SearchModalProps {
  open: boolean
  onClose: () => void
}

interface SearchResult {
  lesson: Lesson
  score: number
  matchContext: string   // snippet showing where the match was found
  matchField: 'id' | 'title' | 'description' | 'topic' | 'content'
}

// Extract plain text from all searchable sections
function extractSectionText(sections: SectionType[]): string {
  return sections
    .flatMap(s => {
      if (s.type === 'h2' || s.type === 'h3' || s.type === 'p' || s.type === 'code') return [s.text]
      if (s.type === 'tip' || s.type === 'warning' || s.type === 'info' || s.type === 'exam')
        return [s.title, s.body]
      if (s.type === 'list' || s.type === 'olist') return s.items
      if (s.type === 'table') return [...s.headers, ...s.rows.flat()]
      return []
    })
    .join(' ')
}

// Simple fuzzy: returns true if all chars of pattern appear in order in str
function fuzzyMatch(str: string, pattern: string): boolean {
  let si = 0
  for (let pi = 0; pi < pattern.length; pi++) {
    const idx = str.indexOf(pattern[pi], si)
    if (idx === -1) return false
    si = idx + 1
  }
  return true
}

// Score a lesson against a query. Higher = better match.
function scoreLesson(lesson: Lesson, topicTitle: string, q: string): { score: number; matchContext: string; matchField: SearchResult['matchField'] } {
  const title = lesson.title.toLowerCase()
  const desc = lesson.description.toLowerCase()
  const id = lesson.id.toLowerCase()
  const topic = topicTitle.toLowerCase()

  // Exact ID match
  if (id === q) return { score: 1000, matchContext: lesson.description, matchField: 'id' }
  if (id.startsWith(q)) return { score: 900, matchContext: lesson.description, matchField: 'id' }

  // Title scoring
  if (title === q) return { score: 850, matchContext: lesson.description, matchField: 'title' }
  if (title.startsWith(q)) return { score: 750, matchContext: lesson.description, matchField: 'title' }
  if (title.includes(q)) return { score: 650, matchContext: lesson.description, matchField: 'title' }

  // Description
  if (desc.includes(q)) return { score: 500, matchContext: lesson.description, matchField: 'description' }

  // Topic title
  if (topic.includes(q)) return { score: 400, matchContext: lesson.description, matchField: 'topic' }

  // Section content search
  const contentText = extractSectionText(lesson.sections)
  const contentLower = contentText.toLowerCase()
  const contentIdx = contentLower.indexOf(q)
  if (contentIdx !== -1) {
    const start = Math.max(0, contentIdx - 30)
    const end = Math.min(contentText.length, contentIdx + q.length + 50)
    const snippet = (start > 0 ? '…' : '') + contentText.slice(start, end) + (end < contentText.length ? '…' : '')
    return { score: 300, matchContext: snippet, matchField: 'content' }
  }

  // Fuzzy match on title (last resort, lower score)
  if (q.length >= 3 && fuzzyMatch(title, q)) {
    return { score: 150, matchContext: lesson.description, matchField: 'title' }
  }

  return { score: 0, matchContext: '', matchField: 'title' }
}

// Highlight query match inside text
function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <mark style={{ background: 'rgba(226,183,20,0.35)', color: '#e2b714', borderRadius: '2px', padding: '0 1px' }}>
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  )
}

const FIELD_LABELS: Record<SearchResult['matchField'], string> = {
  id: 'ID',
  title: 'Tiêu đề',
  description: 'Mô tả',
  topic: 'Topic',
  content: 'Nội dung',
}

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const allLessons = useMemo(() => getAllLessons(), [])

  useEffect(() => {
    if (open) {
      setQuery('')
      setActiveIndex(0)
      setTimeout(() => inputRef.current?.focus(), 60)
    }
  }, [open])

  const q = query.trim().toLowerCase()

  const results: SearchResult[] = useMemo(() => {
    if (q.length < 2) return []
    return allLessons
      .map(lesson => {
        const topic = topics.find(t => t.id === lesson.topicId)
        const { score, matchContext, matchField } = scoreLesson(lesson, topic?.title ?? '', q)
        return { lesson, score, matchContext, matchField }
      })
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
  }, [allLessons, q])

  // Reset active index when results change
  useEffect(() => { setActiveIndex(0) }, [results])

  const handleSelect = useCallback((id: string) => {
    router.push(`/lesson/${id}`)
    onClose()
  }, [router, onClose])

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!open) return
      if (e.key === 'Escape') { onClose(); return }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex(i => Math.min(i + 1, results.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex(i => Math.max(i - 1, 0))
      } else if (e.key === 'Enter' && results.length > 0) {
        e.preventDefault()
        handleSelect(results[activeIndex]?.lesson.id)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose, results, activeIndex, handleSelect])

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${activeIndex}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh]"
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(2px)' }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '600px',
          maxWidth: 'calc(100vw - 32px)',
          background: '#2c2e31',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '14px',
          overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
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
            onChange={e => { setQuery(e.target.value); setActiveIndex(0) }}
            placeholder="tìm kiếm bài học, lệnh, khái niệm..."
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: '#d1d0c5' }}
          />
          {query ? (
            <button onClick={() => setQuery('')} style={{ color: '#646669' }} className="hover:text-white transition-colors">
              <X size={14} />
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <kbd className="text-xs px-1.5 py-0.5 rounded font-mono" style={{ background: 'rgba(255,255,255,0.06)', color: '#646669' }}>Ctrl K</kbd>
              <kbd className="text-xs px-1.5 py-0.5 rounded font-mono" style={{ background: 'rgba(255,255,255,0.06)', color: '#646669' }}>Esc</kbd>
            </div>
          )}
        </div>

        {/* Results */}
        {q.length >= 2 ? (
          <div ref={listRef} className="max-h-[400px] overflow-y-auto py-1">
            {results.length === 0 ? (
              <div className="px-4 py-8 flex flex-col items-center gap-2" style={{ color: '#646669' }}>
                <Search size={28} style={{ opacity: 0.3 }} />
                <p className="text-sm">Không tìm thấy kết quả cho &quot;{query}&quot;</p>
                <p className="text-xs" style={{ opacity: 0.6 }}>Thử từ khóa khác hoặc kiểm tra chính tả</p>
              </div>
            ) : (
              <>
                <div className="px-4 pt-2 pb-1">
                  <span className="text-xs" style={{ color: '#646669' }}>
                    {results.length} kết quả
                  </span>
                </div>
                {results.map((result, idx) => {
                  const { lesson, matchContext, matchField } = result
                  const topic = topics.find(t => t.id === lesson.topicId)
                  const isActive = idx === activeIndex
                  return (
                    <button
                      key={lesson.id}
                      data-idx={idx}
                      onClick={() => handleSelect(lesson.id)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className="w-full flex items-start gap-3 px-4 py-2.5 text-left transition-colors"
                      style={{ background: isActive ? 'rgba(226,183,20,0.08)' : 'transparent', borderLeft: isActive ? '2px solid #e2b714' : '2px solid transparent' }}
                    >
                      {matchField === 'content' ? (
                        <BookOpen size={14} style={{ color: '#646669', flexShrink: 0, marginTop: '3px' }} />
                      ) : (
                        <FileText size={14} style={{ color: '#646669', flexShrink: 0, marginTop: '3px' }} />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono flex-shrink-0" style={{ color: '#e2b714' }}>
                            {lesson.id}
                          </span>
                          <span className="text-sm font-medium truncate" style={{ color: isActive ? '#e2b714' : '#d1d0c5' }}>
                            <Highlight text={lesson.title} query={['title', 'id'].includes(matchField) ? query.trim() : ''} />
                          </span>
                          <span className="text-xs ml-auto flex-shrink-0 px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.05)', color: '#646669' }}>
                            {FIELD_LABELS[matchField]}
                          </span>
                        </div>
                        <p className="text-xs mt-0.5" style={{ color: '#646669' }}>
                          Topic {topic?.id}: {topic?.title}
                        </p>
                        {matchField === 'content' || matchField === 'description' ? (
                          <p className="text-xs mt-1 line-clamp-2 leading-relaxed" style={{ color: '#8b8e94' }}>
                            <Highlight text={matchContext} query={query.trim()} />
                          </p>
                        ) : null}
                      </div>
                    </button>
                  )
                })}
              </>
            )}
          </div>
        ) : (
          <div className="px-4 py-4">
            <p className="text-xs mb-3" style={{ color: '#646669' }}>
              Nhập ít nhất 2 ký tự để tìm trong {allLessons.length} bài học
            </p>
            <div className="flex gap-4 text-xs" style={{ color: '#646669' }}>
              <span className="flex items-center gap-1.5">
                <kbd className="px-1 py-0.5 rounded font-mono text-[10px]" style={{ background: 'rgba(255,255,255,0.06)' }}>↑↓</kbd> điều hướng
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="px-1 py-0.5 rounded font-mono text-[10px]" style={{ background: 'rgba(255,255,255,0.06)' }}>Enter</kbd> mở bài học
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="px-1 py-0.5 rounded font-mono text-[10px]" style={{ background: 'rgba(255,255,255,0.06)' }}>Esc</kbd> đóng
              </span>
            </div>
          </div>
        )}

        {/* Footer hint when results shown */}
        {q.length >= 2 && results.length > 0 && (
          <div
            className="flex items-center gap-4 px-4 py-2 text-xs"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)', color: '#646669' }}
          >
            <span className="flex items-center gap-1.5">
              <kbd className="px-1 py-0.5 rounded font-mono text-[10px]" style={{ background: 'rgba(255,255,255,0.06)' }}>↑↓</kbd> điều hướng
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1 py-0.5 rounded font-mono text-[10px]" style={{ background: 'rgba(255,255,255,0.06)' }}>Enter</kbd> mở
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
