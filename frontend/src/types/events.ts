import type { WorkoutRoutine } from './routine'

export interface TextEventData {
  content: string
}

export interface ErrorEventData {
  message: string
  raw?: string
}

export type SSEEvent =
  | { event: 'text'; data: TextEventData }
  | { event: 'routine_update'; data: WorkoutRoutine }
  | { event: 'done'; data: Record<string, never> }
  | { event: 'error'; data: ErrorEventData }
