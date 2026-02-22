export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'quads'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'core'
  | 'forearms'
  | 'traps'

export interface SetScheme {
  sets: number
  reps: string
  rest_seconds: number
  rpe: number | null
  tempo: string | null
}

export interface Citation {
  title: string
  authors: string[]
  year: number
  journal: string | null
  doi: string | null
  chunk_id: string
}

export interface Exercise {
  name: string
  equipment: string
  primary_muscles: MuscleGroup[]
  secondary_muscles: MuscleGroup[]
  scheme: SetScheme
  coaching_cues: string[]
  science_rationale: string
  citations: Citation[]
}

export interface WorkoutDay {
  day_label: string
  exercises: Exercise[]
  total_volume_per_muscle: Record<string, number>
}

export interface WorkoutRoutine {
  title: string
  weeks: number
  frequency: number
  goal: string
  days: WorkoutDay[]
  periodization_notes: string
  total_weekly_volume: Record<string, number>
  citations: Citation[]
}

export interface ChatRequest {
  goal: string
  fitness_level: 'beginner' | 'intermediate' | 'advanced'
  equipment: string[]
  days_per_week: number
  session_minutes: number
  injuries: string[]
  additional_context: string
}
