'use client'

import Link from 'next/link'
import { Layers } from 'lucide-react'
import { topics } from '@/lib/curriculum'
import { getQuizByTopic } from '@/lib/quizzes'

const C = {
  bg: '#2c2e31',
  text: '#d1d0c5',
  sub: '#646669',
  accent: '#e2b714',
  border: 'rgba(255,255,255,0.05)',
}

export default function FlashcardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div style={{ background: C.bg, borderRadius: '16px', padding: '28px 32px', border: `1px solid ${C.border}` }}>
        <div className="flex items-center gap-3 mb-3">
          <Layers size={24} style={{ color: C.accent }} />
          <h1 className="text-2xl font-bold" style={{ color: C.text, fontFamily: 'Lexend Deca, sans-serif' }}>
            Flashcard
          </h1>
        </div>
        <p className="text-sm" style={{ color: C.sub, lineHeight: '1.7' }}>
          Ôn luyện nhanh theo chủ đề. Click vào card để xem đáp án,
          đánh giá bản thân để theo dõi những gì bạn cần ôn thêm.
        </p>
      </div>

      {/* Topic grid */}
      <div>
        <h2 className="text-xs uppercase tracking-widest mb-4 font-semibold" style={{ color: C.sub }}>
          chọn chủ đề
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {topics.map(topic => {
            const count = getQuizByTopic(topic.id).length
            const Icon = topic.icon
            return (
              <Link
                key={topic.id}
                href={count > 0 ? `/flashcard/${topic.id}` : '#'}
                className="block transition-all"
                style={{ opacity: count === 0 ? 0.45 : 1, pointerEvents: count === 0 ? 'none' : 'auto' }}
              >
                <div
                  className="rounded-xl p-5 transition-colors"
                  style={{ background: C.bg, border: `1px solid ${C.border}` }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(226,183,20,0.2)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Icon size={20} style={{ color: C.accent }} />
                      <div>
                        <p className="text-xs mono mb-0.5" style={{ color: C.sub }}>topic {topic.id}</p>
                        <h3 className="font-semibold text-sm" style={{ color: C.text }}>{topic.title}</h3>
                      </div>
                    </div>
                    <span
                      className="text-xs mono px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ background: 'rgba(226,183,20,0.1)', color: C.accent }}
                    >
                      {count} thẻ
                    </span>
                  </div>
                  {count === 0 && (
                    <p className="text-xs" style={{ color: C.sub }}>chưa có câu hỏi</p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
