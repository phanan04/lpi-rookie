'use client'
import { useState, useRef, useEffect, useCallback, KeyboardEvent } from 'react'
import { createState, execute, getPrompt, Line, TermState } from '@/lib/terminal/engine'
import { resolvePath, getEntry, getChildren } from '@/lib/terminal/fs'

interface TerminalProps {
  initialCommands?: string[]
  height?: string
}

const WELCOME: Line[] = [
  { text: '<span style="color:#e2b714;font-weight:700">LPI 101-500 Linux Terminal Simulator</span>', html: true },
  { text: '<span style="color:#646669">Simulated environment — practice Linux commands safely</span>', html: true },
  { text: '<span style="color:#646669">Type <span style="color:#4caf74">help</span> for available commands · ↑↓ history · Tab to complete</span>', html: true },
  { text: '', html: false },
]

export default function Terminal({ initialCommands = [], height = '600px' }: TerminalProps) {
  const [state, setState] = useState<TermState>(createState)
  const [input, setInput] = useState('')
  const [lines, setLines] = useState<Line[]>(WELCOME)
  const [histIdx, setHistIdx] = useState(-1)
  const [cmdHistory, setCmdHistory] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Run initial commands on mount
  useEffect(() => {
    if (!initialCommands.length) return
    let st = createState()
    const newLines: Line[] = [...WELCOME]
    initialCommands.forEach(cmd => {
      newLines.push({ text: `<span style="color:#4caf74">${getPrompt(st)}</span><span style="color:#d1d0c5">${cmd}</span>`, html: true })
      const { lines: out, newState } = execute(cmd, st)
      newLines.push(...out)
      st = newState
    })
    setLines(newLines)
    setState(st)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  const runCommand = useCallback((cmd: string) => {
    const prompt = getPrompt(state)
    const { lines: out, newState } = execute(cmd, state)

    const promptLine: Line = {
      text: `<span style="color:#4caf74">${prompt}</span><span style="color:#d1d0c5">${cmd}</span>`,
      html: true,
    }

    if (out.length === 1 && out[0].text === '__CLEAR__') {
      setLines([])
    } else {
      setLines(prev => [...prev, promptLine, ...out])
    }

    if (cmd.trim()) {
      setCmdHistory(prev => {
        const next = [cmd, ...prev.filter(c => c !== cmd)].slice(0, 200)
        return next
      })
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
      setLines(prev => [...prev, {
        text: `<span style="color:#4caf74">${getPrompt(state)}</span><span style="color:#d1d0c5">${input}</span><span style="color:#ca4754">^C</span>`,
        html: true,
      }])
      setInput('')
      setHistIdx(-1)
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      setLines([])
    }
  }

  const prompt = getPrompt(state)

  return (
    <div
      style={{
        background: '#1a1b1e',
        borderRadius: '10px',
        border: '1px solid rgba(255,255,255,0.06)',
        overflow: 'hidden',
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
        fontSize: '13px',
        lineHeight: '1.6',
      }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Title bar */}
      <div style={{
        background: '#2c2e31',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ca4754' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#e2b714' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#4caf74' }} />
        </div>
        <span style={{ color: '#646669', fontSize: '12px', marginLeft: '8px' }}>
          {state.user}@{state.hostname}: {state.cwd.replace('/home/user', '~')}
        </span>
      </div>

      {/* Output */}
      <div
        style={{
          height,
          overflowY: 'auto',
          padding: '16px',
          cursor: 'text',
          scrollbarWidth: 'thin',
          scrollbarColor: '#404244 transparent',
        }}
      >
        {lines.map((line, i) => (
          <div key={i} style={{ color: '#d1d0c5', whiteSpace: 'pre-wrap', wordBreak: 'break-all', minHeight: '21px' }}>
            {line.html
              ? <span dangerouslySetInnerHTML={{ __html: line.text }} />
              : <span>{line.text}</span>
            }
          </div>
        ))}

        {/* Input line */}
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '2px' }}>
          <span
            dangerouslySetInnerHTML={{ __html: `<span style="color:#4caf74">${prompt}</span>` }}
            style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
          />
          <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#d1d0c5',
                fontFamily: 'inherit',
                fontSize: 'inherit',
                width: '100%',
                caretColor: '#e2b714',
              }}
            />
          </div>
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
