'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Check, ChevronRight, Clock3, Flame, Heart, Phone, Plus, RotateCcw, Save, Shuffle, Sparkles, Trash2, Users, X } from 'lucide-react'
import { activities, categories, intensities, type Activity, type ActivityType, type Category, type Intensity } from '@/data/gameData'
import { filterActivities, nextPlayerIndex, pickActivity, randomPlayerIndex, remainingActivities, roundNumber, type GamePreset, type PlayStyle } from '@/lib/gameEngine'

type Screen = 'home' | 'setup' | 'game'

export default function Page() {
  const [screen, setScreen] = useState<Screen>('home')
  const [players, setPlayers] = useState<string[]>([])
  const [newPlayer, setNewPlayer] = useState('')
  const [intensity, setIntensity] = useState<Intensity | 'todas'>('todas')
  const [playStyle, setPlayStyle] = useState<PlayStyle>('presencial')
  const [preset, setPreset] = useState<GamePreset>('amigos')
  const [adultConfirmed, setAdultConfirmed] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([])
  const [completedTurns, setCompletedTurns] = useState(0)
  const [seconds, setSeconds] = useState(30)
  const [timeLeft, setTimeLeft] = useState(30)
  const [timerRunning, setTimerRunning] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [turn, setTurn] = useState(0)
  const [current, setCurrent] = useState<Activity | null>(null)
  const [used, setUsed] = useState<string[]>([])
  const [notice, setNotice] = useState('')

  const filtered = useMemo(() => filterActivities(activities, { intensity, categories: selectedCategories, playStyle, preset, allowAdult: adultConfirmed }), [intensity, selectedCategories, playStyle, preset, adultConfirmed])
  const remaining = (type: ActivityType) => remainingActivities(filtered, used, type)
  const currentIsValid = current ? filtered.some((activity) => activity.id === current.id) : true
  const displayedCurrent = currentIsValid ? current : null

  useEffect(() => {
    try {
      const raw = localStorage.getItem('verdad-o-reto:v2')
      if (raw) {
        const saved = JSON.parse(raw) as Record<string, unknown>
        if (Array.isArray(saved.players)) setPlayers(saved.players.filter((p): p is string => typeof p === 'string').slice(0, 12))
        if (saved.playStyle === 'llamada' || saved.playStyle === 'presencial') setPlayStyle(saved.playStyle)
        if (saved.preset === 'amigos' || saved.preset === 'parejas' || saved.preset === 'fiesta' || saved.preset === 'personalizado') setPreset(saved.preset)
        if (saved.intensity === 'suave' || saved.intensity === 'divertido' || saved.intensity === 'coqueto' || saved.intensity === 'todas') setIntensity(saved.intensity)
        // La confirmación +18 siempre se restablece al abrir la aplicación.
        if (Array.isArray(saved.categories)) setSelectedCategories(saved.categories.filter((c): c is Category => categories.some((category) => category.id === c)))
        if (Array.isArray(saved.used)) setUsed(saved.used.filter((id): id is string => typeof id === 'string'))
        if (typeof saved.turn === 'number' && Number.isInteger(saved.turn) && saved.turn >= 0) setTurn(saved.turn)
        if (typeof saved.completedTurns === 'number' && Number.isInteger(saved.completedTurns) && saved.completedTurns >= 0) setCompletedTurns(saved.completedTurns)
        if (saved.screen === 'game' || saved.screen === 'setup') setScreen(saved.screen)
      }
    } catch { /* Partida anterior inválida; comenzar de cero. */ }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem('verdad-o-reto:v2', JSON.stringify({
        screen, players, playStyle, preset, intensity: intensity === 'picante' ? 'todas' : intensity,
        categories: selectedCategories, used, turn, completedTurns,
      }))
    } catch { /* El juego sigue funcionando si no hay almacenamiento. */ }
  }, [hydrated, screen, players, playStyle, preset, intensity, selectedCategories, used, turn, completedTurns])

  useEffect(() => {
    if (!timerRunning) return
    if (timeLeft <= 0) return
    const timer = window.setInterval(() => setTimeLeft((value) => Math.max(0, value - 1)), 1000)
    return () => window.clearInterval(timer)
  }, [timerRunning, timeLeft])

  function resetTimer() { setTimerRunning(false); setTimeLeft(seconds) }
  function nextTurn() { setCompletedTurns((value) => value + 1); if (players.length) setTurn((value) => nextPlayerIndex(value, players.length)); setCurrent(null); setNotice(''); resetTimer() }
  function spinPlayer() { if (players.length > 1) { setTurn((value) => randomPlayerIndex(value, players.length)); setCurrent(null); resetTimer() } }


  function addPlayer() { const name = newPlayer.trim().slice(0, 32); if (name && players.length < 12 && !players.some((p) => p.toLocaleLowerCase() === name.toLocaleLowerCase())) { setPlayers([...players, name]); setNewPlayer('') } }
  function draw(type: ActivityType) { const activity = pickActivity(filtered, used, type); if (!activity) { setCurrent(null); setNotice('No quedan actividades con estos filtros. Mezcla de nuevo o cambia la configuración.'); return } setCurrent(activity); setUsed((previous) => [...previous, activity.id]); setNotice(''); resetTimer() }
  function another() { if (displayedCurrent) draw(displayedCurrent.type) }
  function resetGame() { setCurrent(null); setUsed([]); setTurn(0); setCompletedTurns(0); setNotice(''); resetTimer(); setAdultConfirmed(false); setIntensity('todas'); setScreen('home') }
  function nextPlayer() { nextTurn() }
  function toggleCategory(category: Category) { setSelectedCategories(selectedCategories.includes(category) ? selectedCategories.filter((c) => c !== category) : [...selectedCategories, category]) }

  if (!hydrated) return <main className="app-shell"><div className="loading-state">Preparando tu partida…</div></main>

  if (screen === 'home') return <main className="app-shell"><div className="orb orb-one"/><div className="orb orb-two"/><header className="topbar"><div className="brand"><span className="brand-mark"><Sparkles data-icon="inline-start"/></span><span>verdad<span className="brand-accent">o</span>reto</span></div><span className="privacy-pill">Sin cuentas · Sin datos</span></header><section className="hero"><div className="hero-kicker"><Sparkles data-icon="inline-start"/> La excusa perfecta para conectar</div><h1>Verdad<br/><em>o reto</em></h1><p>Preguntas que acercan, retos que hacen reír<br className="desktop"/> y momentos para recordar.</p><button className="primary-cta" onClick={() => setScreen('setup')}>Comenzar a jugar <ChevronRight data-icon="inline-end"/></button><div className="feature-row"><span><Users data-icon="inline-start"/> Para grupos</span><span><Heart data-icon="inline-start"/> Sin presión</span><span><Phone data-icon="inline-start"/> También en llamada</span></div></section><div className="floating-card card-left"><span>✨</span><b>Tu turno</b><small>¡Que empiece la diversión!</small></div><div className="floating-card card-right"><Heart fill="currentColor"/><b>150 + 150</b><small>preguntas y retos originales</small></div><footer className="home-footer">Una invitación a pasarla bien, a tu manera.</footer></main>

  if (screen === 'setup') return <main className="app-shell inner"><header className="topbar"><button className="back-button" onClick={() => setScreen('home')}><ArrowLeft data-icon="inline-start"/> Volver</button><div className="brand"><span className="brand-mark"><Sparkles data-icon="inline-start"/></span><span>verdad<span className="brand-accent">o</span>reto</span></div><span className="step-label">1 / 2</span></header><section className="setup-grid"><div><div className="section-kicker">PREPAREMOS LA PARTIDA</div><div className="config-choice"><strong>¿Cómo van a jugar?</strong><div className="config-options"><button type="button" aria-pressed={playStyle === 'presencial'} className={playStyle === 'presencial' ? 'active' : ''} onClick={() => { setPlayStyle('presencial'); setCurrent(null) }}><Users data-icon="inline-start"/> Presencial</button><button type="button" aria-pressed={playStyle === 'llamada'} className={playStyle === 'llamada' ? 'active' : ''} onClick={() => { setPlayStyle('llamada'); setCurrent(null) }}><Phone data-icon="inline-start"/> Por llamada</button></div><p className="muted">{playStyle === 'llamada' ? 'Para jugar mientras hablan por WhatsApp, Meet o Discord. Una persona dirige la partida; no se crea una sala en línea.' : 'Para jugar todos juntos usando el mismo celular o computador.'}</p></div><div className="config-choice"><strong>Elige el ambiente</strong><div className="config-options">{([['amigos', 'Amigos'], ['parejas', 'Parejas'], ['fiesta', 'Fiesta'], ['personalizado', 'Personalizado']] as const).map(([id, label]) => <button key={id} type="button" className={preset === id ? 'active' : ''} aria-pressed={preset === id} onClick={() => { setPreset(id); setCurrent(null) }}>{label}</button>)}</div></div><h2>¿Quiénes están<br/><em>jugando?</em></h2><p className="muted">Añade nombres para llevar los turnos. También puedes jugar sin nombres.</p><div className="player-input"><input value={newPlayer} onChange={(e) => setNewPlayer(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) addPlayer() }} placeholder="Escribe un nombre..." aria-label="Nombre del participante"/><button onClick={addPlayer} aria-label="Añadir participante"><Plus/></button></div><div className="players-list">{players.map((player, index) => <div className="player-chip" key={`${player}-${index}`}><span>{player.charAt(0).toUpperCase()}</span>{player}<button onClick={() => { setPlayers(players.filter((_, i) => i !== index)); setTurn(0) }} aria-label={`Eliminar a ${player}`}><X/></button></div>)}</div>{!players.length && <div className="empty-players"><Users/><span>Sin nombres por ahora.<br/>El turno será libre.</span></div>}<button className="primary-cta setup-cta" onClick={() => setScreen('game')}>Continuar <ChevronRight data-icon="inline-end"/></button></div><aside className="setup-note"><div className="note-icon"><Heart fill="currentColor"/></div><h3>Jueguen a su manera</h3><p>Pasar siempre es una opción. Nadie tiene que explicar por qué no quiere responder o hacer un reto.</p><div className="note-line"/><span>+18 está desactivado al comenzar · Los nombres se guardan solo en este navegador.</span></aside></section></main>

  return <main className="app-shell inner game-screen"><header className="topbar"><button className="back-button" onClick={() => setScreen('setup')}><ArrowLeft data-icon="inline-start"/> Configuración</button><div className="brand"><span className="brand-mark"><Sparkles data-icon="inline-start"/></span><span>verdad<span className="brand-accent">o</span>reto</span></div><button className="reset-link" onClick={resetGame}><RotateCcw data-icon="inline-start"/> Reiniciar</button></header><section className="game-wrap"><div className="game-heading"><div><div className="section-kicker">RONDA {roundNumber(completedTurns, players.length)} · TURNO {completedTurns + 1}</div><h2>{players.length ? <><span className="turn-name">{players[turn % players.length]}</span>, es tu turno</> : <>Elige tu <em>destino</em></>}</h2></div><div className="counter-row"><span><b>{remaining('verdad')}</b> verdades</span><span><b>{remaining('reto')}</b> retos</span></div></div><div className="filter-bar"><div className="intensity-tabs">{intensities.filter((item) => item.id !== 'picante' || adultConfirmed).map((item) => <button key={item.id} className={intensity === item.id ? 'active' : ''} aria-pressed={intensity === item.id} onClick={() => { setIntensity(item.id); setCurrent(null); setNotice('') }}>{item.id === 'picante' && <Flame data-icon="inline-start"/>}{item.label}</button>)}</div><span className="mode-label">{playStyle === 'llamada' ? '📞 Por llamada' : '👥 Presencial'} · {preset}</span></div><div className="adult-control"><label><input type="checkbox" checked={adultConfirmed} onChange={(e) => { setAdultConfirmed(e.target.checked); if (!e.target.checked && intensity === 'picante') setIntensity('todas'); setCurrent(null) }}/> Confirmo que soy mayor de 18 años y quiero habilitar contenido picante</label></div><div className="category-row">{categories.map((cat) => <button key={cat.id} className={selectedCategories.includes(cat.id) ? 'selected' : ''} aria-pressed={selectedCategories.includes(cat.id)} onClick={() => { toggleCategory(cat.id); setCurrent(null) }}>{selectedCategories.includes(cat.id) && <Check data-icon="inline-start"/>}{cat.label}</button>)}</div>{notice && <div className="notice"><span>{notice}</span><button onClick={() => { setUsed([]); setNotice('') }}><Shuffle data-icon="inline-start"/> Mezclar</button></div>}{displayedCurrent ? <div className={`activity-card ${displayedCurrent.type}`}><div className="activity-top"><span className="activity-type">{displayedCurrent.type === 'verdad' ? 'VERDAD' : 'RETO'}</span><span className="activity-number">{displayedCurrent.id.replace('-', ' · ')}</span></div><p>{displayedCurrent.text}</p><div className="activity-actions"><button onClick={another}><Shuffle data-icon="inline-start"/> Otra actividad</button><button onClick={() => { nextTurn(); setNotice('Actividad pasada. Sin penalización.') }}><Trash2 data-icon="inline-start"/> Pasar</button><button className="next-button" onClick={nextPlayer}>{players.length ? 'Siguiente jugador' : 'Siguiente turno'} <ChevronRight data-icon="inline-end"/></button></div></div> : <div className="choose-card"><div className="choose-icon"><Sparkles/></div><h3>¿Verdad o reto?</h3><p>Elige una opción para recibir una actividad al azar.</p><div className="choice-buttons"><button className="truth" onClick={() => draw('verdad')}><span>VERDAD</span><small>Una pregunta para conectar</small></button><button className="dare" onClick={() => draw('reto')}><span>RETO</span><small>Algo para animar la ronda</small></button></div></div>}<div className="game-tools"><div className="timer-tool"><Clock3 size={17}/><span aria-live="polite">{String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}</span><select aria-label="Duración del temporizador" value={seconds} onChange={(e) => { const n = Number(e.target.value); setSeconds(n); setTimeLeft(n); setTimerRunning(false) }}><option value={15}>15 s</option><option value={30}>30 s</option><option value={60}>60 s</option></select><button onClick={() => setTimerRunning((running) => !running)}>{timerRunning ? 'Pausar' : 'Iniciar'}</button><button onClick={resetTimer}>Reiniciar tiempo</button></div>{players.length > 1 && <button className="spin-button" onClick={spinPlayer}><Shuffle size={16}/> Elegir jugador al azar</button>}</div><p className="respect-note"><Heart fill="currentColor" data-icon="inline-start"/> Puedes pasar cualquier actividad si no te sientes cómodo/a.</p></section></main>
}
