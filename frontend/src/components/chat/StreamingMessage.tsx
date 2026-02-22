interface StreamingMessageProps {
  content: string
  isStreaming: boolean
}

export function StreamingMessage({ content, isStreaming }: StreamingMessageProps) {
  if (!content) return null

  return (
    <div className="px-4 py-3 text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
      {content}
      {isStreaming && <span className="cursor-blink" />}
    </div>
  )
}
