'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { LayoutDashboard, Terminal as TerminalIcon, BarChart2, ClipboardCheck, FileQuestion, Layers, ChevronRight, ChevronLeft, Check } from 'lucide-react'
import { topics } from '@/lib/curriculum'
import { loadProgress } from '@/lib/progress'
import type { ProgressState } from '@/lib/types'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  mobileOpen?: boolean
}

export default function Sidebar({ collapsed, onToggle, mobileOpen = false }: SidebarProps) {
  const pathname = usePathname()
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({})
  const [progress, setProgress] = useState<ProgressState>({
    completedLessons: [],
    quizScores: {},
    examScores: [],
  })

  useEffect(() => {
    setProgress(loadProgress())
    const match = pathname.match(/\/(lesson|quiz)\/(\d+)/)
    if (match) {
      const topicId = match[2].slice(0, 3)
      setOpenGroups((prev) => ({ ...prev, [topicId]: true }))
    }
  }, [pathname])

  useEffect(() => {
    const handler = () => setProgress(loadProgress())
    window.addEventListener('lpi-progress-update', handler)
    return () => window.removeEventListener('lpi-progress-update', handler)
  }, [])

  const toggleGroup = (topicId: string) => {
    setOpenGroups((prev) => ({ ...prev, [topicId]: !prev[topicId] }))
  }

  const totalLessons = topics.reduce((sum, t) => sum + t.lessons.length, 0)
  const completedCount = progress.completedLessons.length
  const overallPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

  const getTopicPct = (topicId: string) => {
    const topicLessons = topics.find((t) => t.id === topicId)?.lessons ?? []
    if (topicLessons.length === 0) return 0
    const done = topicLessons.filter((l) => progress.completedLessons.includes(l.id)).length
    return Math.round((done / topicLessons.length) * 100)
  }

  const isActive = (href: string) => pathname === href

  return (
    <aside
      style={{
        background: '#2c2e31',
        borderRight: '1px solid rgba(255,255,255,0.04)',
        transform: mobileOpen ? 'translateX(0)' : undefined,
      }}
      className={`
        fixed left-0 top-0 h-screen z-50 flex flex-col
        transition-all duration-200 overflow-hidden
        -translate-x-full md:translate-x-0
        ${collapsed ? 'w-[60px]' : 'w-[260px]'}
      `}
    >
      {/* ── Header / Logo ── */}
      <div
        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
        className="flex items-center justify-between px-4 py-4 flex-shrink-0"
      >
        {!collapsed && (
          <div className="flex items-center gap-2.5 min-w-0">
            <TerminalIcon size={20} style={{ color: '#e2b714' }} />
            <div className="min-w-0">
              <div
                className="font-bold text-sm truncate"
                style={{ color: '#d1d0c5', fontFamily: 'Lexend Deca, sans-serif' }}
              >
                LPI 101-500
              </div>
              <div className="text-xs truncate" style={{ color: '#646669' }}>
                Linux Learning
              </div>
            </div>
          </div>
        )}
        {collapsed && (
          <TerminalIcon size={20} className="mx-auto" style={{ color: '#e2b714' }} />
        )}
        <button
          onClick={onToggle}
          style={{ color: '#646669' }}
          className="hover:text-white p-1.5 rounded transition-colors flex-shrink-0 ml-auto text-sm"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* ── Overall Progress ── */}
      {!collapsed && (
        <div
          style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
          className="px-4 py-3 flex-shrink-0"
        >
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs" style={{ color: '#646669' }}>tiến độ tổng thể</span>
            <span className="text-xs font-semibold mono" style={{ color: '#e2b714' }}>{overallPct}%</span>
          </div>
          <div className="progress-bar-mt">
            <div className="progress-fill-mt" style={{ width: `${overallPct}%` }} />
          </div>
          <div className="text-xs mt-1" style={{ color: '#646669' }}>
            {completedCount}/{totalLessons} bài học
          </div>
        </div>
      )}

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-sub scrollbar-track-transparent">
        {/* Dashboard */}
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-2 text-sm transition-colors"
          style={{
            color: isActive('/') ? '#e2b714' : '#646669',
            background: isActive('/') ? 'rgba(226,183,20,0.06)' : 'transparent',
            fontWeight: isActive('/') ? 600 : 400,
          }}
        >
          <LayoutDashboard size={16} className="flex-shrink-0" />
          {!collapsed && <span>dashboard</span>}
        </Link>

        {/* Terminal */}
        <Link
          href="/terminal"
          className="flex items-center gap-3 px-4 py-2 text-sm transition-colors"
          style={{
            color: isActive('/terminal') ? '#e2b714' : '#646669',
            background: isActive('/terminal') ? 'rgba(226,183,20,0.06)' : 'transparent',
            fontWeight: isActive('/terminal') ? 600 : 400,
          }}
        >
          <TerminalIcon size={16} className="flex-shrink-0" />
          {!collapsed && <span>terminal</span>}
        </Link>

        {/* Section label */}
        {!collapsed && (
          <div className="px-4 mt-3 mb-1">
            <span className="text-xs uppercase tracking-widest" style={{ color: '#404244', fontWeight: 600 }}>
              chương trình học
            </span>
          </div>
        )}

        {/* Topic Groups */}
        {topics.map((topic) => {
          const isOpen = openGroups[topic.id] ?? false
          const topicPct = getTopicPct(topic.id)
          const isTopicActive =
            pathname.includes(`/lesson/${topic.id}`) ||
            pathname === `/quiz/${topic.id}` ||
            topic.lessons.some((l) => pathname === `/lesson/${l.id}`)

          return (
            <div key={topic.id}>
              <button
                onClick={() => toggleGroup(topic.id)}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors text-left"
                style={{
                  color: isTopicActive ? '#d1d0c5' : '#646669',
                }}
                onMouseEnter={(e) => { if (!isTopicActive) (e.currentTarget as HTMLElement).style.color = '#d1d0c5' }}
                onMouseLeave={(e) => { if (!isTopicActive) (e.currentTarget as HTMLElement).style.color = '#646669' }}
              >
                <topic.icon size={16} className="flex-shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1 truncate text-xs">
                      {topic.id} · {topic.title}
                    </span>
                    {topicPct === 100 && (
                      <Check size={12} className="flex-shrink-0" style={{ color: '#4caf74' }} />
                    )}
                    {topicPct > 0 && topicPct < 100 && (
                      <span className="text-xs flex-shrink-0 mono" style={{ color: '#e2b714' }}>{topicPct}%</span>
                    )}
                    <ChevronRight
                      size={11}
                      className={`flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                      style={{ color: '#404244' }}
                    />
                  </>
                )}
              </button>

              {!collapsed && isOpen && (
                <div style={{ background: 'rgba(0,0,0,0.1)' }}>
                  {topic.lessons.map((lesson) => {
                    const done = progress.completedLessons.includes(lesson.id)
                    const active = isActive(`/lesson/${lesson.id}`)
                    return (
                      <Link
                        key={lesson.id}
                        href={`/lesson/${lesson.id}`}
                        className="flex items-center gap-2 pl-10 pr-4 py-1.5 text-xs transition-colors"
                        style={{
                          color: active ? '#e2b714' : done ? '#4caf74' : '#646669',
                          background: active ? 'rgba(226,183,20,0.06)' : 'transparent',
                          fontWeight: active ? 600 : 400,
                        }}
                      >
                        {done ? (
                          <Check size={11} className="flex-shrink-0" style={{ color: '#4caf74' }} />
                        ) : (
                          <span
                            className="w-2.5 h-2.5 rounded-full border flex-shrink-0"
                            style={{ borderColor: '#404244' }}
                          />
                        )}
                        <span className="truncate">{lesson.id} {lesson.title}</span>
                      </Link>
                    )
                  })}

                  <Link
                    href={`/quiz/${topic.id}`}
                    className="flex items-center gap-2 pl-10 pr-4 py-1.5 text-xs font-medium transition-colors"
                    style={{
                      color: isActive(`/quiz/${topic.id}`) ? '#e2b714' : '#646669',
                      background: isActive(`/quiz/${topic.id}`) ? 'rgba(226,183,20,0.06)' : 'transparent',
                    }}
                  >
                    <FileQuestion size={14} className="flex-shrink-0" />
                    <span>quiz · {topic.id}</span>
                    {progress.quizScores[topic.id] !== undefined && (
                      <span className="ml-auto mono text-xs" style={{ color: '#e2b714' }}>
                        {progress.quizScores[topic.id]}%
                      </span>
                    )}
                  </Link>
                </div>
              )}
            </div>
          )
        })}

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }} className="mt-2 pt-2">
          <Link
            href="/flashcard"
            className="flex items-center gap-3 px-4 py-2 text-sm transition-colors"
            style={{ color: isActive('/flashcard') ? '#e2b714' : '#646669' }}
          >
            <Layers size={16} className="flex-shrink-0" />
            {!collapsed && <span>flashcard</span>}
          </Link>
          <Link
            href="/progress"
            className="flex items-center gap-3 px-4 py-2 text-sm transition-colors"
            style={{ color: isActive('/progress') ? '#e2b714' : '#646669' }}
          >
            <BarChart2 size={16} className="flex-shrink-0" />
            {!collapsed && <span>tiến độ</span>}
          </Link>
          <Link
            href="/exam"
            className="flex items-center gap-3 px-4 py-2 text-sm transition-colors"
            style={{ color: isActive('/exam') ? '#e2b714' : '#646669' }}
          >
            <ClipboardCheck size={16} className="flex-shrink-0" />
            {!collapsed && <span>thi thử</span>}
          </Link>
        </div>
      </nav>
    </aside>
  )
}
