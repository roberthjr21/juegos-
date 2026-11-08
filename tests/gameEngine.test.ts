import test from 'node:test'
import assert from 'node:assert/strict'
import { filterActivities, nextPlayerIndex, pickActivity, randomPlayerIndex, remainingActivities, roundNumber } from '../lib/gameEngine.ts'
import type { Activity } from '../data/gameData.ts'

const examples: Activity[] = [
  { id: 'v-1', text: 'Una pregunta', type: 'verdad', intensity: 'suave', categories: ['amistad'], callFriendly: true },
  { id: 'r-1', text: 'Un reto presencial', type: 'reto', intensity: 'divertido', categories: ['humor'], callFriendly: false },
  { id: 'r-2', text: 'Un reto por llamada', type: 'reto', intensity: 'divertido', categories: ['llamada'], callFriendly: true },
  { id: 'v-2', text: 'Pregunta adultos', type: 'verdad', intensity: 'picante', categories: ['romantico'], callFriendly: true },
]

const defaults = { playStyle: 'presencial' as const, preset: 'personalizado' as const, intensity: 'todas' as const, categories: [], allowAdult: false }

test('contenido +18 excluido por defecto, incluso con Todas', () => {
  assert.deepEqual(filterActivities(examples, defaults).map((item) => item.id), ['v-1', 'r-1', 'r-2'])
})

test('contenido +18 solo aparece tras habilitarlo', () => {
  assert.equal(filterActivities(examples, { ...defaults, allowAdult: true }).length, 4)
  assert.deepEqual(filterActivities(examples, { ...defaults, intensity: 'picante', allowAdult: true }).map((item) => item.id), ['v-2'])
})

test('llamada excluye actividades que requieren presencia', () => {
  assert.deepEqual(filterActivities(examples, { ...defaults, playStyle: 'llamada' }).map((item) => item.id), ['v-1', 'r-2'])
})

test('filtros combinados y categorías funcionan', () => {
  assert.deepEqual(filterActivities(examples, { ...defaults, preset: 'parejas' }).map((item) => item.id), [])
  assert.deepEqual(filterActivities(examples, { ...defaults, categories: ['llamada'] }).map((item) => item.id), ['r-2'])
})

test('no repite actividades ya usadas y informa cuando se agotan', () => {
  assert.equal(pickActivity(examples, ['r-1'], 'reto', () => 0)?.id, 'r-2')
  assert.equal(pickActivity(examples, ['r-1', 'r-2'], 'reto'), null)
  assert.equal(remainingActivities(examples, ['r-1'], 'reto'), 1)
})

test('turnos y rondas no dependen del número de cartas extraídas', () => {
  assert.equal(nextPlayerIndex(2, 3), 0)
  assert.equal(roundNumber(0, 3), 1)
  assert.equal(roundNumber(2, 3), 1)
  assert.equal(roundNumber(3, 3), 2)
  assert.equal(randomPlayerIndex(1, 3, () => 0), 0)
  assert.equal(randomPlayerIndex(1, 3, () => 0.99), 2)
})
