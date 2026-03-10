import type { SectionType } from './types'

/**
 * Extract all searchable plain text from lesson sections.
 * Used by both SearchModal and ChatWidget.
 */
export function extractSectionText(sections: SectionType[]): string {
  return sections
    .flatMap(s => {
      if (s.type === 'h2' || s.type === 'h3' || s.type === 'p' || s.type === 'code') return [s.text]
      if (s.type === 'tip' || s.type === 'warning' || s.type === 'info' || s.type === 'exam')
        return [s.title, s.body]
      if (s.type === 'list' || s.type === 'olist') return s.items
      if (s.type === 'table') return [...s.headers, ...s.rows.flat()]
      return []
    })
    .join(' ')
}
