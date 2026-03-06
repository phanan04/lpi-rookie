'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BarChart2, ClipboardCheck, Target } from 'lucide-react'
import { topics, getAllLessons } from '@/lib/curriculum'
import { loadProgress } from '@/lib/progress'
import type { ProgressState } from '@/lib/types'

export default function DashboardPage() {
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
  const lastVisitedLesson = progress.lastVisited
    ? allLessons.find((l) => l.id === progress.lastVisited)
    : null

  return (
    <div className="space-y-8">
      {/* ── Hero ── */}
      <div className="p-6 sm:p-8 md:p-10" style={{ background: '#2c2e31', borderRadius: '16px' }}>
        {/* Tag */}
        <div className="mb-3">
          <span className="badge-mt text-xs uppercase tracking-widest">
            Linux Professional Institute
          </span>
        </div>

        <h1
          className="text-2xl sm:text-3xl font-bold mb-2"
          style={{ color: '#d1d0c5', fontFamily: 'Lexend Deca, sans-serif', letterSpacing: '-0.02em' }}
        >
          LPI{' '}
          <span style={{ color: '#e2b714' }}>101-500</span>
          {' '}(LPIC-1)
        </h1>
        <p className="mb-8 max-w-xl text-sm" style={{ color: '#646669', lineHeight: '1.7' }}>
          khóa học đầy đủ theo chuẩn LPI: kiến trúc hệ thống, quản lý gói,
          lệnh GNU/Unix và hệ thống tệp & phân quyền.
        </p>

        {/* Stats row */}
        <div className="flex flex-wrap gap-6">
          <StatPill label="tổng bài học" value={String(totalLessons)} />
          <StatPill label="đã hoàn thành" value={String(completedCount)} accent />
          <StatPill label="tiến độ" value={`${overallPct}%`} accent />
          <StatPill label="bài thi thử" value={String(progress.examScores.length)} />
        </div>

        {/* Overall progress bar */}
        <div className="mt-6">
          <div className="progress-bar-mt" style={{ height: '4px' }}>
            <div className="progress-fill-mt" style={{ width: `${overallPct}%` }} />
          </div>
        </div>
      </div>

      {/* ── Resume banner ── */}
      {lastVisitedLesson && (
        <div
          style={{
            background: 'rgba(226,183,20,0.05)',
            border: '1px solid rgba(226,183,20,0.15)',
            borderRadius: '12px',
            padding: '16px 20px',
          }}
          className="flex items-center justify-between gap-4"
        >
          <div>
            <p className="text-xs uppercase tracking-widest mb-0.5" style={{ color: '#e2b714' }}>
              tiếp tục học
            </p>
            <p className="text-sm font-medium" style={{ color: '#d1d0c5' }}>
              {lastVisitedLesson.id} — {lastVisitedLesson.title}
            </p>
          </div>
          <Link
            href={`/lesson/${lastVisitedLesson.id}`}
            className="btn-mt btn-mt-primary shrink-0"
            style={{ fontSize: '0.8rem' }}
          >
            tiếp tục →
          </Link>
        </div>
      )}

      {/* ── Topic cards ── */}
      <div>
        <h2 className="text-sm uppercase tracking-widest mb-4" style={{ color: '#646669', fontWeight: 600 }}>
          các chủ đề
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {topics.map((topic) => {
            const topicLessons = topic.lessons
            const topicCompleted = topicLessons.filter((l) =>
              progress.completedLessons.includes(l.id),
            ).length
            const topicPct =
              topicLessons.length > 0
                ? Math.round((topicCompleted / topicLessons.length) * 100)
                : 0
            const quizScore = progress.quizScores[topic.id]

            return (
              <div
                key={topic.id}
                className="card-mt"
                style={{ padding: '22px 24px' }}
              >
                {/* Card header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <topic.icon size={24} className="flex-shrink-0" />
                    <div>
                      <p className="text-xs mono mb-0.5" style={{ color: '#646669' }}>
                        topic {topic.id}
                      </p>
                      <h3 className="font-semibold text-sm" style={{ color: '#d1d0c5' }}>
                        {topic.title}
                      </h3>
                    </div>
                  </div>
                  <span className="badge-mt neutral mono" style={{ fontSize: '0.7rem' }}>
                    {topicCompleted}/{topicLessons.length}
                  </span>
                </div>

                <p className="text-xs mb-4" style={{ color: '#646669', lineHeight: '1.6' }}>
                  {topic.description}
                </p>

                {/* Progress */}
                <div className="progress-bar-mt mb-4">
                  <div className="progress-fill-mt" style={{ width: `${topicPct}%` }} />
                </div>

                {/* Footer links */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-3">
                    <Link
                      href={`/lesson/${topicLessons[0].id}`}
                      className="text-xs font-medium transition-colors"
                      style={{ color: '#e2b714' }}
                    >
                      học bài →
                    </Link>
                    <span style={{ color: '#404244' }}>|</span>
                    <Link
                      href={`/quiz/${topic.id}`}
                      className="text-xs font-medium transition-colors"
                      style={{ color: '#646669' }}
                    >
                      làm quiz
                    </Link>
                  </div>
                  {quizScore !== undefined && (
                    <span
                      className={`badge-mt ${quizScore >= 65 ? 'success' : 'error'} mono`}
                      style={{ fontSize: '0.68rem' }}
                    >
                      {quizScore}%
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Quick links ── */}
      <div>
        <h2 className="text-sm uppercase tracking-widest mb-4" style={{ color: '#646669', fontWeight: 600 }}>
          truy cập nhanh
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <QuickLink
            href="/progress"
            icon={<BarChart2 size={20} style={{ color: '#e2b714' }} />}
            title="tiến độ học tập"
            desc="xem chi tiết từng chủ đề"
          />
          <QuickLink
            href="/exam"
            icon={<ClipboardCheck size={20} style={{ color: '#e2b714' }} />}
            title="thi thử toàn bộ"
            desc={
              progress.examScores.length > 0
                ? `${progress.examScores.length} lần thi · điểm cao: ${Math.max(...progress.examScores)}%`
                : '40 câu — thi như thật'
            }
          />
          <QuickLink
            href="/quiz/all"
            icon={<Target size={20} style={{ color: '#e2b714' }} />}
            title="luyện tập ngẫu nhiên"
            desc="câu hỏi từ toàn bộ đề cương"
          />
        </div>
      </div>
    </div>
  )
}

function StatPill({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <div className="text-2xl font-bold mono" style={{ color: accent ? '#e2b714' : '#d1d0c5' }}>
        {value}
      </div>
      <div className="text-xs mt-0.5" style={{ color: '#646669' }}>{label}</div>
    </div>
  )
}

function QuickLink({
  href,
  icon,
  title,
  desc,
}: {
  href: string
  icon: React.ReactNode
  title: string
  desc: string
}) {
  return (
    <Link
      href={href}
      className="card-mt flex items-start gap-3 p-4"
      style={{ display: 'flex' }}
    >
      <span className="mt-0.5 flex-shrink-0">{icon}</span>
      <div>
        <p className="text-sm font-medium mb-0.5" style={{ color: '#d1d0c5' }}>{title}</p>
        <p className="text-xs" style={{ color: '#646669', lineHeight: '1.5' }}>{desc}</p>
      </div>
    </Link>
  )
}
