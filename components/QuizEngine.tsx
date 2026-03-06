'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { FileText, Trophy, XCircle, BookOpen, RotateCcw, Home as HomeIcon, CheckCircle, Check, X, ChevronLeft, ChevronRight, ClipboardList, Target } from 'lucide-react'
import type { QuizQuestion } from '@/lib/types'
import { saveQuizScore, saveExamScore } from '@/lib/progress'

interface QuizEngineProps {
  questions: QuizQuestion[]
  title: string
  topicId: string
  isExam?: boolean
  onComplete?: (score: number, total: number) => void
}

type Phase = 'intro' | 'quiz' | 'result'

const C = {
  bg: '#2c2e31',
  text: '#d1d0c5',
  sub: '#646669',
  accent: '#e2b714',
  success: '#4caf74',
  error: '#ca4754',
  border: 'rgba(255,255,255,0.05)',
  hover: 'rgba(255,255,255,0.03)',
}

const card = {
  background: C.bg,
  borderRadius: '12px',
  border: `1px solid ${C.border}`,
}

export default function QuizEngine({
  questions,
  title,
  topicId,
  isExam = false,
  onComplete,
}: QuizEngineProps) {
  const [phase, setPhase] = useState<Phase>('intro')
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null))
  const [revealed, setRevealed] = useState<boolean[]>(new Array(questions.length).fill(false))

  const q = questions[current]
  const totalQ = questions.length
  const selectedAnswer = answers[current]
  const isRevealed = revealed[current]

  const startQuiz = () => {
    setPhase('quiz')
    setCurrent(0)
    setAnswers(new Array(questions.length).fill(null))
    setRevealed(new Array(questions.length).fill(false))
  }

  const handleSelect = (optIdx: number) => {
    if (isRevealed) return
    setAnswers((prev) => {
      const next = [...prev]
      next[current] = optIdx
      return next
    })
  }

  const handleReveal = () => {
    if (selectedAnswer === null) return
    setRevealed((prev) => {
      const next = [...prev]
      next[current] = true
      return next
    })
  }

  const handleNext = () => {
    if (current < totalQ - 1) {
      setCurrent(current + 1)
    } else {
      finishQuiz()
    }
  }

  const handlePrev = () => {
    if (current > 0) setCurrent(current - 1)
  }

  const finishQuiz = useCallback(() => {
    const score = answers.filter((a, i) => a === questions[i].correct).length
    const pct = Math.round((score / totalQ) * 100)
    if (isExam) {
      saveExamScore(pct)
    } else {
      saveQuizScore(topicId, pct)
    }
    window.dispatchEvent(new Event('lpi-progress-update'))
    setPhase('result')
    onComplete?.(score, totalQ)
  }, [answers, questions, totalQ, topicId, isExam, onComplete])

  const finalScore = answers.filter((a, i) => a === questions[i].correct).length
  const finalPct = Math.round((finalScore / totalQ) * 100)
  const passed = finalPct >= 65

  // ── INTRO ──
  if (phase === 'intro') {
    return (
      <div className="max-w-xl mx-auto text-center py-12">
        <div className="flex justify-center mb-6">
          <FileText size={48} style={{ color: C.accent }} />
        </div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: C.text, fontFamily: 'Lexend Deca, sans-serif' }}>{title}</h2>
        <p className="text-sm mb-1" style={{ color: C.sub }}>{totalQ} câu hỏi · chọn đáp án đúng</p>
        <p className="text-sm mb-8" style={{ color: C.sub }}>
          điểm đạt:{' '}
          <span className="font-semibold" style={{ color: C.success }}>65%</span>
        </p>

        <div style={{ ...card, padding: '20px 24px', textAlign: 'left', marginBottom: '28px' }}>
          <h4 className="flex items-center gap-1.5 font-semibold text-sm mb-3" style={{ color: C.text }}><ClipboardList size={14} /> quy tắc</h4>
          <ul className="space-y-2 text-sm" style={{ color: C.sub }}>
            <li>• mỗi câu có 4 đáp án, chỉ 1 đáp án đúng</li>
            <li>• chọn đáp án rồi nhấn &ldquo;kiểm tra&rdquo; để xem giải thích</li>
            <li>• có thể xem lại các câu trước</li>
            <li>• điểm cao nhất sẽ được lưu</li>
          </ul>
        </div>

        <button
          onClick={startQuiz}
          className="font-semibold px-10 py-3 rounded-xl transition-colors"
          style={{ background: C.accent, color: '#323437', fontWeight: 700 }}
        >
          bắt đầu →
        </button>
      </div>
    )
  }

  // ── RESULT ──
  if (phase === 'result') {
    return (
      <div className="max-w-lg mx-auto text-center py-8">
        <div className="text-7xl font-black mb-2 mono" style={{ color: passed ? C.success : C.error }}>
          {finalPct}%
        </div>
        <div className="text-sm mb-3" style={{ color: C.sub }}>{finalScore}/{totalQ} câu đúng</div>
        <div
          className="inline-block px-5 py-1.5 rounded-full font-bold text-sm mb-8"
          style={{
            background: passed ? 'rgba(76,175,116,0.15)' : 'rgba(202,71,84,0.15)',
            color: passed ? C.success : C.error,
          }}
        >
          {passed
            ? <><Trophy size={14} className="inline mr-1" />ĐẠT — PASS</>
            : <><XCircle size={14} className="inline mr-1" />CHƯA ĐẠT — FAIL</>}
        </div>

        {/* Score breakdown */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'đúng', value: finalScore, color: C.success },
            { label: 'sai', value: totalQ - finalScore, color: C.error },
            { label: 'điểm', value: `${finalPct}%`, color: passed ? C.success : C.error },
          ].map((s) => (
            <div key={s.label} style={{ ...card, padding: '16px' }}>
              <div className="text-2xl font-bold mono" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs mt-1" style={{ color: C.sub }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Wrong answers review */}
        {answers.some((a, i) => a !== questions[i].correct) && (
          <div style={{ ...card, padding: '20px 24px', textAlign: 'left', marginBottom: '28px' }}>
            <h4 className="flex items-center gap-1.5 font-semibold text-sm mb-3" style={{ color: C.text }}><BookOpen size={14} /> câu trả lời sai</h4>
            <div className="space-y-4">
              {questions.map((q, i) => {
                if (answers[i] === q.correct) return null
                return (
                  <div key={q.id} className="text-sm pb-3" style={{ borderBottom: `1px solid ${C.border}` }}>
                    <div className="font-medium mb-1" style={{ color: C.text }}>{i + 1}. {q.question}</div>
                    {answers[i] !== null && (
                      <div className="flex items-center gap-1 text-xs" style={{ color: C.error }}><X size={11} />bạn chọn: {q.options[answers[i]!]}</div>
                    )}
                    <div className="flex items-center gap-1 text-xs" style={{ color: C.success }}><Check size={11} />đúng: {q.options[q.correct]}</div>
                    <div className="text-xs mt-1 italic" style={{ color: C.sub }}>{q.explanation}</div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="flex justify-center gap-3 flex-wrap">
          <button
            onClick={startQuiz}
            className="flex items-center gap-2 font-semibold px-6 py-2.5 rounded-xl transition-colors"
            style={{ background: C.accent, color: '#323437', fontWeight: 700 }}
          >
            <RotateCcw size={14} /> làm lại
          </button>
          {!isExam && (
            <Link
              href="/"
              className="flex items-center gap-2 font-semibold px-6 py-2.5 rounded-xl transition-colors"
              style={{ background: 'rgba(255,255,255,0.06)', color: C.text, border: `1px solid ${C.border}` }}
            >
              <HomeIcon size={14} /> dashboard
            </Link>
          )}
        </div>
      </div>
    )
  }

  // ── QUIZ ──
  const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F']
  const progressPct = ((current + 1) / totalQ) * 100

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress header */}
      <div style={{ ...card, padding: '18px 20px', marginBottom: '16px' }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm" style={{ color: C.text }}>{title}</h3>
          <span className="text-xs mono" style={{ color: C.sub }}>{current + 1} / {totalQ}</span>
        </div>
        <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
          <div
            style={{ height: '100%', width: `${progressPct}%`, background: C.accent, borderRadius: '2px', transition: 'width 0.3s ease' }}
          />
        </div>
      </div>

      {/* Question card */}
      <div style={{ ...card, padding: '24px', marginBottom: '12px' }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs mono" style={{ color: C.accent }}>câu {current + 1}</span>
          {q.difficulty && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: q.difficulty === 'easy'
                  ? 'rgba(76,175,116,0.15)'
                  : q.difficulty === 'medium'
                  ? 'rgba(226,183,20,0.15)'
                  : 'rgba(202,71,84,0.15)',
                color: q.difficulty === 'easy' ? C.success : q.difficulty === 'medium' ? C.accent : C.error,
              }}
            >
              {q.difficulty === 'easy' ? 'dễ' : q.difficulty === 'medium' ? 'trung bình' : 'khó'}
            </span>
          )}
        </div>

        <p className="text-base font-semibold mb-5 leading-relaxed" style={{ color: C.text }}>
          {q.question}
        </p>

        {/* Options */}
        <div className="space-y-2.5">
          {q.options.map((opt, idx) => {
            let borderColor = C.border
            let bgColor = 'transparent'
            let textColor = C.sub
            let letterBg = 'rgba(255,255,255,0.06)'
            let letterColor = C.sub

            if (isRevealed) {
              if (idx === q.correct) {
                borderColor = C.success
                bgColor = 'rgba(76,175,116,0.08)'
                textColor = C.text
                letterBg = C.success
                letterColor = '#1e2022'
              } else if (idx === selectedAnswer && idx !== q.correct) {
                borderColor = C.error
                bgColor = 'rgba(202,71,84,0.08)'
                textColor = C.text
                letterBg = C.error
                letterColor = '#fff'
              } else {
                borderColor = 'rgba(255,255,255,0.03)'
                textColor = '#404244'
                letterColor = '#404244'
              }
            } else if (idx === selectedAnswer) {
              borderColor = C.accent
              bgColor = 'rgba(226,183,20,0.06)'
              textColor = C.text
              letterBg = C.accent
              letterColor = '#323437'
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={isRevealed}
                className="w-full flex items-start gap-3 p-3.5 rounded-lg text-left transition-all disabled:cursor-default"
                style={{
                  border: `1.5px solid ${borderColor}`,
                  background: bgColor,
                }}
              >
                <span
                  className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5"
                  style={{ background: letterBg, color: letterColor, transition: 'all 0.15s' }}
                >
                  {optionLetters[idx]}
                </span>
                <span className="text-sm leading-relaxed flex-1" style={{ color: textColor }}>{opt}</span>
                {isRevealed && idx === q.correct && (
                  <Check size={14} className="ml-auto flex-shrink-0" style={{ color: C.success }} />
                )}
                {isRevealed && idx === selectedAnswer && idx !== q.correct && (
                  <X size={14} className="ml-auto flex-shrink-0" style={{ color: C.error }} />
                )}
              </button>
            )
          })}
        </div>

        {/* Explanation */}
        {isRevealed && (
          <div
            className="mt-4 p-4 rounded-lg text-sm leading-relaxed"
            style={{
              background: selectedAnswer === q.correct ? 'rgba(76,175,116,0.08)' : 'rgba(202,71,84,0.08)',
              border: `1px solid ${selectedAnswer === q.correct ? 'rgba(76,175,116,0.2)' : 'rgba(202,71,84,0.2)'}`,
              color: C.sub,
            }}
          >
            <strong className="flex items-center gap-1.5 mb-1" style={{ color: selectedAnswer === q.correct ? C.success : C.error }}>
              {selectedAnswer === q.correct ? <CheckCircle size={14} /> : <XCircle size={14} />}
              {selectedAnswer === q.correct ? 'chính xác!' : 'chưa đúng.'}
            </strong>
            {q.explanation}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={handlePrev}
          disabled={current === 0}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ border: `1px solid ${C.border}`, color: C.sub, background: 'transparent' }}
        >
          <ChevronLeft size={15} /> câu trước
        </button>

        <div className="flex gap-2">
          {!isRevealed ? (
            <button
              onClick={handleReveal}
              disabled={selectedAnswer === null}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ background: selectedAnswer === null ? 'rgba(255,255,255,0.04)' : C.accent, color: selectedAnswer === null ? C.sub : '#323437', fontWeight: 700 }}
            >
              kiểm tra
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors"
              style={{ background: C.accent, color: '#323437', fontWeight: 700 }}
            >
              {current === totalQ - 1
                ? <><Target size={14} /><span>xem kết quả</span></>
                : <><span>câu tiếp</span><ChevronRight size={14} /></>}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
