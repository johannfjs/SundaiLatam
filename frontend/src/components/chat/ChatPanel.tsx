import { useRef, useEffect, useState } from 'react'
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
  const topRef = useRef<HTMLDivElement>(null)
  // formOpen: true = show full form, false = show compact bar
  const [formOpen, setFormOpen] = useState(true)

  const hasContent = !!(narrative || error)

  // When narrative first arrives: collapse form and scroll to top
  useEffect(() => {
    if (narrative) {
      setFormOpen(false)
      topRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [!!narrative]) // eslint-disable-line react-hooks/exhaustive-deps

  // Re-open form when everything resets
  useEffect(() => {
    if (!narrative && !isStreaming && !error) setFormOpen(true)
  }, [narrative, isStreaming, error])

  const showCompactBar = hasContent && !formOpen && !isStreaming
  const showFullForm   = (!hasContent || formOpen) && !isStreaming
  const showStopBtn    = isStreaming

  return (
    <div className="flex flex-col h-full bg-gray-950">
      {/* Narrative area — only when there's content or streaming */}
      {(hasContent || isStreaming) ? (
        <div className="flex-1 overflow-y-auto min-h-0">
          <div ref={topRef} />

          {isStreaming && !narrative && (
            <div className="flex items-center gap-2 px-6 pt-6 text-indigo-400 text-sm">
              <span className="inline-block w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              Building your routine…
            </div>
          )}

          {error && (
            <div className="m-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <StreamingMessage content={narrative} isStreaming={isStreaming} />
        </div>
      ) : (
        /* Empty state — fixed height, doesn't steal space from form */
        <div className="shrink-0 flex flex-col items-center gap-3 text-center px-6 py-6">
          <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-600/40 flex items-center justify-center">
            <span className="text-2xl">🔬</span>
          </div>
          <p className="text-gray-400 text-sm max-w-xs">
            Fill in your profile and click{' '}
            <span className="text-indigo-400 font-medium">Generate Routine</span>{' '}
            to get a science-backed workout plan with full citations.
          </p>
        </div>
      )}

      {/* Bottom controls — flex-1 when showing full form so it's scrollable */}
      <div className={`border-t border-gray-800 ${showFullForm ? 'flex-1 overflow-y-auto min-h-0' : 'shrink-0'}`}>
        {showStopBtn && (
          <div className="p-3">
            <button
              onClick={onStop}
              className="w-full py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors"
            >
              Stop Generation
            </button>
          </div>
        )}

        {showCompactBar && (
          <div className="px-4 py-3">
            <button
              onClick={() => setFormOpen(true)}
              className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors"
            >
              Edit &amp; Regenerate
            </button>
          </div>
        )}

        {showFullForm && (
          <>
            {hasContent && (
              <div className="flex justify-end px-4 pt-2">
                <button
                  onClick={() => setFormOpen(false)}
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  Collapse ↑
                </button>
              </div>
            )}
            <ChatInput onSubmit={onSubmit} onStop={onStop} isStreaming={isStreaming} />
          </>
        )}
      </div>
    </div>
  )
}
