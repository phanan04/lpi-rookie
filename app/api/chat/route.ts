import Groq from 'groq-sdk'
import { NextRequest } from 'next/server'

export const runtime = 'nodejs'

const SYSTEM_PROMPT = `You are an expert Linux and LPI (Linux Professional Institute) certification tutor embedded in an LMS (Learning Management System). Your role is to help students studying for LPI 101-500 and 102-500 exams.

Guidelines:
- Answer questions clearly and concisely, focused on LPI exam objectives
- When a lesson context is provided, prioritize explaining concepts from that lesson
- Use examples with real Linux commands when helpful
- Format code/commands in backticks
- If asked about something outside Linux/LPI scope, politely redirect
- Respond in the same language the user writes in (Vietnamese or English)
- Keep answers focused — students are studying, not just chatting`

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'GROQ_API_KEY not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  let body: { messages: { role: string; content: string }[]; lessonContext?: string }
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 })
  }

  const { messages, lessonContext } = body
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: 'messages required' }), { status: 400 })
  }

  // Build system prompt, optionally injecting lesson context
  let systemPrompt = SYSTEM_PROMPT
  if (lessonContext) {
    systemPrompt += `\n\nCurrent lesson context the student is viewing:\n---\n${lessonContext}\n---\nUse this context to give more accurate and relevant answers.`
  }

  try {
    const groq = new Groq({ apiKey })

    const chatMessages: Groq.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...messages.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    ]

    const stream = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: chatMessages,
      stream: true,
      max_tokens: 1024,
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content ?? ''
            if (text) controller.enqueue(encoder.encode(text))
          }
        } finally {
          controller.close()
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
