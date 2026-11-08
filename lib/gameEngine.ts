import type { Activity, ActivityType, Category, Intensity } from '../data/gameData.ts'

export type PlayStyle = 'presencial' | 'llamada'
export type GamePreset = 'amigos' | 'parejas' | 'fiesta' | 'personalizado'

export type GameFilters = {
  playStyle: PlayStyle
  preset: GamePreset
  intensity: Intensity | 'todas'
  categories: Category[]
  allowAdult: boolean
}

const presetCategories: Record<Exclude<GamePreset, 'personalizado'>, Category[]> = {
  amigos: ['personal', 'amistad', 'humor', 'imaginacion', 'creatividad'],
  parejas: ['romantico', 'personal', 'bienestar'],
  fiesta: ['humor', 'creatividad', 'imaginacion', 'amistad', 'llamada'],
}

export function filterActivities(all: Activity[], filters: GameFilters): Activity[] {
  return all.filter((activity) => {
    if (!filters.allowAdult && activity.intensity === 'picante') return false
    if (filters.intensity !== 'todas' && activity.intensity !== filters.intensity) return false
    if (filters.playStyle === 'llamada' && !activity.callFriendly) return false
    if (filters.preset !== 'personalizado' && !presetCategories[filters.preset].some((category) => activity.categories.includes(category))) return false
    if (filters.categories.length && !filters.categories.some((category) => activity.categories.includes(category))) return false
    return true
  })
}

export function remainingActivities(all: Activity[], used: string[], type: ActivityType): number {
  const usedIds = new Set(used)
  return all.filter((activity) => activity.type === type && !usedIds.has(activity.id)).length
}

export function pickActivity(all: Activity[], used: string[], type: ActivityType, random: () => number = Math.random): Activity | null {
  const usedIds = new Set(used)
  const pool = all.filter((activity) => activity.type === type && !usedIds.has(activity.id))
  if (!pool.length) return null
  const index = Math.min(pool.length - 1, Math.max(0, Math.floor(random() * pool.length)))
  return pool[index]
}

export function nextPlayerIndex(current: number, count: number): number {
  if (count <= 0) return 0
  return (current + 1) % count
}

export function randomPlayerIndex(current: number, count: number, random: () => number = Math.random): number {
  if (count <= 1) return 0
  const randomOther = Math.min(count - 2, Math.max(0, Math.floor(random() * (count - 1))))
  return randomOther >= current ? randomOther + 1 : randomOther
}

export function roundNumber(completedTurns: number, playerCount: number): number {
  return Math.floor(completedTurns / Math.max(1, playerCount)) + 1
}
