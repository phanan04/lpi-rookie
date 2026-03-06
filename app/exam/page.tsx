'use client'

import { getAllQuestions } from '@/lib/quizzes'
import QuizEngine from '@/components/QuizEngine'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { loadProgress } from '@/lib/progress'
import { Trophy, TrendingUp, AlertTriangle, PlayCircle } from 'lucide-react'

const C = {
  bg: '#2c2e31',
  text: '#d1d0c5',
  sub: '#646669',
  accent: '#e2b714',
  success: '#4caf74',
  error: '#ca4754',
  border: 'rgba(255,255,255,0.05)',
}

const card = { background: C.bg, borderRadius: '12px', border: `1px solid ${C.border}` }

export default function ExamPage() {
  const [started, setStarted] = useState(false)
  const [bestScore, setBestScore] = useState<number | null>(null)
  const [attempts, setAttempts] = useState(0)

  useEffect(() => {
    const p = loadProgress()
    if (p.examScores.length > 0) {
      setBestScore(Math.max(...p.examScores))
      setAttempts(p.examScores.length)
    }
    const handler = () => {
      const p2 = loadProgress()
      if (p2.examScores.length > 0) {
        setBestScore(Math.max(...p2.examScores))
        setAttempts(p2.examScores.length)
      }
    }
    window.addEventListener('lpi-progress-update', handler)
    return () => window.removeEventListener('lpi-progress-update', handler)
  }, [])

  const questions = getAllQuestions()

  if (started) {
    return (
      <QuizEngine
        questions={questions}
        title="thi thử lpi 101-500"
        topicId="all"
        isExam={true}
        onComplete={() => setStarted(false)}
      />
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div>
        <nav className="flex items-center gap-2 text-xs mb-4" style={{ color: C.sub }}>
          <Link href="/" style={{ color: C.sub }} className="hover:text-white transition-colors">trang chủ</Link>
          <span style={{ color: '#404244' }}>/</span>
          <span style={{ color: C.text, fontWeight: 500 }}>thi thử</span>
        </nav>
        <h1 className="text-2xl font-bold mb-1" style={{ color: C.text, fontFamily: 'Lexend Deca, sans-serif', letterSpacing: '-0.01em' }}>
          thi thử lpi 101-500
        </h1>
        <p className="text-sm" style={{ color: C.sub }}>kiểm tra đầy đủ toàn bộ chương trình học LPIC-1</p>
      </div>

      {/* Exam info */}
      <div style={{ ...card, padding: '20px 24px' }} className="space-y-4">
        <h2 className="font-semibold text-sm" style={{ color: C.sub, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          thông tin bài thi
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'số câu hỏi', value: `${questions.length} câu` },
            { label: 'điểm đậu', value: '65%' },
            { label: 'phạm vi', value: 'topic 101–104' },
            { label: 'lần thi', value: `${attempts} lần` },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-lg p-3"
              style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}` }}
            >
              <p className="text-xs mb-0.5" style={{ color: C.sub }}>{item.label}</p>
              <p className="font-bold mono" style={{ color: C.text }}>{item.value}</p>
            </div>
          ))}
        </div>

        {bestScore !== null && (
          <div
            className="rounded-lg p-3 flex items-center gap-3"
            style={{
              background: bestScore >= 65 ? 'rgba(76,175,116,0.08)' : 'rgba(226,183,20,0.08)',
              border: `1px solid ${bestScore >= 65 ? 'rgba(76,175,116,0.2)' : 'rgba(226,183,20,0.2)'}`,
            }}
          >
            <span className="flex-shrink-0">{bestScore >= 65 ? <Trophy size={24} style={{ color: C.success }} /> : <TrendingUp size={24} style={{ color: C.accent }} />}</span>
            <div>
              <p className="font-semibold text-sm" style={{ color: bestScore >= 65 ? C.success : C.accent }}>
                điểm cao nhất: {bestScore}%
              </p>
              <p className="text-xs" style={{ color: C.sub }}>
                {bestScore >= 65 ? 'bạn đã vượt điểm chuẩn.' : 'cần đạt ít nhất 65% để đậu.'}
              </p>
            </div>
          </div>
        )}

        <div
          className="rounded-lg p-4"
          style={{ background: 'rgba(226,183,20,0.06)', border: '1px solid rgba(226,183,20,0.15)' }}
        >
          <p className="flex items-center gap-1.5 text-sm font-medium mb-1" style={{ color: C.accent }}><AlertTriangle size={14} /> lưu ý</p>
          <p className="text-sm" style={{ color: C.sub }}>
            đây là bài thi thử. câu hỏi được rút ngẫu nhiên từ toàn bộ ngân hàng đề.
            kết quả sẽ được lưu vào lịch sử của bạn.
          </p>
        </div>

        <button
          onClick={() => setStarted(true)}
          className="flex items-center justify-center gap-2 w-full rounded-lg font-semibold py-3 px-6 text-base transition-colors"
          style={{ background: C.accent, color: '#323437', fontWeight: 700 }}
        >
          <PlayCircle size={18} /> bắt đầu thi
        </button>
      </div>
    </div>
  )
}
