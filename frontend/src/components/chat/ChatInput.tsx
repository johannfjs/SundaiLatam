import { useState } from 'react'
import type { ChatRequest } from '../../types'

interface ChatInputProps {
  onSubmit: (req: ChatRequest) => void
  onStop: () => void
  isStreaming: boolean
}

const GOAL_OPTIONS = [
  { value: 'hypertrophy', label: 'Hypertrophy' },
  { value: 'strength', label: 'Strength' },
  { value: 'olympic weightlifting', label: 'Olympic Weightlifting' },
]

const EQUIPMENT_OPTIONS = [
  'Barbell', 'Dumbbells', 'Cable machine', 'Smith machine',
  'Pull-up bar', 'Resistance bands', 'Kettlebells', 'Bodyweight only',
]

export function ChatInput({ onSubmit, onStop, isStreaming }: ChatInputProps) {
  const [goal, setGoal] = useState('hypertrophy')
  const [fitnessLevel, setFitnessLevel] = useState<ChatRequest['fitness_level']>('intermediate')
  const [equipment, setEquipment] = useState<string[]>(['Barbell', 'Dumbbells', 'Cable machine'])
  const [daysPerWeek, setDaysPerWeek] = useState(4)
  const [sessionMinutes, setSessionMinutes] = useState(60)
  const [injuries, setInjuries] = useState('')
  const [additionalContext, setAdditionalContext] = useState('')

  const toggleEquipment = (item: string) => {
    setEquipment((prev) =>
      prev.includes(item) ? prev.filter((e) => e !== item) : [...prev, item],
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      goal,
      fitness_level: fitnessLevel,
      equipment,
      days_per_week: daysPerWeek,
      session_minutes: sessionMinutes,
      injuries: injuries.split(',').map((s) => s.trim()).filter(Boolean),
      additional_context: additionalContext,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 overflow-y-auto">
      {/* Goal */}
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1">Primary Goal</label>
        <input
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="e.g. hypertrophy, strength, fat loss…"
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
          required
        />
      </div>

      {/* Fitness level */}
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1">Fitness Level</label>
        <div className="flex gap-2">
          {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setFitnessLevel(level)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-colors ${
                fitnessLevel === level
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Days per week + session length */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">
            Days / Week: <span className="text-white">{daysPerWeek}</span>
          </label>
          <input
            type="range"
            min={1}
            max={7}
            value={daysPerWeek}
            onChange={(e) => setDaysPerWeek(Number(e.target.value))}
            className="w-full accent-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">
            Session: <span className="text-white">{sessionMinutes} min</span>
          </label>
          <input
            type="range"
            min={20}
            max={180}
            step={10}
            value={sessionMinutes}
            onChange={(e) => setSessionMinutes(Number(e.target.value))}
            className="w-full accent-indigo-500"
          />
        </div>
      </div>

      {/* Equipment */}
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-2">Available Equipment</label>
        <div className="flex flex-wrap gap-2">
          {EQUIPMENT_OPTIONS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => toggleEquipment(item)}
              className={`px-3 py-1 rounded-full text-xs transition-colors ${
                equipment.includes(item)
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Injuries */}
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1">
          Injuries / Limitations <span className="text-gray-600">(comma separated)</span>
        </label>
        <input
          type="text"
          value={injuries}
          onChange={(e) => setInjuries(e.target.value)}
          placeholder="e.g. left knee, lower back…"
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
        />
      </div>

      {/* Additional context */}
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1">Additional Context</label>
        <textarea
          value={additionalContext}
          onChange={(e) => setAdditionalContext(e.target.value)}
          placeholder="e.g. training for powerlifting meet in 8 weeks, have competed before…"
          rows={3}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
        />
      </div>

      {/* Submit / Stop */}
      {isStreaming ? (
        <button
          type="button"
          onClick={onStop}
          className="w-full py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors"
        >
          Stop Generation
        </button>
      ) : (
        <button
          type="submit"
          className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors disabled:opacity-50"
        >
          Generate Routine
        </button>
      )}
    </form>
  )
}
