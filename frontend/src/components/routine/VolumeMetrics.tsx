import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts'

interface VolumeMetricsProps {
  weeklyVolume: Record<string, number>
}

// Evidence-based minimum effective volume (MEV) landmarks (sets/week)
const MEV: Record<string, number> = {
  chest: 10,
  back: 10,
  shoulders: 8,
  biceps: 8,
  triceps: 8,
  quads: 10,
  hamstrings: 6,
  glutes: 8,
  calves: 8,
  core: 6,
}

const MUSCLE_COLORS: Record<string, string> = {
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

export function VolumeMetrics({ weeklyVolume }: VolumeMetricsProps) {
  const data = Object.entries(weeklyVolume)
    .filter(([, v]) => v > 0)
    .sort(([, a], [, b]) => b - a)
    .map(([muscle, sets]) => ({
      muscle: muscle.charAt(0).toUpperCase() + muscle.slice(0, 3),
      fullName: muscle,
      sets,
      mev: MEV[muscle] ?? 8,
    }))

  if (data.length === 0) return null

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
        Weekly Volume (sets)
      </h4>
      <div className="text-xs text-gray-600 flex items-center gap-1">
        <span className="inline-block w-6 border-t border-dashed border-orange-500" />
        MEV threshold
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <XAxis
            dataKey="muscle"
            tick={{ fill: '#6b7280', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#6b7280', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: 'rgba(99,102,241,0.08)' }}
            contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 8 }}
            labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName ?? ''}
            formatter={(value: number | undefined) => [`${value ?? 0} sets`, 'Volume'] as [string, string]}
            labelStyle={{ color: '#e2e8f0', fontSize: 12 }}
            itemStyle={{ color: '#a5b4fc', fontSize: 12 }}
          />
          <ReferenceLine y={10} stroke="#f97316" strokeDasharray="3 3" strokeOpacity={0.6} />
          <Bar dataKey="sets" radius={[4, 4, 0, 0]}>
            {data.map((entry) => (
              <Cell
                key={entry.fullName}
                fill={MUSCLE_COLORS[entry.fullName] ?? '#6366f1'}
                fillOpacity={entry.sets >= entry.mev ? 1 : 0.5}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
