'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getQuizByTopic, getAllQuestions } from '@/lib/quizzes'
import { getTopicById } from '@/lib/curriculum'
import QuizEngine from '@/components/QuizEngine'

export default function QuizPage() {
  const params = useParams()
  const topicId = Array.isArray(params.topic) ? params.topic[0] : params.topic

  const isAll = topicId === 'all'
  const topic = !isAll ? getTopicById(topicId || '') : null
  const questions = isAll ? getAllQuestions() : getQuizByTopic(topicId || '')

  if (!isAll && !topic) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500 dark:text-slate-400 text-lg mb-4">
          Chủ đề không tồn tại.
        </p>
        <Link href="/" className="text-blue-600 hover:underline">
          ← Về trang chủ
        </Link>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500 text-lg mb-4">Chưa có câu hỏi cho chủ đề này.</p>
        <Link href="/" className="text-blue-600 hover:underline">
          ← Về trang chủ
        </Link>
      </div>
    )
  }

  return (
    <QuizEngine
      questions={questions}
      title={isAll ? 'Luyện tập tổng hợp' : `Quiz — Topic ${topicId}: ${topic?.title}`}
      topicId={topicId || 'all'}
      isExam={false}
    />
  )
}
