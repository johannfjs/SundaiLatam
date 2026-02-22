import { useCallback, useRef, useState } from 'react'

interface SplitPanelProps {
  left: React.ReactNode
  right: React.ReactNode
}

export function SplitPanel({ left, right }: SplitPanelProps) {
  const [leftPercent, setLeftPercent] = useState(42)
  const isDragging = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const onMouseDown = useCallback(() => {
    isDragging.current = true
  }, [])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const pct = ((e.clientX - rect.left) / rect.width) * 100
    setLeftPercent(Math.max(28, Math.min(72, pct)))
  }, [])

  const onMouseUp = useCallback(() => {
    isDragging.current = false
  }, [])

  return (
    <div
      ref={containerRef}
      className="flex h-screen overflow-hidden select-none"
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      <div style={{ width: `${leftPercent}%` }} className="flex flex-col overflow-hidden min-w-0">
        {left}
      </div>

      {/* Drag handle */}
      <div
        onMouseDown={onMouseDown}
        className="w-1 flex-shrink-0 bg-gray-800 hover:bg-indigo-500 cursor-col-resize transition-colors duration-150"
      />

      <div style={{ width: `${100 - leftPercent}%` }} className="flex flex-col overflow-hidden min-w-0">
        {right}
      </div>
    </div>
  )
}
