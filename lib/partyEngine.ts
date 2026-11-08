import type { GamePreset } from './gameEngine.ts'
import type { PartyGameId, PartyPrompt } from '../data/partyGames.ts'

export function eligiblePartyPrompts(prompts: PartyPrompt[], game: PartyGameId, preset: GamePreset): PartyPrompt[] {
  return prompts.filter((prompt) =>
    prompt.game === game && (preset === 'personalizado' || prompt.audiences.includes(preset)),
  )
}

export function remainingPartyPrompts(prompts: PartyPrompt[], usedIds: string[]): number {
  const used = new Set(usedIds)
  return prompts.filter((prompt) => !used.has(prompt.id)).length
}

export function drawPartyPrompt(
  prompts: PartyPrompt[],
  usedIds: string[],
  random: () => number = Math.random,
): PartyPrompt | null {
  const used = new Set(usedIds)
  const pool = prompts.filter((prompt) => !used.has(prompt.id))
  if (!pool.length) return null
  const index = Math.max(0, Math.min(pool.length - 1, Math.floor(random() * pool.length)))
  return pool[index]
}

export function getWheelTargetRotation(currentRotation: number, selectedIndex: number, playerCount: number): number {
  if (playerCount <= 0 || selectedIndex < 0 || selectedIndex >= playerCount) return currentRotation
  const sector = 360 / playerCount
  const target = ((360 - (selectedIndex + 0.5) * sector) % 360 + 360) % 360
  const current = ((currentRotation % 360) + 360) % 360
  const difference = (target - current + 360) % 360
  return currentRotation + 360 * 5 + difference
}
