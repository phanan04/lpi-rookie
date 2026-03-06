'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getTopicById } from '@/lib/curriculum'
import { getQuizByTopic } from '@/lib/quizzes'
import FlashcardEngine from '@/components/FlashcardEngine'

export default function FlashcardTopicPage() {
  const params = useParams()
  const topicId = Array.isArray(params.topic) ? params.topic[0] : params.topic ?? ''

  const topicData = getTopicById(topicId)
  const questions = getQuizByTopic(topicId)

  if (!topicData) {
    return (
      <div className="text-center py-20">
        <p className="text-lg mb-4" style={{ color: '#646669' }}>Chủ đề không tồn tại.</p>
        <Link href="/flashcard" style={{ color: '#e2b714' }}>← Quay lại</Link>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-lg mb-4" style={{ color: '#646669' }}>Chưa có câu hỏi cho chủ đề này.</p>
        <Link href="/flashcard" style={{ color: '#e2b714' }}>← Quay lại</Link>
      </div>
    )
  }

  return (
    <FlashcardEngine
      questions={questions}
      title={`Flashcard — Topic ${topicId}: ${topicData.title}`}
    />
  )
}
