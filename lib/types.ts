// ============================================================
// LMS LPI 101-500 — TypeScript Types
// ============================================================
import type { LucideIcon } from 'lucide-react'

export type SectionType =
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'code'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'olist'; items: string[] }
  | { type: 'tip'; title: string; body: string }
  | { type: 'warning'; title: string; body: string }
  | { type: 'info'; title: string; body: string }
  | { type: 'exam'; title: string; body: string }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'files'; files: string[] }
  | { type: 'practice'; title?: string; hint?: string }

export interface Lesson {
  id: string          // e.g. "101.1"
  topicId: string     // e.g. "101"
  title: string
  weight: number
  description: string
  sections: SectionType[]
}

export interface Topic {
  id: string          // e.g. "101"
  title: string
  icon: LucideIcon
  description: string
  lessons: Lesson[]
}

export interface QuizQuestion {
  id: string
  topicId: string
  lessonId?: string
  question: string
  options: string[]
  correct: number     // index 0-based
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface ProgressState {
  completedLessons: string[]    // lesson IDs
  quizScores: Record<string, number>   // topicId -> best %
  examScores: number[]
  lastVisited?: string
}

export interface QuizResult {
  topicId: string
  score: number
  total: number
  answers: number[]
  timestamp: number
}
