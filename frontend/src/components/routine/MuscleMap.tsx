import type { MuscleGroup } from '../../types'

interface MuscleMapProps {
  activeMuscles: MuscleGroup[]
}

const MUSCLE_COLORS: Record<MuscleGroup, string> = {
  chest: '#ef4444',
  back: '#3b82f6',
  shoulders: '#eab308',
  biceps: '#f97316',
  triceps: '#a855f7',
  quads: '#22c55e',
  hamstrings: '#14b8a6',
  glutes: '#ec4899',
  calves: '#84cc16',
  core: '#06b6d4',
  forearms: '#f59e0b',
  traps: '#6366f1',
}

export function MuscleMap({ activeMuscles }: MuscleMapProps) {
  const color = (muscle: MuscleGroup) =>
    activeMuscles.includes(muscle) ? MUSCLE_COLORS[muscle] : '#1f2937'

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
        Muscles Worked
      </h4>
      <div className="flex gap-6 justify-center">
        {/* Front view */}
        <svg viewBox="0 0 80 160" width="80" height="160" className="overflow-visible">
          {/* Head */}
          <ellipse cx="40" cy="12" rx="10" ry="11" fill="#374151" />
          {/* Neck */}
          <rect x="35" y="22" width="10" height="6" rx="2" fill="#374151" />
          {/* Shoulders */}
          <ellipse cx="18" cy="38" rx="10" ry="8" fill={color('shoulders')} />
          <ellipse cx="62" cy="38" rx="10" ry="8" fill={color('shoulders')} />
          {/* Chest */}
          <ellipse cx="40" cy="42" rx="16" ry="12" fill={color('chest')} />
          {/* Core */}
          <rect x="28" y="54" width="24" height="20" rx="4" fill={color('core')} />
          {/* Biceps */}
          <ellipse cx="13" cy="54" rx="7" ry="10" fill={color('biceps')} />
          <ellipse cx="67" cy="54" rx="7" ry="10" fill={color('biceps')} />
          {/* Forearms */}
          <ellipse cx="10" cy="72" rx="5" ry="9" fill={color('forearms')} />
          <ellipse cx="70" cy="72" rx="5" ry="9" fill={color('forearms')} />
          {/* Quads */}
          <ellipse cx="31" cy="102" rx="10" ry="16" fill={color('quads')} />
          <ellipse cx="49" cy="102" rx="10" ry="16" fill={color('quads')} />
          {/* Calves front */}
          <ellipse cx="30" cy="135" rx="7" ry="11" fill={color('calves')} />
          <ellipse cx="50" cy="135" rx="7" ry="11" fill={color('calves')} />
          {/* Label */}
          <text x="40" y="157" textAnchor="middle" fill="#6b7280" fontSize="7">Front</text>
        </svg>

        {/* Back view */}
        <svg viewBox="0 0 80 160" width="80" height="160" className="overflow-visible">
          {/* Head */}
          <ellipse cx="40" cy="12" rx="10" ry="11" fill="#374151" />
          {/* Neck */}
          <rect x="35" y="22" width="10" height="6" rx="2" fill="#374151" />
          {/* Traps */}
          <ellipse cx="40" cy="32" rx="14" ry="7" fill={color('traps')} />
          {/* Shoulders back */}
          <ellipse cx="18" cy="38" rx="10" ry="8" fill={color('shoulders')} />
          <ellipse cx="62" cy="38" rx="10" ry="8" fill={color('shoulders')} />
          {/* Back */}
          <ellipse cx="40" cy="48" rx="16" ry="14" fill={color('back')} />
          {/* Lower back / core */}
          <rect x="28" y="60" width="24" height="14" rx="4" fill={color('core')} />
          {/* Triceps */}
          <ellipse cx="13" cy="54" rx="7" ry="10" fill={color('triceps')} />
          <ellipse cx="67" cy="54" rx="7" ry="10" fill={color('triceps')} />
          {/* Forearms */}
          <ellipse cx="10" cy="72" rx="5" ry="9" fill={color('forearms')} />
          <ellipse cx="70" cy="72" rx="5" ry="9" fill={color('forearms')} />
          {/* Glutes */}
          <ellipse cx="31" cy="86" rx="11" ry="9" fill={color('glutes')} />
          <ellipse cx="49" cy="86" rx="11" ry="9" fill={color('glutes')} />
          {/* Hamstrings */}
          <ellipse cx="31" cy="108" rx="10" ry="14" fill={color('hamstrings')} />
          <ellipse cx="49" cy="108" rx="10" ry="14" fill={color('hamstrings')} />
          {/* Calves back */}
          <ellipse cx="30" cy="135" rx="7" ry="11" fill={color('calves')} />
          <ellipse cx="50" cy="135" rx="7" ry="11" fill={color('calves')} />
          {/* Label */}
          <text x="40" y="157" textAnchor="middle" fill="#6b7280" fontSize="7">Back</text>
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
        {activeMuscles.map((m) => (
          <div key={m} className="flex items-center gap-1">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: MUSCLE_COLORS[m] }}
            />
            <span className="text-xs text-gray-400 capitalize">{m}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
