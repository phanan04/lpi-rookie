'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { MessageCircle, X, Send, Bot, User, Loader2, Minimize2, Trash2 } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { getLessonById } from '@/lib/curriculum'
import { extractSectionText } from '@/lib/searchUtils'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

function MarkdownText({ text }: { text: string }) {
  // Minimal inline markdown: **bold**, `code`, newlines
  const parts = text.split(/(`[^`]+`)/g)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code
              key={i}
              style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '3px', padding: '1px 4px', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85em' }}
            >
              {part.slice(1, -1)}
            </code>
          )
        }
        return (
          <span key={i}>
            {part.split('\n').map((line, j, arr) => (
              <span key={j}>
                {line}
                {j < arr.length - 1 && <br />}
              </span>
            ))}
          </span>
        )
      })}
    </>
  )
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const pathname = usePathname()

  // Derive lesson context from current URL
  const lessonId = pathname?.startsWith('/lesson/') ? pathname.replace('/lesson/', '').split('/')[0] : null
  const lesson = lessonId ? getLessonById(lessonId) : null
  const lessonContext = lesson
    ? `Lesson ${lesson.id}: ${lesson.title}\nDescription: ${lesson.description}\nContent:\n${extractSectionText(lesson.sections).slice(0, 3000)}`
    : null

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
  }, [open])

  const sendMessage = useCallback(async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg: Message = { role: 'user', content: text }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          lessonContext,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Request failed' }))
        setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ Lỗi: ${err.error ?? 'Không thể kết nối'}` }])
        return
      }

      // Stream response
      const reader = res.body?.getReader()
      if (!reader) return

      let assistantText = ''
      setMessages(prev => [...prev, { role: 'assistant', content: '' }])

      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        assistantText += decoder.decode(value, { stream: true })
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: 'assistant', content: assistantText }
          return updated
        })
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ Lỗi kết nối: ${msg}` }])
    } finally {
      setLoading(false)
    }
  }, [input, loading, messages, lessonContext])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () => setMessages([])

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
          style={{ width: 52, height: 52, background: '#e2b714', color: '#323437' }}
          title="Hỏi AI về bài học này"
        >
          <MessageCircle size={22} />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-6 right-6 z-50 flex flex-col rounded-2xl shadow-2xl overflow-hidden"
          style={{
            width: '360px',
            maxWidth: 'calc(100vw - 24px)',
            height: '520px',
            maxHeight: 'calc(100vh - 80px)',
            background: '#2c2e31',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-2.5 px-4 py-3 flex-shrink-0"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: '#272a2d' }}
          >
            <div
              className="flex items-center justify-center rounded-full flex-shrink-0"
              style={{ width: 28, height: 28, background: 'rgba(226,183,20,0.15)' }}
            >
              <Bot size={14} style={{ color: '#e2b714' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium" style={{ color: '#d1d0c5' }}>LPI Tutor AI</p>
              {lesson && (
                <p className="text-xs truncate" style={{ color: '#646669' }}>
                  Đang xem: {lesson.id} — {lesson.title}
                </p>
              )}
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  className="p-1.5 rounded transition-colors hover:bg-white/5"
                  style={{ color: '#646669' }}
                  title="Xóa lịch sử"
                >
                  <Trash2 size={14} />
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded transition-colors hover:bg-white/5"
                style={{ color: '#646669' }}
                title="Thu nhỏ"
              >
                <Minimize2 size={14} />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded transition-colors hover:bg-white/5"
                style={{ color: '#646669' }}
                title="Đóng"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3" style={{ scrollbarWidth: 'thin' }}>
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-3" style={{ color: '#646669' }}>
                <Bot size={36} style={{ opacity: 0.3 }} />
                <div className="text-center">
                  <p className="text-sm font-medium mb-1" style={{ color: '#8b8e94' }}>LPI Tutor AI</p>
                  <p className="text-xs">
                    {lesson
                      ? `Tôi đã có nội dung bài "${lesson.id}: ${lesson.title}". Hỏi tôi bất cứ điều gì!`
                      : 'Hỏi tôi bất cứ điều gì về Linux và chứng chỉ LPI!'}
                  </p>
                </div>
                <div className="flex flex-col gap-1.5 w-full mt-2">
                  {(lesson
                    ? [`Giải thích nội dung bài ${lesson.id} bằng tiếng Việt`, 'Cho tôi ví dụ thực tế', 'Câu hỏi thi LPI về bài này']
                    : ['Sự khác biệt giữa MBR và GPT?', 'Lệnh để xem kernel modules?', 'Giải thích runlevel trong Linux']
                  ).map(hint => (
                    <button
                      key={hint}
                      onClick={() => { setInput(hint); setTimeout(() => inputRef.current?.focus(), 50) }}
                      className="text-left text-xs px-3 py-2 rounded-lg transition-colors"
                      style={{ background: 'rgba(255,255,255,0.04)', color: '#8b8e94', border: '1px solid rgba(255,255,255,0.06)' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                    >
                      {hint}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div
                    className="flex items-center justify-center rounded-full flex-shrink-0 self-end"
                    style={{ width: 24, height: 24, background: 'rgba(226,183,20,0.12)', marginBottom: '2px' }}
                  >
                    <Bot size={12} style={{ color: '#e2b714' }} />
                  </div>
                )}
                <div
                  className="text-sm rounded-2xl px-3 py-2 max-w-[80%]"
                  style={
                    msg.role === 'user'
                      ? { background: '#e2b714', color: '#323437', borderBottomRightRadius: '4px' }
                      : { background: 'rgba(255,255,255,0.06)', color: '#d1d0c5', borderBottomLeftRadius: '4px' }
                  }
                >
                  {msg.content ? <MarkdownText text={msg.content} /> : (
                    <Loader2 size={14} className="animate-spin" style={{ color: '#646669' }} />
                  )}
                </div>
                {msg.role === 'user' && (
                  <div
                    className="flex items-center justify-center rounded-full flex-shrink-0 self-end"
                    style={{ width: 24, height: 24, background: 'rgba(226,183,20,0.15)', marginBottom: '2px' }}
                  >
                    <User size={12} style={{ color: '#e2b714' }} />
                  </div>
                )}
              </div>
            ))}

            {loading && messages[messages.length - 1]?.role !== 'assistant' && (
              <div className="flex gap-2">
                <div className="flex items-center justify-center rounded-full" style={{ width: 24, height: 24, background: 'rgba(226,183,20,0.12)' }}>
                  <Bot size={12} style={{ color: '#e2b714' }} />
                </div>
                <div className="text-sm rounded-2xl px-3 py-2" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <Loader2 size={14} className="animate-spin" style={{ color: '#646669' }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div
            className="flex-shrink-0 p-3"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div
              className="flex items-end gap-2 rounded-xl px-3 py-2"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Hỏi về Linux, LPI, bài học... (Enter gửi)"
                rows={1}
                className="flex-1 bg-transparent outline-none resize-none text-sm"
                style={{ color: '#d1d0c5', maxHeight: '100px', lineHeight: '1.5' }}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="flex-shrink-0 flex items-center justify-center rounded-lg transition-all"
                style={{
                  width: 32, height: 32,
                  background: input.trim() && !loading ? '#e2b714' : 'rgba(255,255,255,0.06)',
                  color: input.trim() && !loading ? '#323437' : '#646669',
                }}
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              </button>
            </div>
            <p className="text-center mt-1.5 text-[10px]" style={{ color: '#404244' }}>
              Powered by Groq • Shift+Enter xuống dòng
            </p>
          </div>
        </div>
      )}
    </>
  )
}
