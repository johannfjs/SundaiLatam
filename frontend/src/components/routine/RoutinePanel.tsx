import type { MuscleGroup, WorkoutRoutine } from '../../types'
import { ExerciseCard } from './ExerciseCard'
import { VolumeMetrics } from './VolumeMetrics'
import { MuscleMap } from './MuscleMap'
import { CitationList } from './CitationList'
import { useState } from 'react'

interface RoutinePanelProps {
  routine: WorkoutRoutine | null
  isStreaming: boolean
}

export function RoutinePanel({ routine, isStreaming }: RoutinePanelProps) {
  const [activeDay, setActiveDay] = useState(0)

  if (!routine) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-900 gap-3 text-center px-6">
        <div className="w-12 h-12 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center">
          <span className="text-2xl">💪</span>
        </div>
        <p className="text-gray-500 text-sm max-w-xs">
          {isStreaming
            ? 'Analyzing research articles and building your routine…'
            : 'Your personalized, science-backed routine will appear here.'}
        </p>
        {isStreaming && (
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  const currentDay = routine.days[activeDay] ?? routine.days[0]

  // Collect all unique muscles worked across the entire routine
  const allMuscles = Array.from(
    new Set(
      routine.days.flatMap((d) =>
        d.exercises.flatMap((e) => [...e.primary_muscles, ...e.secondary_muscles]),
      ),
    ),
  ) as MuscleGroup[]

  return (
    <div className="flex flex-col h-full bg-gray-900 overflow-hidden">
      {/* Routine header */}
      <div className="px-4 py-3 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white font-semibold text-sm leading-tight">{routine.title}</h2>
            <p className="text-gray-500 text-xs mt-0.5">
              {routine.weeks} weeks · {routine.frequency}×/week · {routine.goal}
            </p>
          </div>
          <span className="text-xs bg-indigo-600/20 text-indigo-400 border border-indigo-600/30 px-2 py-1 rounded-lg">
            {routine.days.length} days
          </span>
        </div>
      </div>

      {/* Day tabs */}
      <div className="flex gap-1 px-4 py-2 overflow-x-auto border-b border-gray-800 shrink-0">
        {routine.days.map((day, i) => (
          <button
            key={i}
            onClick={() => setActiveDay(i)}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeDay === i
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {day.day_label.split(' – ')[0] || `Day ${i + 1}`}
          </button>
        ))}
      </div>

      {/* Day content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Current day label */}
        <h3 className="text-indigo-400 text-xs font-semibold uppercase tracking-wider">
          {currentDay.day_label}
        </h3>

        {/* Exercises */}
        <div className="space-y-3">
          {currentDay.exercises.map((ex, i) => (
            <ExerciseCard key={i} exercise={ex} index={i} />
          ))}
        </div>

        {/* Volume metrics for this day */}
        {Object.keys(currentDay.total_volume_per_muscle).length > 0 && (
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
            <VolumeMetrics weeklyVolume={currentDay.total_volume_per_muscle} />
          </div>
        )}

        {/* Overall weekly volume */}
        {Object.keys(routine.total_weekly_volume).length > 0 && (
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 space-y-4">
            <VolumeMetrics weeklyVolume={routine.total_weekly_volume} />
            <div className="border-t border-gray-700 pt-4">
              <MuscleMap activeMuscles={allMuscles} />
            </div>
          </div>
        )}

        {/* Periodization notes */}
        {routine.periodization_notes && (
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Periodization
            </h4>
            <p className="text-gray-300 text-sm leading-relaxed">{routine.periodization_notes}</p>
          </div>
        )}

        {/* Global citations */}
        {routine.citations.length > 0 && (
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
            <CitationList citations={routine.citations} />
          </div>
        )}
      </div>
    </div>
  )
}
