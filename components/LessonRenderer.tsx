import type { SectionType } from '@/lib/types'
import { useSettings } from '@/lib/settingsContext'
import { Lightbulb, AlertTriangle, Info, Target, FolderOpen } from 'lucide-react'
import InlineTerminal from '@/components/InlineTerminal'

interface LessonRendererProps {
  sections: SectionType[]
}

const FONT_SIZE_MAP = { sm: '12px', md: '14px', lg: '16px' } as const

export default function LessonRenderer({ sections }: LessonRendererProps) {
  const { settings } = useSettings()
  return (
    <div className="space-y-4" data-lesson-font={settings.fontSize} style={{ fontSize: FONT_SIZE_MAP[settings.fontSize] }}>
      {sections.map((section, i) => {
        switch (section.type) {
          case 'h2':
            return (
              <h2
                key={i}
                className="text-lg font-bold mt-8 mb-3 pb-2 inline-block"
                style={{
                  color: '#d1d0c5',
                  borderBottom: '2px solid #e2b714',
                  fontFamily: 'Lexend Deca, sans-serif',
                }}
              >
                {section.text}
              </h2>
            )

          case 'h3':
            return (
              <h3
                key={i}
                className="text-sm font-semibold mt-5 mb-2"
                style={{ color: '#e2b714' }}
              >
                {section.text}
              </h3>
            )

          case 'p':
            return (
              <p key={i} className="text-sm leading-relaxed" style={{ color: '#d1d0c5' }}>
                {section.text}
              </p>
            )

          case 'code':
            return (
              <pre
                key={i}
                className="rounded-lg p-4 overflow-x-auto text-sm leading-relaxed my-3"
                style={{
                  background: '#1e2022',
                  color: '#d1d0c5',
                  border: '1px solid rgba(255,255,255,0.06)',
                  fontFamily: 'JetBrains Mono, monospace',
                }}
              >
                <code>{section.text}</code>
              </pre>
            )

          case 'list':
            return (
              <ul key={i} className="list-disc list-inside space-y-1.5 text-sm" style={{ color: '#d1d0c5' }}>
                {section.items.map((item, j) => (
                  <li key={j} className="leading-relaxed">{item}</li>
                ))}
              </ul>
            )

          case 'olist':
            return (
              <ol key={i} className="list-decimal list-inside space-y-1.5 text-sm" style={{ color: '#d1d0c5' }}>
                {section.items.map((item, j) => (
                  <li key={j} className="leading-relaxed">{item}</li>
                ))}
              </ol>
            )

          case 'table':
            return (
              <div key={i} className="overflow-x-auto my-4 rounded-lg" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                      {section.headers.map((h, j) => (
                        <th
                          key={j}
                          className="text-left px-4 py-2.5 font-semibold whitespace-nowrap"
                          style={{
                            color: '#d1d0c5',
                            borderBottom: '1px solid rgba(255,255,255,0.08)',
                            fontFamily: 'Lexend Deca, sans-serif',
                            fontSize: '0.78rem',
                            letterSpacing: '0.03em',
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.rows.map((row, j) => (
                      <tr
                        key={j}
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                        className="transition-colors"
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        {row.map((cell, k) => (
                          <td
                            key={k}
                            className="px-4 py-2.5 align-top"
                            style={{
                              color: k === 0 ? '#e2b714' : '#646669',
                              fontFamily: k === 0 ? 'JetBrains Mono, monospace' : 'Lexend Deca, sans-serif',
                              fontSize: k === 0 ? '0.78rem' : '0.85rem',
                              fontWeight: k === 0 ? 500 : 400,
                              whiteSpace: k === 0 ? 'nowrap' : 'normal',
                            }}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )

          case 'tip':
            return (
              <div
                key={i}
                className="flex gap-3 rounded-r-lg p-4 my-3"
                style={{
                  background: 'rgba(76,175,116,0.06)',
                  borderLeft: '3px solid #4caf74',
                }}
              >
                <Lightbulb size={16} className="flex-shrink-0 mt-0.5" style={{ color: '#4caf74' }} />
                <div>
                  <div className="font-semibold mb-1 text-sm" style={{ color: '#4caf74' }}>{section.title}</div>
                  <div className="text-sm leading-relaxed" style={{ color: '#646669' }}>{section.body}</div>
                </div>
              </div>
            )

          case 'warning':
            return (
              <div
                key={i}
                className="flex gap-3 rounded-r-lg p-4 my-3"
                style={{
                  background: 'rgba(226,183,20,0.06)',
                  borderLeft: '3px solid #e2b714',
                }}
              >
                <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" style={{ color: '#e2b714' }} />
                <div>
                  <div className="font-semibold mb-1 text-sm" style={{ color: '#e2b714' }}>{section.title}</div>
                  <div className="text-sm leading-relaxed" style={{ color: '#646669' }}>{section.body}</div>
                </div>
              </div>
            )

          case 'info':
            return (
              <div
                key={i}
                className="flex gap-3 rounded-r-lg p-4 my-3"
                style={{
                  background: 'rgba(100,100,105,0.1)',
                  borderLeft: '3px solid #646669',
                }}
              >
                <Info size={16} className="flex-shrink-0 mt-0.5" style={{ color: '#646669' }} />
                <div>
                  <div className="font-semibold mb-1 text-sm" style={{ color: '#d1d0c5' }}>{section.title}</div>
                  <div className="text-sm leading-relaxed" style={{ color: '#646669' }}>{section.body}</div>
                </div>
              </div>
            )

          case 'exam':
            return (
              <div
                key={i}
                className="flex gap-3 rounded-r-lg p-4 my-3"
                style={{
                  background: 'rgba(202,71,84,0.06)',
                  borderLeft: '3px solid #ca4754',
                }}
              >
                <Target size={16} className="flex-shrink-0 mt-0.5" style={{ color: '#ca4754' }} />
                <div>
                  <div className="font-semibold mb-1 text-sm" style={{ color: '#ca4754' }}>{section.title}</div>
                  <div className="text-sm leading-relaxed" style={{ color: '#646669' }}>{section.body}</div>
                </div>
              </div>
            )

          case 'files':
            return (
              <div key={i} className="my-3">
                <div
                  className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide mb-2"
                  style={{ color: '#646669' }}
                >
                  <FolderOpen size={12} /> key files &amp; dirs
                </div>
                <div className="flex flex-wrap gap-2">
                  {section.files.map((f, j) => (
                    <span
                      key={j}
                      className="mono text-xs px-3 py-1 rounded"
                      style={{
                        background: '#1e2022',
                        color: '#4caf74',
                        border: '1px solid rgba(255,255,255,0.06)',
                        fontFamily: 'JetBrains Mono, monospace',
                      }}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )

          case 'practice':
            return (
              <InlineTerminal key={i} title={section.title} hint={section.hint} />
            )

          default:
            return null
        }
      })}
    </div>
  )
}
