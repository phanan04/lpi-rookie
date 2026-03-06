'use client'
import { useState } from 'react'
import type { InlineCQ } from '@/lib/types'

interface InlineQuizProps {
  title?: string
  questions: InlineCQ[]
}

export default function InlineQuiz({ title, questions }: InlineQuizProps) {
  const [selected, setSelected] = useState<(number | null)[]>(() => questions.map(() => null))
  const [revealed, setRevealed] = useState<boolean[]>(() => questions.map(() => false))

  const reset = () => {
    setSelected(questions.map(() => null))
    setRevealed(questions.map(() => false))
  }

  const pick = (qi: number, oi: number) => {
    if (revealed[qi]) return
    setSelected(prev => { const n = [...prev]; n[qi] = oi; return n })
    setRevealed(prev => { const n = [...prev]; n[qi] = true; return n })
  }

  const answeredCount = revealed.filter(Boolean).length
  const correctCount = questions.filter((q, i) => revealed[i] && selected[i] === q.correct).length

  return (
    <div
      className="my-4 rounded-lg overflow-hidden"
      style={{ border: '1px solid rgba(80,200,208,0.2)' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{ background: 'rgba(80,200,208,0.07)' }}
      >
        <div className="flex items-center gap-2">
          <span style={{ color: '#50c8d0', fontSize: '0.75rem' }}>🧠</span>
          <span
            className="text-xs font-semibold uppercase tracking-wide"
            style={{ color: '#50c8d0', fontFamily: 'Lexend Deca, sans-serif' }}
          >
            {title ?? 'Kiểm tra kiến thức'}
          </span>
          {answeredCount > 0 && (
            <span
              className="text-xs ml-1"
              style={{
                color: correctCount === answeredCount ? '#4caf74' : '#646669',
                fontFamily: 'JetBrains Mono, monospace',
              }}
            >
              {correctCount}/{answeredCount}
            </span>
          )}
        </div>
        {answeredCount > 0 && (
          <button
            onClick={reset}
            className="text-xs px-2 py-0.5 rounded transition-colors"
            style={{
              color: '#646669',
              border: '1px solid rgba(255,255,255,0.08)',
              fontFamily: 'Lexend Deca, sans-serif',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#d1d0c5')}
            onMouseLeave={e => (e.currentTarget.style.color = '#646669')}
          >
            ↺ Reset
          </button>
        )}
      </div>

      {/* Questions */}
      <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
        {questions.map((q, qi) => {
          const sel = selected[qi]
          const rev = revealed[qi]
          const isCorrect = sel === q.correct

          return (
            <div key={qi} className="px-4 py-4" style={{ background: '#1a1b1e' }}>
              {/* Question text */}
              <div
                className="text-sm mb-3 font-medium leading-relaxed"
                style={{ color: '#d1d0c5', fontFamily: 'Lexend Deca, sans-serif' }}
              >
                <span
                  className="text-xs mr-2 px-1.5 py-0.5 rounded"
                  style={{
                    background: 'rgba(80,200,208,0.1)',
                    color: '#50c8d0',
                    fontFamily: 'JetBrains Mono, monospace',
                  }}
                >
                  Q{qi + 1}
                </span>
                {q.q}
              </div>

              {/* Options */}
              <div className="space-y-2">
                {q.options.map((opt, oi) => {
                  let bg = 'rgba(255,255,255,0.03)'
                  let border = '1px solid rgba(255,255,255,0.07)'
                  let color = '#646669'
                  let prefix = ''

                  if (rev) {
                    if (oi === q.correct) {
                      bg = 'rgba(76,175,116,0.1)'
                      border = '1px solid rgba(76,175,116,0.4)'
                      color = '#4caf74'
                      prefix = '✓ '
                    } else if (oi === sel) {
                      bg = 'rgba(202,71,84,0.1)'
                      border = '1px solid rgba(202,71,84,0.35)'
                      color = '#ca4754'
                      prefix = '✗ '
                    }
                  } else {
                    // hoverable
                  }

                  return (
                    <button
                      key={oi}
                      onClick={() => pick(qi, oi)}
                      disabled={rev}
                      className="w-full text-left text-xs rounded-lg px-3 py-2.5 transition-all"
                      style={{
                        background: bg,
                        border,
                        color,
                        fontFamily: 'Lexend Deca, sans-serif',
                        cursor: rev ? 'default' : 'pointer',
                        lineHeight: 1.5,
                      }}
                      onMouseEnter={e => {
                        if (!rev) {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                          e.currentTarget.style.color = '#d1d0c5'
                          e.currentTarget.style.border = '1px solid rgba(255,255,255,0.15)'
                        }
                      }}
                      onMouseLeave={e => {
                        if (!rev) {
                          e.currentTarget.style.background = bg
                          e.currentTarget.style.color = color
                          e.currentTarget.style.border = border
                        }
                      }}
                    >
                      <span
                        className="mr-2 font-mono"
                        style={{ color: rev && oi === q.correct ? '#4caf74' : '#646669', fontSize: '0.7rem' }}
                      >
                        {String.fromCharCode(65 + oi)}.
                      </span>
                      {prefix}{opt}
                    </button>
                  )
                })}
              </div>

              {/* Explanation */}
              {rev && (
                <div
                  className="mt-3 text-xs leading-relaxed rounded-lg px-3 py-2.5"
                  style={{
                    background: isCorrect ? 'rgba(76,175,116,0.06)' : 'rgba(202,71,84,0.06)',
                    border: isCorrect ? '1px solid rgba(76,175,116,0.15)' : '1px solid rgba(202,71,84,0.15)',
                    color: '#646669',
                    fontFamily: 'Lexend Deca, sans-serif',
                  }}
                >
                  <span style={{ color: isCorrect ? '#4caf74' : '#ca4754', fontWeight: 600 }}>
                    {isCorrect ? '✓ Chính xác! ' : '✗ Chưa đúng. '}
                  </span>
                  {q.explanation}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Summary bar — shown when all answered */}
      {answeredCount === questions.length && questions.length > 1 && (
        <div
          className="px-4 py-2.5 flex items-center justify-between"
          style={{ background: correctCount === questions.length ? 'rgba(76,175,116,0.07)' : 'rgba(226,183,20,0.07)' }}
        >
          <span
            className="text-xs font-semibold"
            style={{
              color: correctCount === questions.length ? '#4caf74' : '#e2b714',
              fontFamily: 'Lexend Deca, sans-serif',
            }}
          >
            {correctCount === questions.length
              ? `🎉 Hoàn hảo! ${correctCount}/${questions.length} đúng`
              : `${correctCount}/${questions.length} đúng — ôn lại phần trên nhé!`}
          </span>
          <button
            onClick={reset}
            className="text-xs px-2.5 py-1 rounded font-semibold transition-colors"
            style={{
              color: '#323437',
              background: correctCount === questions.length ? '#4caf74' : '#e2b714',
              fontFamily: 'Lexend Deca, sans-serif',
            }}
          >
            làm lại
          </button>
        </div>
      )}
    </div>
  )
}
