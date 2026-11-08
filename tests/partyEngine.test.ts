import test from 'node:test'
import assert from 'node:assert/strict'
import { partyPrompts, gameCatalog } from '../data/partyGames.ts'
import { drawPartyPrompt, eligiblePartyPrompts, getWheelTargetRotation, remainingPartyPrompts } from '../lib/partyEngine.ts'

test('el catálogo contiene los cuatro juegos con nombres únicos', () => {
  assert.equal(gameCatalog.length, 4)
  assert.equal(new Set(gameCatalog.map((game) => game.id)).size, 4)
})

test('cada juego nuevo tiene suficientes actividades y no repite identificadores', () => {
  assert.equal(new Set(partyPrompts.map((prompt) => prompt.id)).size, partyPrompts.length)
  for (const id of ['yo-nunca', 'que-prefieres', 'quien-probable'] as const) {
    assert.ok(partyPrompts.filter((prompt) => prompt.game === id).length >= 30)
  }
  assert.ok(partyPrompts.filter((prompt) => prompt.game === 'que-prefieres').every((prompt) => !!prompt.optionA && !!prompt.optionB))
})

test('los filtros de ambiente mantienen juegos y preguntas compatibles', () => {
  for (const id of ['yo-nunca', 'que-prefieres', 'quien-probable'] as const) {
    const amigos = eligiblePartyPrompts(partyPrompts, id, 'amigos')
    const parejas = eligiblePartyPrompts(partyPrompts, id, 'parejas')
    const all = eligiblePartyPrompts(partyPrompts, id, 'personalizado')
    assert.ok(amigos.length > 0)
    assert.ok(parejas.length > 0)
    assert.ok(all.length >= amigos.length)
    assert.ok(amigos.every((prompt) => prompt.game === id && prompt.audiences.includes('amigos')))
  }
})

test('no repite cartas y detecta agotamiento por juego', () => {
  const pool = eligiblePartyPrompts(partyPrompts, 'yo-nunca', 'fiesta')
  const selected = drawPartyPrompt(pool, [], () => 0)
  assert.equal(selected?.id, pool[0].id)
  assert.equal(remainingPartyPrompts(pool, [pool[0].id]), pool.length - 1)
  assert.equal(drawPartyPrompt(pool, pool.map((prompt) => prompt.id)), null)
})

test('la ruleta alinea el centro del ganador con el indicador superior', () => {
  for (const players of [2, 3, 4, 7, 12]) {
    for (let i = 0; i < players; i++) {
      const final = getWheelTargetRotation(40, i, players)
      assert.ok(final > 40 + 360 * 4)
      const center = (i + 0.5) * (360 / players)
      const aligned = ((center + final) % 360 + 360) % 360
      assert.ok(Math.abs(aligned) < 1e-7 || Math.abs(aligned - 360) < 1e-7)
    }
  }
})
