'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { topics, getAllLessons } from '@/lib/curriculum'
import { loadProgress, resetProgress } from '@/lib/progress'
import type { ProgressState } from '@/lib/types'
import { Trash2 } from 'lucide-react'

const MT = {
  bg: '#2c2e31',
  text: '#d1d0c5',
  sub: '#646669',
  accent: '#e2b714',
  success: '#4caf74',
  error: '#ca4754',
  border: 'rgba(255,255,255,0.05)',
}

export default function ProgressPage() {
  const [progress, setProgress] = useState<ProgressState>({
    completedLessons: [],
    quizScores: {},
    examScores: [],
  })

  useEffect(() => {
    setProgress(loadProgress())
    const handler = () => setProgress(loadProgress())
    window.addEventListener('lpi-progress-update', handler)
    return () => window.removeEventListener('lpi-progress-update', handler)
  }, [])

  const allLessons = getAllLessons()
  const totalLessons = allLessons.length
  const completedCount = progress.completedLessons.length
  const overallPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

  const handleReset = () => {
    if (window.confirm('Bạn có chắc muốn xóa toàn bộ tiến độ học tập không?')) {
      resetProgress()
      setProgress(loadProgress())
    }
  }

  const card = {
    background: MT.bg,
    borderRadius: '12px',
    border: `1px solid ${MT.border}`,
    padding: '20px 24px',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <nav className="flex items-center gap-2 text-xs mb-4" style={{ color: MT.sub }}>
          <Link href="/" style={{ color: MT.sub }} className="hover:text-white transition-colors">trang chủ</Link>
          <span style={{ color: '#404244' }}>/</span>
          <span style={{ color: MT.text, fontWeight: 500 }}>tiến độ</span>
        </nav>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: MT.text, fontFamily: 'Lexend Deca, sans-serif', letterSpacing: '-0.01em' }}>
              tiến độ học tập
            </h1>
            <p className="text-sm" style={{ color: MT.sub }}>theo dõi chi tiết quá trình học LPI 101-500</p>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-sm rounded-lg px-3 py-1.5 transition-colors"
            style={{ color: MT.error, border: `1px solid rgba(202,71,84,0.3)`, background: 'rgba(202,71,84,0.06)' }}
          >
            <Trash2 size={14} /> reset tất cả
          </button>
        </div>
      </div>

      {/* Overall progress */}
      <div style={card}>
        <div className="flex items-end justify-between mb-2">
          <h2 className="font-semibold text-sm" style={{ color: MT.sub, textTransform: 'uppercase', letterSpacing: '0.05em' }}>tổng tiến độ</h2>
          <span className="text-2xl font-bold mono" style={{ color: MT.accent }}>{overallPct}%</span>
        </div>
        <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden', marginBottom: '8px' }}>
          <div style={{ height: '100%', width: `${overallPct}%`, background: MT.accent, borderRadius: '2px', transition: 'width 0.7s ease' }} />
        </div>
        <p className="text-xs" style={{ color: MT.sub }}>
          {completedCount} / {totalLessons} bài học đã hoàn thành
        </p>
      </div>

      {/* Per-topic */}
      <div className="space-y-4">
        {topics.map((topic) => {
          const topicLessons = topic.lessons
          const completedInTopic = topicLessons.filter((l) =>
            progress.completedLessons.includes(l.id),
          )
          const pct = topicLessons.length > 0
            ? Math.round((completedInTopic.length / topicLessons.length) * 100)
            : 0
          const quizScore = progress.quizScores[topic.id]

          return (
            <div key={topic.id} style={card}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <topic.icon size={24} className="flex-shrink-0" />
                  <div>
                    <p className="text-xs mono mb-0.5" style={{ color: MT.sub }}>topic {topic.id}</p>
                    <h3 className="font-bold text-sm" style={{ color: MT.text }}>{topic.title}</h3>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold mono" style={{ color: pct === 100 ? MT.success : MT.text }}>{pct}%</p>
                  <p className="text-xs" style={{ color: MT.sub }}>{completedInTopic.length}/{topicLessons.length} bài</p>
                </div>
              </div>

              <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden', marginBottom: '16px' }}>
                <div style={{
                  height: '100%',
                  width: `${pct}%`,
                  background: pct === 100 ? MT.success : MT.accent,
                  borderRadius: '2px',
                  transition: 'width 0.5s ease',
                }} />
              </div>

              {/* Lesson list */}
              <div className="space-y-0.5 mb-4">
                {topicLessons.map((lesson) => {
                  const done = progress.completedLessons.includes(lesson.id)
                  return (
                    <Link
                      key={lesson.id}
                      href={`/lesson/${lesson.id}`}
                      className="flex items-center gap-3 rounded px-2 py-1.5 transition-colors"
                      style={{ color: done ? MT.success : MT.sub }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <span className="w-4 text-center text-sm flex-shrink-0">
                        {done ? '✓' : '○'}
                      </span>
                      <span className="mono text-xs w-10 flex-shrink-0" style={{ color: MT.accent }}>{lesson.id}</span>
                      <span className="text-xs flex-1" style={{ color: done ? MT.text : MT.sub }}>{lesson.title}</span>
                      <span className="text-xs mono" style={{ color: '#404244' }}>w:{lesson.weight}</span>
                    </Link>
                  )
                })}
              </div>

              {/* Quiz score */}
              <div className="flex items-center justify-between pt-3" style={{ borderTop: `1px solid ${MT.border}` }}>
                <span className="text-xs" style={{ color: MT.sub }}>
                  quiz điểm cao nhất:{' '}
                  {quizScore !== undefined ? (
                    <span className="font-bold ml-1" style={{ color: quizScore >= 65 ? MT.success : MT.error }}>
                      {quizScore}%
                    </span>
                  ) : (
                    <span className="ml-1" style={{ color: '#404244' }}>chưa làm</span>
                  )}
                </span>
                <Link href={`/quiz/${topic.id}`} className="text-xs font-medium transition-colors" style={{ color: MT.accent }}>
                  làm quiz →
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      {/* Exam history */}
      {progress.examScores.length > 0 && (
        <div style={card}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm" style={{ color: MT.text }}>lịch sử thi thử</h3>
            <span className="text-xs" style={{ color: MT.sub }}>{progress.examScores.length} lần thi</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {progress.examScores.map((score, i) => (
              <span
                key={i}
                className="text-sm font-bold mono px-3 py-1 rounded-full"
                style={{
                  background: score >= 65 ? 'rgba(76,175,116,0.15)' : 'rgba(202,71,84,0.15)',
                  color: score >= 65 ? MT.success : MT.error,
                }}
              >
                #{i + 1}: {score}%
              </span>
            ))}
          </div>
          <p className="text-xs" style={{ color: MT.sub }}>
            điểm cao nhất:{' '}
            <span className="font-bold" style={{ color: MT.text }}>{Math.max(...progress.examScores)}%</span>
            {' · '}trung bình:{' '}
            <span className="font-bold" style={{ color: MT.text }}>
              {Math.round(progress.examScores.reduce((a, b) => a + b, 0) / progress.examScores.length)}%
            </span>
          </p>
        </div>
      )}
    </div>
  )
}
