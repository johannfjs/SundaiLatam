import { useCallback, useRef, useState } from 'react'
import type { ChatRequest, SSEEvent, WorkoutRoutine } from '../types'

export interface StreamState {
  narrative: string
  routine: WorkoutRoutine | null
  isStreaming: boolean
  error: string | null
}

export function useStream() {
  const [state, setState] = useState<StreamState>({
    narrative: '',
    routine: null,
    isStreaming: false,
    error: null,
  })

  const abortRef = useRef<AbortController | null>(null)

  const startStream = useCallback(async (request: ChatRequest) => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setState({ narrative: '', routine: null, isStreaming: true, error: null })

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
        signal: controller.signal,
      })

      if (!response.ok) {
        throw new Error(`Server error: HTTP ${response.status}`)
      }
      if (!response.body) {
        throw new Error('No response body')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        // SSE messages are separated by double newlines
        const messages = buffer.split('\n\n')
        buffer = messages.pop() ?? ''

        for (const message of messages) {
          if (!message.trim()) continue

          const lines = message.split('\n')
          const eventLine = lines.find((l) => l.startsWith('event:'))
          const dataLine = lines.find((l) => l.startsWith('data:'))

          if (!eventLine || !dataLine) continue

          const eventType = eventLine.replace('event:', '').trim()
          const rawData = dataLine.replace('data:', '').trim()

          let parsed: unknown
          try {
            parsed = JSON.parse(rawData)
          } catch {
            continue
          }

          const sseEvent = { event: eventType, data: parsed } as SSEEvent

          if (sseEvent.event === 'text') {
            setState((prev) => ({
              ...prev,
              narrative: prev.narrative + sseEvent.data.content,
            }))
          } else if (sseEvent.event === 'routine_update') {
            setState((prev) => ({ ...prev, routine: sseEvent.data }))
          } else if (sseEvent.event === 'done') {
            setState((prev) => ({ ...prev, isStreaming: false }))
          } else if (sseEvent.event === 'error') {
            setState((prev) => ({
              ...prev,
              isStreaming: false,
              error: sseEvent.data.message,
            }))
          }
        }
      }

      setState((prev) => ({ ...prev, isStreaming: false }))
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setState((prev) => ({
          ...prev,
          isStreaming: false,
          error: (err as Error).message,
        }))
      }
    }
  }, [])

  const stopStream = useCallback(() => {
    abortRef.current?.abort()
    setState((prev) => ({ ...prev, isStreaming: false }))
  }, [])

  const reset = useCallback(() => {
    abortRef.current?.abort()
    setState({ narrative: '', routine: null, isStreaming: false, error: null })
  }, [])

  return { ...state, startStream, stopStream, reset }
}
