'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { RotateCcw, CheckCircle, XCircle, BarChart2, ChevronRight } from 'lucide-react'
import type { QuizQuestion } from '@/lib/types'

const C = {
  bg: '#2c2e31',
  text: '#d1d0c5',
  sub: '#646669',
  accent: '#e2b714',
  success: '#4caf74',
  error: '#ca4754',
  border: 'rgba(255,255,255,0.06)',
}

interface FlashcardEngineProps {
  questions: QuizQuestion[]
  title: string
}

export default function FlashcardEngine({ questions, title }: FlashcardEngineProps) {
  const deck = useMemo(() => [...questions].sort(() => Math.random() - 0.5), [questions])
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [results, setResults] = useState<Record<string, 'know' | 'dontknow'>>({})
  const [done, setDone] = useState(false)

  const card = deck[index]
  const total = deck.length
  const knownCount = Object.values(results).filter(v => v === 'know').length
  const unknownCount = Object.values(results).filter(v => v === 'dontknow').length

  const handleAnswer = (knows: boolean) => {
    const next: Record<string, 'know' | 'dontknow'> = { ...results, [card.id]: knows ? 'know' : 'dontknow' }
    setResults(next)
    if (index < total - 1) {
      setIndex(index + 1)
      setFlipped(false)
    } else {
      setDone(true)
    }
  }

  const restart = () => {
    setIndex(0)
    setFlipped(false)
    setResults({})
    setDone(false)
  }

  if (done) {
    const pct = Math.round((knownCount / total) * 100)
    return (
      <div className="max-w-lg mx-auto space-y-5">
        <div
          style={{
            background: C.bg, borderRadius: '16px', border: `1px solid ${C.border}`,
            padding: '40px 32px', textAlign: 'center',
          }}
        >
          <BarChart2 size={32} style={{ color: C.accent, margin: '0 auto 16px' }} />
          <h2 className="text-xl font-bold mb-2" style={{ color: C.text }}>kết quả</h2>
          <p className="text-5xl font-bold mono mb-2" style={{ color: pct >= 70 ? C.success : C.accent }}>
            {pct}%
          </p>
          <p className="text-sm mb-2" style={{ color: C.sub }}>{knownCount}/{total} thẻ đã thuộc</p>
          <div className="flex justify-center gap-4 text-xs mb-8" style={{ color: C.sub }}>
            <span className="flex items-center gap-1">
              <CheckCircle size={12} style={{ color: C.success }} /> {knownCount} đã biết
            </span>
            <span className="flex items-center gap-1">
              <XCircle size={12} style={{ color: C.error }} /> {unknownCount} chưa biết
            </span>
          </div>
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={restart}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium"
              style={{ background: 'rgba(226,183,20,0.1)', border: '1px solid rgba(226,183,20,0.25)', color: C.accent }}
            >
              <RotateCcw size={14} />
              ôn lại
            </button>
            <Link
              href="/flashcard"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium"
              style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`, color: C.sub }}
            >
              ← chọn chủ đề khác
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium truncate" style={{ color: C.text }}>{title}</p>
        <p className="text-xs mono flex-shrink-0 ml-4" style={{ color: C.sub }}>{index + 1} / {total}</p>
      </div>

      {/* Progress bar */}
      <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${(index / total) * 100}%`,
            background: C.accent,
            borderRadius: '2px',
            transition: 'width 0.3s ease',
          }}
        />
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-xs" style={{ color: C.sub }}>
        <span className="flex items-center gap-1">
          <CheckCircle size={12} style={{ color: C.success }} /> {knownCount} đã biết
        </span>
        <span className="flex items-center gap-1">
          <XCircle size={12} style={{ color: C.error }} /> {unknownCount} chưa biết
        </span>
      </div>

      {/* Card */}
      <div
        onClick={() => !flipped && setFlipped(true)}
        style={{
          background: C.bg,
          borderRadius: '16px',
          border: `1px solid ${flipped ? 'rgba(226,183,20,0.2)' : C.border}`,
          padding: '36px 28px',
          minHeight: '220px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          cursor: flipped ? 'default' : 'pointer',
          transition: 'border-color 0.2s',
        }}
      >
        {!flipped ? (
          <>
            <p className="text-xs uppercase tracking-widest mb-4" style={{ color: C.sub }}>
              câu hỏi · bấm để xem đáp án
            </p>
            <p className="text-base font-medium leading-relaxed" style={{ color: C.text }}>
              {card.question}
            </p>
            <p className="text-xs mt-4" style={{ color: '#404244' }}>
              {card.options.length} lựa chọn · {card.difficulty}
            </p>
          </>
        ) : (
          <>
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: C.accent }}>đáp án</p>
            <p className="text-base font-semibold mb-4" style={{ color: C.success }}>
              {card.options[card.correct]}
            </p>
            <p className="text-sm leading-relaxed" style={{ color: C.sub }}>
              {card.explanation}
            </p>
          </>
        )}
      </div>

      {/* Action buttons */}
      {flipped ? (
        <div className="flex gap-3">
          <button
            onClick={() => handleAnswer(false)}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-colors"
            style={{
              background: 'rgba(202,71,84,0.1)',
              border: '1px solid rgba(202,71,84,0.25)',
              color: C.error,
            }}
          >
            <XCircle size={15} />
            chưa biết
          </button>
          <button
            onClick={() => handleAnswer(true)}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-colors"
            style={{
              background: 'rgba(76,175,116,0.1)',
              border: '1px solid rgba(76,175,116,0.25)',
              color: C.success,
            }}
          >
            <CheckCircle size={15} />
            đã biết
          </button>
        </div>
      ) : (
        <button
          onClick={() => setFlipped(true)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium"
          style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`, color: C.sub }}
        >
          <ChevronRight size={15} />
          xem đáp án
        </button>
      )}
    </div>
  )
}
