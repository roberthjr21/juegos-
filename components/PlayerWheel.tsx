'use client'
import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, RotateCw, X } from 'lucide-react'
import { randomPlayerIndex } from '@/lib/gameEngine'
import { getWheelTargetRotation } from '@/lib/partyEngine'

type Props = { players: string[]; currentIndex: number; onSelect: (index: number) => void; onClose: () => void }
const wheelColors = ['var(--wheel-a)', 'var(--wheel-b)', 'var(--wheel-c)', 'var(--wheel-d)']

export function PlayerWheel({ players, currentIndex, onSelect, onClose }: Props) {
  const [rotation, setRotation] = useState(0)
  const [pending, setPending] = useState<number | null>(null)
  const [winner, setWinner] = useState<number | null>(null)
  const [spinning, setSpinning] = useState(false)
  const sector = 360 / Math.max(1, players.length)
  const gradient = useMemo(() => {
    const stops = players.map((_, i) => wheelColors[i % wheelColors.length] + ' ' + (i * sector).toFixed(4) + 'deg ' + ((i + 1) * sector).toFixed(4) + 'deg')
    return 'conic-gradient(' + stops.join(', ') + ')'
  }, [players, sector])

  useEffect(() => {
    if (!spinning || pending === null) return
    const timer = window.setTimeout(() => { setWinner(pending); setSpinning(false) }, 4000)
    return () => window.clearTimeout(timer)
  }, [spinning, pending])

  useEffect(() => {
    if (spinning) return
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', escape)
    return () => window.removeEventListener('keydown', escape)
  }, [spinning, onClose])

  function spin() {
    if (spinning || players.length < 2) return
    const next = randomPlayerIndex(currentIndex, players.length)
    setWinner(null)
    setPending(next)
    setRotation((previous) => getWheelTargetRotation(previous, next, players.length))
    setSpinning(true)
  }

  return (
    <div className="wheel-backdrop">
      <section className="wheel-panel" role="dialog" aria-modal="true" aria-label="Ruleta de jugadores">
        <div className="wheel-head">
          <div><span className="section-kicker">EL DESTINO DECIDE</span><h2>Ruleta de jugadores</h2></div>
          <button type="button" className="wheel-close" disabled={spinning} aria-label="Cerrar ruleta" onClick={onClose}><X size={20}/></button>
        </div>
        <p className="wheel-caption">Gira para elegir quién juega. La ruleta evita repetir inmediatamente al jugador actual.</p>
        <div className="wheel-stage">
          <div className="wheel-pointer" aria-hidden="true"/>
          <div className="wheel-face" style={{ background: gradient, transform: 'rotate(' + rotation + 'deg)' }}>
            {players.map((player, i) => {
              const angle = ((i + 0.5) * 2 * Math.PI) / players.length
              return (
                <span key={i + '-' + player} className="wheel-name"
                  style={{ left: (50 + 32 * Math.sin(angle)) + '%', top: (50 - 32 * Math.cos(angle)) + '%' }}
                  title={player}>
                  {player.length > 10 ? player.slice(0, 9) + '…' : player}
                </span>
              )
            })}
            <div className="wheel-center" aria-hidden="true">✦</div>
          </div>
        </div>
        <div aria-live="polite" className="wheel-result">
          {winner !== null ? <>🎉 ¡Le toca a <strong>{players[winner]}</strong>!</> : spinning ? 'Girando…' : '¿Quién será el siguiente?'}
        </div>
        {winner !== null ? (
          <button type="button" className="primary-cta wheel-cta" onClick={() => { onSelect(winner); onClose() }}>
            Continuar con {players[winner]} <ArrowRight size={18}/>
          </button>
        ) : (
          <button type="button" className="primary-cta wheel-cta" disabled={spinning || players.length < 2} onClick={spin}>
            <RotateCw size={18}/> {spinning ? 'Girando…' : 'Girar ruleta'}
          </button>
        )}
        <p className="wheel-footnote">Se necesitan al menos dos jugadores con nombre.</p>
      </section>
    </div>
  )
}
