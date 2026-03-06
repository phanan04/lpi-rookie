'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getLessonById, getAdjacentLessons, getTopicById } from '@/lib/curriculum'
import { loadProgress, markLessonComplete, markLessonIncomplete } from '@/lib/progress'
import { quizQuestions } from '@/lib/quizzes'
import LessonRenderer from '@/components/LessonRenderer'
import QuizEngine from '@/components/QuizEngine'

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const id = Array.isArray(params.id) ? params.id[0] : params.id
  const lesson = getLessonById(id || '')
  const { prev, next } = lesson ? getAdjacentLessons(lesson.id) : { prev: null, next: null }
  const topic = lesson ? getTopicById(lesson.topicId) : null
  const lessonQuestions = lesson ? quizQuestions.filter(q => q.lessonId === lesson.id) : []

  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    if (!lesson) return
    const progress = loadProgress()
    setCompleted(progress.completedLessons.includes(lesson.id))
    const raw = localStorage.getItem('lpi-progress')
    const p = raw ? JSON.parse(raw) : {}
    p.lastVisited = lesson.id
    localStorage.setItem('lpi-progress', JSON.stringify(p))
  }, [lesson])

  if (!lesson) {
    return (
      <div className="text-center py-20">
        <p className="text-lg mb-4" style={{ color: '#646669' }}>Bài học không tồn tại.</p>
        <Link href="/" style={{ color: '#e2b714' }}>← Về trang chủ</Link>
      </div>
    )
  }

  const toggleComplete = () => {
    if (completed) {
      markLessonIncomplete(lesson.id)
      setCompleted(false)
    } else {
      markLessonComplete(lesson.id)
      setCompleted(true)
    }
  }

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs flex-wrap" style={{ color: '#646669' }}>
        <Link href="/" style={{ color: '#646669' }} className="hover:text-white transition-colors">
          trang chủ
        </Link>
        <span style={{ color: '#404244' }}>/</span>
        {topic && (
          <>
            <Link
              href={`/lesson/${topic.lessons[0].id}`}
              style={{ color: '#646669' }}
              className="hover:text-white transition-colors"
            >
              Topic {topic.id}: {topic.title}
            </Link>
            <span style={{ color: '#404244' }}>/</span>
          </>
        )}
        <span style={{ color: '#d1d0c5', fontWeight: 500 }}>
          {lesson.id} {lesson.title}
        </span>
      </nav>

      {/* Lesson header card */}
      <div
        style={{
          background: '#2c2e31',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.05)',
          padding: '24px',
        }}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="mono text-xs px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(226,183,20,0.1)', color: '#e2b714' }}
              >
                {lesson.id}
              </span>
              <span className="text-xs" style={{ color: '#646669' }}>
                Weight: {lesson.weight}
              </span>
            </div>
            <h1
              className="text-2xl font-bold mb-1"
              style={{ color: '#d1d0c5', fontFamily: 'Lexend Deca, sans-serif', letterSpacing: '-0.01em' }}
            >
              {lesson.title}
            </h1>
            <p className="text-sm max-w-2xl" style={{ color: '#646669', lineHeight: '1.7' }}>
              {lesson.description}
            </p>
          </div>
          <button
            onClick={toggleComplete}
            className="shrink-0 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
            style={
              completed
                ? { background: 'rgba(76,175,116,0.15)', color: '#4caf74', border: '1px solid rgba(76,175,116,0.3)' }
                : { background: 'rgba(255,255,255,0.04)', color: '#646669', border: '1px solid rgba(255,255,255,0.08)' }
            }
          >
            {completed ? '✓ đã học xong' : '◯ đánh dấu hoàn thành'}
          </button>
        </div>
      </div>

      {/* Lesson content card */}
      <div
        style={{
          background: '#2c2e31',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.05)',
          padding: '28px',
        }}
      >
        <LessonRenderer sections={lesson.sections} />
      </div>

      {/* Lesson Quiz */}
      {lessonQuestions.length > 0 && (
        <div
          style={{
            background: '#2c2e31',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <QuizEngine
            questions={lessonQuestions}
            title={`Quiz · ${lesson.id} — ${lesson.title}`}
            topicId={lesson.topicId}
          />
        </div>
      )}

      {/* Prev / Next navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {prev ? (
          <Link
            href={`/lesson/${prev.id}`}
            className="rounded-xl p-4 transition-all"
            style={{
              background: '#2c2e31',
              border: '1px solid rgba(255,255,255,0.05)',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = 'rgba(226,183,20,0.3)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)')
            }
          >
            <p className="text-xs mb-1" style={{ color: '#646669' }}>← bài trước</p>
            <p className="font-semibold text-sm" style={{ color: '#d1d0c5' }}>
              {prev.id} — {prev.title}
            </p>
          </Link>
        ) : <div />}
        {next ? (
          <Link
            href={`/lesson/${next.id}`}
            className="rounded-xl p-4 transition-all sm:text-right"
            style={{
              background: '#2c2e31',
              border: '1px solid rgba(255,255,255,0.05)',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = 'rgba(226,183,20,0.3)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)')
            }
          >
            <p className="text-xs mb-1" style={{ color: '#646669' }}>bài tiếp theo →</p>
            <p className="font-semibold text-sm" style={{ color: '#d1d0c5' }}>
              {next.id} — {next.title}
            </p>
          </Link>
        ) : <div />}
      </div>
    </div>
  )
}
