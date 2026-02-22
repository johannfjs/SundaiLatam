import { SplitPanel } from './components/layout/SplitPanel'
import { Header } from './components/layout/Header'
import { ChatPanel } from './components/chat/ChatPanel'
import { RoutinePanel } from './components/routine/RoutinePanel'
import { useStream } from './hooks/useStream'

function App() {
  const { narrative, routine, isStreaming, error, startStream, stopStream } = useStream()

  return (
    <div className="flex flex-col h-screen bg-gray-950">
      <Header isStreaming={isStreaming} />
      <div className="flex-1 overflow-hidden">
        <SplitPanel
          left={
            <ChatPanel
              narrative={narrative}
              isStreaming={isStreaming}
              error={error}
              onSubmit={startStream}
              onStop={stopStream}
            />
          }
          right={
            <RoutinePanel routine={routine} isStreaming={isStreaming} />
          }
        />
      </div>
    </div>
  )
}

export default App
