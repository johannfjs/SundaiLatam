import { useRef, useEffect } from 'react'
import type { ChatRequest } from '../../types'
import { ChatInput } from './ChatInput'
import { StreamingMessage } from './StreamingMessage'

interface ChatPanelProps {
  narrative: string
  isStreaming: boolean
  error: string | null
  onSubmit: (req: ChatRequest) => void
  onStop: () => void
}

export function ChatPanel({ narrative, isStreaming, error, onSubmit, onStop }: ChatPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [narrative])

  return (
    <div className="flex flex-col h-full bg-gray-950">
      {/* Scrollable narrative area */}
      <div className="flex-1 overflow-y-auto">
        {!narrative && !isStreaming && !error && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-600/40 flex items-center justify-center">
              <span className="text-2xl">🔬</span>
            </div>
            <p className="text-gray-400 text-sm max-w-xs">
              Fill in your profile and click <span className="text-indigo-400 font-medium">Generate Routine</span> to get a science-backed workout plan with full citations.
            </p>
          </div>
        )}

        {error && (
          <div className="m-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <StreamingMessage content={narrative} isStreaming={isStreaming} />
        <div ref={bottomRef} />
      </div>

      {/* Divider */}
      <div className="border-t border-gray-800">
        <ChatInput onSubmit={onSubmit} onStop={onStop} isStreaming={isStreaming} />
      </div>
    </div>
  )
}
