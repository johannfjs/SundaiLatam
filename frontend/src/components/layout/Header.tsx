interface HeaderProps {
  isStreaming: boolean
}

export function Header({ isStreaming }: HeaderProps) {
  return (
    <div className="flex items-center justify-between px-5 py-3 bg-gray-950 border-b border-gray-800">
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
          <span className="text-white text-sm font-bold">FS</span>
        </div>
        <span className="text-white font-semibold text-sm tracking-tight">FitScience AI</span>
        <span className="text-gray-600 text-xs">Evidence-based training</span>
      </div>

      {isStreaming && (
        <div className="flex items-center gap-2 text-indigo-400 text-xs">
          <span className="inline-block w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          Generating routine…
        </div>
      )}
    </div>
  )
}
