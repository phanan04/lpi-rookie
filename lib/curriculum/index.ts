import type { Topic } from '../types'

import { topic101 } from './topic101'
import { topic102 } from './topic102'
import { topic103 } from './topic103'
import { topic104 } from './topic104'
import { topic105 } from './topic105'
import { topic106 } from './topic106'
import { topic107 } from './topic107'
import { topic108 } from './topic108'
import { topic109 } from './topic109'
import { topic110 } from './topic110'

// ============================================================
// LPI 101-500 and 102-500 Curriculum — based on LPI Learning Material
// ============================================================

export const topics: Topic[] = [
  topic101,
  topic102,
  topic103,
  topic104,
  topic105,
  topic106,
  topic107,
  topic108,
  topic109,
  topic110,
]

// Helper to get all lessons flat
export function getAllLessons() {
  return topics.flatMap((t) => t.lessons)
}

// Helper to find a lesson by ID
export function getLessonById(id: string) {
  return getAllLessons().find((l) => l.id === id)
}

// Helper to find a topic by ID
export function getTopicById(id: string) {
  return topics.find((t) => t.id === id)
}

// Helper to get prev/next lesson
export function getAdjacentLessons(id: string) {
  const allLessons = getAllLessons()
  const idx = allLessons.findIndex((l) => l.id === id)
  return {
    prev: idx > 0 ? allLessons[idx - 1] : null,
    next: idx < allLessons.length - 1 ? allLessons[idx + 1] : null,
  }
}
