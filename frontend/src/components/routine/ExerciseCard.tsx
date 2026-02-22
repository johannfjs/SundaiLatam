import { useState } from 'react'
import type { Exercise, MuscleGroup } from '../../types'

interface ExerciseCardProps {
  exercise: Exercise
  index: number
  onUpdate: (updated: Exercise) => void
}

const MUSCLE_STYLES: Record<MuscleGroup, string> = {
  chest: 'bg-red-500/20 text-red-300 border-red-500/30',
  back: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  shoulders: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  biceps: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  triceps: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  quads: 'bg-green-500/20 text-green-300 border-green-500/30',
  hamstrings: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
  glutes: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  calves: 'bg-lime-500/20 text-lime-300 border-lime-500/30',
  core: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  forearms: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  traps: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
}

export function ExerciseCard({ exercise, index, onUpdate }: ExerciseCardProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(exercise)

  const displayed = editing ? draft : exercise
  const { scheme } = displayed

  function save() {
    onUpdate(draft)
    setEditing(false)
  }

  function cancel() {
    setDraft(exercise)
    setEditing(false)
  }

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 space-y-3 animate-slide-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-xs text-gray-500 font-mono w-5 shrink-0 text-right">{index + 1}</span>
          {editing ? (
            <input
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              className="bg-gray-900 border border-gray-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-indigo-500 w-full"
            />
          ) : (
            <h3 className="text-white font-semibold text-sm leading-tight">{exercise.name}</h3>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {!editing && (
            <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-md">
              {exercise.equipment}
            </span>
          )}
          {editing ? (
            <>
              <button
                onClick={save}
                className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-1 rounded-lg transition-colors font-medium"
              >
                Save
              </button>
              <button
                onClick={cancel}
                className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-2.5 py-1 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => { setDraft(exercise); setEditing(true) }}
              className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-white px-2.5 py-1 rounded-lg transition-colors"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Muscles */}
      <div className="flex flex-wrap gap-1 pl-7">
        {exercise.primary_muscles.map((m) => (
          <span
            key={m}
            className={`text-xs px-2 py-0.5 rounded-full border font-medium ${MUSCLE_STYLES[m] ?? 'bg-gray-700 text-gray-300'}`}
          >
            {m}
          </span>
        ))}
        {exercise.secondary_muscles.map((m) => (
          <span
            key={m}
            className="text-xs px-2 py-0.5 rounded-full border border-gray-600 text-gray-500"
          >
            {m}
          </span>
        ))}
      </div>

      {/* Set scheme */}
      {editing ? (
        <div className="grid grid-cols-4 gap-2 pl-7">
          {[
            {
              label: 'Sets',
              value: String(draft.scheme.sets),
              onChange: (v: string) =>
                setDraft((d) => ({ ...d, scheme: { ...d.scheme, sets: Number(v) || d.scheme.sets } })),
            },
            {
              label: 'Reps',
              value: draft.scheme.reps,
              onChange: (v: string) =>
                setDraft((d) => ({ ...d, scheme: { ...d.scheme, reps: v } })),
            },
            {
              label: 'Rest (s)',
              value: String(draft.scheme.rest_seconds),
              onChange: (v: string) =>
                setDraft((d) => ({ ...d, scheme: { ...d.scheme, rest_seconds: Number(v) || d.scheme.rest_seconds } })),
            },
            {
              label: 'RPE',
              value: draft.scheme.rpe != null ? String(draft.scheme.rpe) : '',
              onChange: (v: string) =>
                setDraft((d) => ({ ...d, scheme: { ...d.scheme, rpe: v === '' ? null : Number(v) } })),
            },
          ].map(({ label, value, onChange }) => (
            <div key={label} className="bg-gray-900 rounded-lg p-2">
              <p className="text-gray-500 text-xs mb-1">{label}</p>
              <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="bg-transparent border-b border-gray-600 text-white font-bold text-sm w-full focus:outline-none focus:border-indigo-500"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2 pl-7">
          {[
            { label: 'Sets', value: scheme.sets },
            { label: 'Reps', value: scheme.reps },
            { label: 'Rest', value: `${scheme.rest_seconds}s` },
            { label: 'RPE', value: scheme.rpe != null ? scheme.rpe : '—' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-gray-900 rounded-lg p-2 text-center">
              <p className="text-gray-500 text-xs mb-0.5">{label}</p>
              <p className="text-white font-bold text-sm">{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tempo */}
      {editing ? (
        <div className="pl-7 flex items-center gap-2">
          <span className="text-xs text-gray-500 shrink-0">Tempo:</span>
          <input
            value={draft.scheme.tempo ?? ''}
            onChange={(e) =>
              setDraft((d) => ({ ...d, scheme: { ...d.scheme, tempo: e.target.value || null } }))
            }
            placeholder="e.g. 3-1-1-0"
            className="bg-gray-900 border-b border-gray-600 text-white text-xs font-mono px-1 focus:outline-none focus:border-indigo-500 w-28"
          />
        </div>
      ) : scheme.tempo ? (
        <p className="pl-7 text-xs text-gray-500">
          Tempo: <span className="text-gray-300 font-mono">{scheme.tempo}</span>{' '}
          <span className="text-gray-600">(eccentric–pause–concentric–top)</span>
        </p>
      ) : null}

      {/* Coaching cues */}
      {exercise.coaching_cues.length > 0 && (
        <ul className="pl-7 space-y-0.5">
          {exercise.coaching_cues.map((cue, i) => (
            <li key={i} className="text-xs text-gray-400 flex items-start gap-1.5">
              <span className="text-indigo-500 mt-0.5">›</span>
              {cue}
            </li>
          ))}
        </ul>
      )}

      {/* Science rationale */}
      <p className="pl-7 text-xs text-gray-500 italic leading-relaxed">
        {exercise.science_rationale}
      </p>

      {/* Citations */}
      {exercise.citations.map((c, i) => (
        <p key={i} className="pl-7 text-xs text-indigo-400/80">
          [{i + 1}]{' '}
          {c.doi ? (
            <a
              href={`https://doi.org/${c.doi}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-indigo-300 underline underline-offset-2"
            >
              {c.authors[0] && `${c.authors[0]} `}({c.year}) — {c.title}
            </a>
          ) : (
            <span>
              {c.authors[0] && `${c.authors[0]} `}({c.year}) — {c.title}
            </span>
          )}
        </p>
      ))}
    </div>
  )
}
