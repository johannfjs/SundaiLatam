import ReactMarkdown from 'react-markdown'

interface StreamingMessageProps {
  content: string
  isStreaming: boolean
}

export function StreamingMessage({ content, isStreaming }: StreamingMessageProps) {
  if (!content) return null

  return (
    <div className="px-4 py-3 text-sm text-gray-300 leading-relaxed prose prose-invert prose-sm max-w-none
      prose-headings:text-white prose-headings:font-semibold
      prose-strong:text-white
      prose-ul:my-1 prose-li:my-0.5
      prose-p:my-2 prose-p:leading-relaxed
      prose-h2:text-base prose-h3:text-sm">
      <ReactMarkdown>{content}</ReactMarkdown>
      {isStreaming && <span className="cursor-blink" />}
    </div>
  )
}
