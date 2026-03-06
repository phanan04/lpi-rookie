'use client'

import type { ProgressState } from './types'

const STORAGE_KEY = 'lpi1-progress'

function getDefault(): ProgressState {
  return {
    completedLessons: [],
    quizScores: {},
    examScores: [],
    lastVisited: undefined,
  }
}

export function loadProgress(): ProgressState {
  if (typeof window === 'undefined') return getDefault()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return getDefault()
    return JSON.parse(raw) as ProgressState
  } catch {
    return getDefault()
  }
}

export function saveProgress(state: ProgressState): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // storage full or unavailable — silently ignore
  }
}

export function markLessonComplete(lessonId: string): ProgressState {
  const state = loadProgress()
  if (!state.completedLessons.includes(lessonId)) {
    state.completedLessons = [...state.completedLessons, lessonId]
  }
  saveProgress(state)
  return state
}

export function markLessonIncomplete(lessonId: string): ProgressState {
  const state = loadProgress()
  state.completedLessons = state.completedLessons.filter((id) => id !== lessonId)
  saveProgress(state)
  return state
}

export function saveQuizScore(topicId: string, pct: number): ProgressState {
  const state = loadProgress()
  const current = state.quizScores[topicId] ?? 0
  state.quizScores[topicId] = Math.max(current, pct)
  saveProgress(state)
  return state
}

export function saveExamScore(pct: number): ProgressState {
  const state = loadProgress()
  state.examScores = [...(state.examScores || []), pct].slice(-10) // keep last 10
  saveProgress(state)
  return state
}

export function resetProgress(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}
