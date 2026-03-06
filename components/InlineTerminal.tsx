'use client'
import { useState, useRef, useEffect, useCallback, KeyboardEvent } from 'react'
import { Terminal as TerminalIcon, ChevronUp, ChevronDown, RotateCcw } from 'lucide-react'
import { createState, execute, getPrompt, Line, TermState } from '@/lib/terminal/engine'
import { resolvePath, getEntry, getChildren } from '@/lib/terminal/fs'

interface InlineTerminalProps {
  title?: string
  hint?: string
}

const BOOT_LINES: Line[] = [
  { text: '<span style="color:#4caf74">Terminal sẵn sàng</span> — thử các lệnh bên dưới', html: true },
]

export default function InlineTerminal({ title, hint }: InlineTerminalProps) {
  const [open, setOpen] = useState(false)
  const [state, setState] = useState<TermState>(createState)
  const [input, setInput] = useState(hint ?? '')
  const [lines, setLines] = useState<Line[]>(BOOT_LINES)
  const [histIdx, setHistIdx] = useState(-1)
  const [cmdHistory, setCmdHistory] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [lines])

  const reset = () => {
    setState(createState())
    setLines(BOOT_LINES)
    setInput(hint ?? '')
    setHistIdx(-1)
    setCmdHistory([])
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const runCommand = useCallback((cmd: string) => {
    const prompt = getPrompt(state)
    const { lines: out, newState } = execute(cmd, state)
    const promptLine: Line = {
      text: `<span style="color:#4caf74">${prompt}</span><span style="color:#d1d0c5"> ${cmd}</span>`,
      html: true,
    }
    if (out.length === 1 && out[0].text === '__CLEAR__') {
      setLines([])
    } else {
      setLines(prev => [...prev, promptLine, ...out])
    }
    if (cmd.trim()) {
      setCmdHistory(prev => [cmd, ...prev.filter(c => c !== cmd)].slice(0, 100))
    }
    setHistIdx(-1)
    setState(newState)
    setInput('')
  }, [state])

  const handleTab = useCallback(() => {
    const parts = input.split(' ')
    const last = parts[parts.length - 1]
    if (!last) return
    const resolved = resolvePath(last, state.cwd)
    const parentPath = resolved.split('/').slice(0, -1).join('/') || '/'
    const prefix = resolved.split('/').pop() || ''
    const children = getChildren(parentPath, state.overlay)
    const matches = children.filter(c => c.startsWith(prefix))
    if (matches.length === 1) {
      const full = (parentPath === '/' ? '' : parentPath) + '/' + matches[0]
      const entry = getEntry(full, state.overlay)
      const completed = last.replace(prefix, matches[0] + (entry?.type === 'dir' ? '/' : ' '))
      parts[parts.length - 1] = completed
      setInput(parts.join(' '))
    } else if (matches.length > 1) {
      setLines(prev => [...prev, { text: matches.join('  '), html: false }])
    }
  }, [input, state])

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      runCommand(input)
    } else if (e.key === 'Tab') {
      e.preventDefault()
      handleTab()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(histIdx + 1, cmdHistory.length - 1)
      setHistIdx(next)
      setInput(cmdHistory[next] || '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = Math.max(histIdx - 1, -1)
      setHistIdx(next)
      setInput(next === -1 ? '' : cmdHistory[next])
    } else if (e.key === 'c' && e.ctrlKey) {
      setLines(prev => [
        ...prev,
        {
          text: `<span style="color:#4caf74">${getPrompt(state)}</span><span style="color:#d1d0c5"> ${input}</span><span style="color:#ca4754">^C</span>`,
          html: true,
        },
      ])
      setInput('')
      setHistIdx(-1)
    }
  }

  return (
    <div
      className="my-4 rounded-lg overflow-hidden"
      style={{ border: '1px solid rgba(226,183,20,0.25)' }}
    >
      {/* Header / toggle bar */}
      <div
        className="flex items-center justify-between px-4 py-2.5 cursor-pointer select-none"
        style={{ background: 'rgba(226,183,20,0.08)' }}
        onClick={() => setOpen(v => !v)}
      >
        <div className="flex items-center gap-2">
          <TerminalIcon size={12} style={{ color: '#e2b714', flexShrink: 0 }} />
          <span
            className="text-xs font-semibold uppercase tracking-wide"
            style={{ color: '#e2b714', fontFamily: 'Lexend Deca, sans-serif' }}
          >
            {title ?? 'Thử ngay'}
          </span>
          {!open && hint && (
            <span
              className="text-xs ml-2 opacity-60"
              style={{ color: '#d1d0c5', fontFamily: 'JetBrains Mono, monospace' }}
            >
              {hint}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {open && (
            <button
              onClick={e => { e.stopPropagation(); reset() }}
              className="flex items-center gap-1 text-xs px-2 py-0.5 rounded transition-colors"
              style={{
                color: '#646669',
                border: '1px solid rgba(255,255,255,0.08)',
                fontFamily: 'Lexend Deca, sans-serif',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#d1d0c5')}
              onMouseLeave={e => (e.currentTarget.style.color = '#646669')}
            >
              <RotateCcw size={11} /> Reset
            </button>
          )}
          <span style={{ color: '#646669' }}>
            {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </span>
        </div>
      </div>

      {/* Terminal body */}
      {open && (
        <div
          style={{
            background: '#111214',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.78rem',
          }}
        >
          {/* Output area */}
          <div
            ref={outputRef}
            className="overflow-y-auto px-4 py-3 space-y-0.5"
            style={{ maxHeight: '260px', minHeight: '80px' }}
            onClick={() => inputRef.current?.focus()}
          >
            {lines.map((line, i) =>
              line.html ? (
                <div
                  key={i}
                  dangerouslySetInnerHTML={{ __html: line.text }}
                  style={{ lineHeight: '1.55', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}
                />
              ) : (
                <div
                  key={i}
                  style={{ color: '#d1d0c5', lineHeight: '1.55', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}
                >
                  {line.text}
                </div>
              )
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input row */}
          <div
            className="flex items-center gap-2 px-4 py-2"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
          >
            <span
              dangerouslySetInnerHTML={{ __html: getPrompt(state) }}
              style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
            />
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              autoComplete="off"
              spellCheck={false}
              className="flex-1 bg-transparent outline-none border-none"
              style={{ color: '#d1d0c5', caretColor: '#e2b714', minWidth: 0 }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
