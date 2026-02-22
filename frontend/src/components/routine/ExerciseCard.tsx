import type { Exercise, MuscleGroup } from '../../types'

interface ExerciseCardProps {
  exercise: Exercise
  index: number
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

export function ExerciseCard({ exercise, index }: ExerciseCardProps) {
  const { scheme } = exercise

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 space-y-3 animate-slide-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-mono w-5 text-right">{index + 1}</span>
          <h3 className="text-white font-semibold text-sm leading-tight">{exercise.name}</h3>
        </div>
        <span className="shrink-0 text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-md">
          {exercise.equipment}
        </span>
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

      {/* Tempo */}
      {scheme.tempo && (
        <p className="pl-7 text-xs text-gray-500">
          Tempo: <span className="text-gray-300 font-mono">{scheme.tempo}</span>{' '}
          <span className="text-gray-600">(eccentric–pause–concentric–top)</span>
        </p>
      )}

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
