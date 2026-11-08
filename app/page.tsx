'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, ChevronRight, Clock3, Flame, Heart, Plus, RotateCcw, RotateCw, Shuffle, Sparkles, Trash2, Users, X } from 'lucide-react'
import { activities, categories, intensities, type Activity, type ActivityType, type Category, type Intensity } from '@/data/gameData'
import { gameCatalog, partyPrompts, type PartyPrompt, type SocialGameId } from '@/data/partyGames'
import { filterActivities, nextPlayerIndex, pickActivity, remainingActivities, roundNumber, type GamePreset, type PlayStyle } from '@/lib/gameEngine'
import { drawPartyPrompt, eligiblePartyPrompts, remainingPartyPrompts } from '@/lib/partyEngine'
import { ThemePicker, themeIds, type ThemeName } from '@/components/ThemePicker'
import { PlayerWheel } from '@/components/PlayerWheel'

type Screen = 'home' | 'setup' | 'game'
const presets: { id: GamePreset; label: string; emoji: string }[] = [
  { id: 'amigos', label: 'Amigos', emoji: '👥' },
  { id: 'parejas', label: 'Parejas', emoji: '💖' },
  { id: 'fiesta', label: 'Fiesta', emoji: '🎉' },
  { id: 'personalizado', label: 'Todos', emoji: '✨' },
]
const storedKey = 'verdad-o-reto:v2'
const savedThemes = 'verdad-o-reto:theme'

export default function Page() {
  const [hydrated, setHydrated] = useState(false)
  const [screen, setScreen] = useState<Screen>('home')
  const [theme, setTheme] = useState<ThemeName>('candy')
  const [gameId, setGameId] = useState<SocialGameId>('verdad-reto')
  const [players, setPlayers] = useState<string[]>([])
  const [newPlayer, setNewPlayer] = useState('')
  const [inputHint, setInputHint] = useState('')
  const [playStyle, setPlayStyle] = useState<PlayStyle>('presencial')
  const [preset, setPreset] = useState<GamePreset>('amigos')
  const [intensity, setIntensity] = useState<Intensity | 'todas'>('todas')
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([])
  const [adultConfirmed, setAdultConfirmed] = useState(false)
  const [turn, setTurn] = useState(0)
  const [completedTurns, setCompletedTurns] = useState(0)
  const [used, setUsed] = useState<string[]>([])
  const [current, setCurrent] = useState<Activity | null>(null)
  const [partyCurrent, setPartyCurrent] = useState<PartyPrompt | null>(null)
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>({})
  const [notice, setNotice] = useState('')
  const [wheelOpen, setWheelOpen] = useState(false)
  const [seconds, setSeconds] = useState(30)
  const [timeLeft, setTimeLeft] = useState(30)
  const [timerRunning, setTimerRunning] = useState(false)

  const filteredTruths = useMemo(() =>
    filterActivities(activities, { intensity, categories: selectedCategories, playStyle, preset, allowAdult: adultConfirmed }),
    [intensity, selectedCategories, playStyle, preset, adultConfirmed],
  )
  const filteredParty = useMemo(() =>
    gameId === 'verdad-reto' ? [] : eligiblePartyPrompts(partyPrompts, gameId, preset),
    [gameId, preset],
  )
  const displayedTruth = current && filteredTruths.some((activity) => activity.id === current.id) ? current : null
  const displayedParty = partyCurrent && filteredParty.some((prompt) => prompt.id === partyCurrent.id) ? partyCurrent : null
  const activeGame = gameCatalog.find((game) => game.id === gameId) ?? gameCatalog[0]
  const available = gameId === 'verdad-reto'
    ? remainingActivities(filteredTruths, used, 'verdad') + remainingActivities(filteredTruths, used, 'reto')
    : remainingPartyPrompts(filteredParty, used)

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(savedThemes)
      if (themeIds.some((id) => id === savedTheme)) setTheme(savedTheme as ThemeName)
      const raw = localStorage.getItem(storedKey)
      if (raw) {
        const saved = JSON.parse(raw) as Record<string, unknown>
        if (gameCatalog.some((game) => game.id === saved.gameId)) setGameId(saved.gameId as SocialGameId)
        if (Array.isArray(saved.players)) setPlayers(saved.players.filter((p): p is string => typeof p === 'string').slice(0, 12))
        if (saved.playStyle === 'presencial' || saved.playStyle === 'llamada') setPlayStyle(saved.playStyle)
        if (presets.some((item) => item.id === saved.preset)) setPreset(saved.preset as GamePreset)
        if (['todas', 'suave', 'divertido', 'coqueto'].includes(String(saved.intensity))) setIntensity(saved.intensity as Intensity | 'todas')
        if (Array.isArray(saved.categories)) setSelectedCategories(saved.categories.filter((cat): cat is Category => categories.some((c) => c.id === cat)))
        if (Array.isArray(saved.used)) setUsed(saved.used.filter((id): id is string => typeof id === 'string'))
        if (typeof saved.turn === 'number' && Number.isInteger(saved.turn) && saved.turn >= 0) setTurn(saved.turn)
        if (typeof saved.completedTurns === 'number' && Number.isInteger(saved.completedTurns) && saved.completedTurns >= 0) setCompletedTurns(saved.completedTurns)
        if (saved.screen === 'setup' || saved.screen === 'game') setScreen(saved.screen)
      }
    } catch { /* Un estado anterior inválido no impide jugar. */ }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try { localStorage.setItem(savedThemes, theme) } catch { /* Sin almacenamiento disponible. */ }
  }, [hydrated, theme])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(storedKey, JSON.stringify({
        screen, theme, gameId, players, playStyle, preset,
        intensity: intensity === 'picante' ? 'todas' : intensity,
        categories: selectedCategories, used, turn, completedTurns,
      }))
    } catch { /* El juego también funciona sin localStorage. */ }
  }, [hydrated, screen, theme, gameId, players, playStyle, preset, intensity, selectedCategories, used, turn, completedTurns])

  useEffect(() => {
    if (!timerRunning) return
    const interval = window.setInterval(() => setTimeLeft((time) => Math.max(0, time - 1)), 1000)
    return () => window.clearInterval(interval)
  }, [timerRunning])

  useEffect(() => { if (timeLeft === 0) setTimerRunning(false) }, [timeLeft])

  function resetTimer() { setTimerRunning(false); setTimeLeft(seconds) }
  function clearCard() {
    setCurrent(null)
    setPartyCurrent(null)
    setVoteCounts({})
    setNotice('')
    resetTimer()
  }
  function chooseGame(id: SocialGameId) {
    setGameId(id)
    setUsed([])
    setTurn(0)
    setCompletedTurns(0)
    clearCard()
    setScreen('setup')
  }
  function resetGame() {
    setScreen('home')
    setGameId('verdad-reto')
    setUsed([])
    setCompletedTurns(0)
    setTurn(0)
    setAdultConfirmed(false)
    setIntensity('todas')
    clearCard()
  }
  function nextTurn() {
    setCompletedTurns((value) => value + 1)
    setTurn((value) => nextPlayerIndex(value, players.length))
    clearCard()
  }
  function addPlayer() {
    const name = newPlayer.trim().slice(0, 32)
    if (!name) return
    if (players.length >= 12) { setInputHint('Puedes agregar hasta 12 jugadores.'); return }
    if (players.some((player) => player.toLocaleLowerCase() === name.toLocaleLowerCase())) {
      setInputHint('Ese nombre ya está en la partida.')
      return
    }
    setPlayers((previous) => [...previous, name])
    setNewPlayer('')
    setInputHint('')
  }
  function removePlayer(index: number) {
    setPlayers((previous) => previous.filter((_, i) => i !== index))
    setTurn(0)
  }
  function drawTruth(type: ActivityType) {
    const activity = pickActivity(filteredTruths, used, type)
    if (!activity) {
      clearCard()
      setNotice('Se acabaron las actividades de este tipo. Mezcla el mazo o cambia los filtros.')
      return
    }
    setUsed((previous) => [...previous, activity.id])
    setCurrent(activity)
    setPartyCurrent(null)
    setNotice('')
    resetTimer()
  }
  function drawSocial() {
    const next = drawPartyPrompt(filteredParty, used)
    if (!next) {
      clearCard()
      setNotice('Ya salieron todas las cartas de este juego. Mezcla el mazo para volver a jugar.')
      return
    }
    setUsed((previous) => [...previous, next.id])
    setPartyCurrent(next)
    setCurrent(null)
    setVoteCounts({})
    setNotice('')
    resetTimer()
  }
  function addVote(key: string) { setVoteCounts((previous) => ({ ...previous, [key]: (previous[key] || 0) + 1 })) }
  function mixCards() { setUsed([]); clearCard() }
  function setGamePreset(value: GamePreset) { setPreset(value); setUsed([]); clearCard() }
  function setGameStyle(value: PlayStyle) { setPlayStyle(value); setUsed([]); clearCard() }

  const themePicker = <ThemePicker theme={theme} onChange={setTheme}/>
  const logo = <div className="brand"><span className="brand-mark"><Sparkles size={19}/></span><span>juegos<span className="brand-accent">+</span></span></div>
  const appClass = 'app-shell theme-' + theme

  if (!hydrated) return <main className={appClass}><div className="loading-state">Preparando los juegos…</div></main>

  if (screen === 'home') return (
    <main className={appClass + ' hub-screen'}>
      {themePicker}
      <header className="topbar">{logo}<span className="privacy-pill">Sin cuentas · Gratis · A tu ritmo</span></header>
      <section className="hub-hero">
        <div className="hero-kicker"><Sparkles size={15}/> CONVIERTE CUALQUIER MOMENTO EN UNA HISTORIA</div>
        <h1>El juego <em>lo eligen ustedes.</em></h1>
        <p>Cuatro formas de reír, conversar y sorprenderse. Juega en persona o mientras estás en llamada.</p>
        <div className="hub-features"><span><Users size={16}/> Con amigos</span><span><Heart size={16}/> En pareja</span><span>📞 Por llamada</span></div>
      </section>
      <section className="hub-library" aria-labelledby="hub-heading">
        <div className="hub-library-head"><h2 id="hub-heading">¿Qué jugamos hoy?</h2><span>Elige un juego para comenzar</span></div>
        <div className="hub-grid">
          {gameCatalog.map((game, index) => (
            <button className={'hub-game-card game-accent-' + index} key={game.id} type="button" onClick={() => chooseGame(game.id)}>
              <span className="game-emoji" aria-hidden="true">{game.emoji}</span>
              <span className="hub-game-title">{game.title}</span>
              <span className="hub-game-desc">{game.description}</span>
              <span className="hub-game-action">Jugar ahora <ArrowRight size={17}/></span>
            </button>
          ))}
        </div>
        <p className="hub-note">El diseño se puede cambiar desde el botón <strong>Diseño</strong> en la esquina inferior derecha.</p>
      </section>
    </main>
  )

  if (screen === 'setup') return (
    <main className={appClass + ' inner'}>
      {themePicker}
      <header className="topbar">
        <button className="back-button" onClick={() => setScreen('home')}><ArrowLeft size={16}/> Juegos</button>
        {logo}<span className="step-label">Configurar partida</span>
      </header>
      <section className="setup-grid">
        <div className="setup-main">
          <span className="section-kicker">TU PRÓXIMA PARTIDA</span>
          <div className="setup-game-title"><span className="setup-game-emoji">{activeGame.emoji}</span><div><h1>{activeGame.title}</h1><p className="muted">{activeGame.description}</p></div></div>
          <div className="config-choice">
            <strong>¿Cómo van a jugar?</strong>
            <div className="config-options">
              <button type="button" className={playStyle === 'presencial' ? 'active' : ''} aria-pressed={playStyle === 'presencial'} onClick={() => setGameStyle('presencial')}><Users size={16}/> Presencial</button>
              <button type="button" className={playStyle === 'llamada' ? 'active' : ''} aria-pressed={playStyle === 'llamada'} onClick={() => setGameStyle('llamada')}>📞 Por llamada</button>
            </div>
            <p className="muted">{playStyle === 'llamada' ? 'Para jugar por WhatsApp, Meet o Discord. Una persona dirige las cartas o comparte su pantalla.' : 'Para quienes están juntos, utilizando un solo celular o computador.'}</p>
          </div>
          <div className="config-choice">
            <strong>Elige el ambiente</strong>
            <div className="config-options">
              {presets.map((item) => (
                <button type="button" key={item.id} className={preset === item.id ? 'active' : ''}
                  aria-pressed={preset === item.id} onClick={() => setGamePreset(item.id)}>{item.emoji} {item.label}</button>
              ))}
            </div>
          </div>
          <div className="setup-players-heading"><h2>¿Quiénes van a jugar?</h2><span>{players.length}/12</span></div>
          <p className="muted">Agrega nombres para turnos y ruleta. También puedes jugar sin registrarlos.</p>
          <div className="player-input">
            <input value={newPlayer} onChange={(e) => setNewPlayer(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) addPlayer() }}
              placeholder="Nombre del participante" maxLength={32} aria-label="Nombre del participante"/>
            <button type="button" onClick={addPlayer} aria-label="Añadir participante"><Plus size={20}/></button>
          </div>
          {inputHint && <p className="input-hint" role="status">{inputHint}</p>}
          <div className="players-list">
            {players.map((player, i) => (
              <div className="player-chip" key={i + '-' + player}><span>{player.charAt(0).toUpperCase()}</span>{player}
                <button type="button" onClick={() => removePlayer(i)} aria-label={'Eliminar a ' + player}><X size={15}/></button>
              </div>
            ))}
          </div>
          {!players.length && <div className="empty-players"><Users size={22}/><span>Sin nombres por ahora. El turno será libre.</span></div>}
          <button className="primary-cta setup-cta" onClick={() => { clearCard(); setScreen('game') }}>¡A jugar! <ChevronRight size={18}/></button>
        </div>
        <aside className="setup-note">
          <div className="note-icon"><Heart size={22}/></div>
          <h3>Sin presiones</h3>
          <p>Se vale pasar cualquier pregunta o reto. Todos deciden qué quieren compartir.</p>
          <div className="note-line"/>
          <span>Sin cuentas. Los nombres y ajustes de la partida se guardan solamente en este navegador.</span>
          <div className="note-line"/>
          <span>Para usar la ruleta agrega al menos dos nombres.</span>
        </aside>
      </section>
    </main>
  )

  return (
    <main className={appClass + ' inner game-screen'}>
      {themePicker}
      {wheelOpen && players.length > 1 && <PlayerWheel players={players} currentIndex={turn % players.length}
        onSelect={(index) => { setTurn(index); clearCard() }} onClose={() => setWheelOpen(false)}/>}
      <header className="topbar">
        <button className="back-button" onClick={() => { clearCard(); setScreen('setup') }}><ArrowLeft size={16}/> Configuración</button>
        {logo}
        <button className="reset-link" onClick={resetGame}><RotateCcw size={15}/> Juegos</button>
      </header>
      <section className="game-wrap social-play">
        <div className="game-heading social-heading">
          <div>
            <span className="section-kicker">{activeGame.emoji} {activeGame.title.toUpperCase()} · RONDA {roundNumber(completedTurns, players.length)}</span>
            <h2>{players.length ? <><span className="turn-name">{players[turn % players.length]}</span>, es tu turno</> : <>Que empiece <em>la diversión</em></>}</h2>
            <div className="mode-chips"><span>{playStyle === 'llamada' ? '📞 Por llamada' : '👥 Presencial'}</span><span>{presets.find((item) => item.id === preset)?.label}</span><span>{available} cartas restantes</span></div>
          </div>
        </div>
        {gameId === 'verdad-reto' && (
          <section aria-label="Filtros de verdad o reto">
            <div className="filter-bar">
              <div className="intensity-tabs">
                {intensities.filter((item) => item.id !== 'picante' || adultConfirmed).map((item) => (
                  <button key={item.id} type="button" className={intensity === item.id ? 'active' : ''}
                    aria-pressed={intensity === item.id} onClick={() => { setIntensity(item.id); clearCard() }}>
                    {item.id === 'picante' && <Flame size={14}/>} {item.label}
                  </button>
                ))}
              </div>
            </div>
            <details className="advanced-filters">
              <summary>Filtros y contenido +18</summary>
              <label className="adult-control">
                <input type="checkbox" checked={adultConfirmed} onChange={(e) => {
                  setAdultConfirmed(e.target.checked)
                  if (!e.target.checked && intensity === 'picante') setIntensity('todas')
                  clearCard()
                }}/>
                Soy mayor de 18 años y quiero habilitar contenido picante
              </label>
              <div className="category-row">
                {categories.map((cat) => <button key={cat.id} type="button" className={selectedCategories.includes(cat.id) ? 'selected' : ''}
                  aria-pressed={selectedCategories.includes(cat.id)}
                  onClick={() => { setSelectedCategories((before) => before.includes(cat.id) ? before.filter((c) => c !== cat.id) : [...before, cat.id]); clearCard() }}>
                  {selectedCategories.includes(cat.id) && <Check size={13}/>} {cat.label}
                </button>)}
              </div>
            </details>
          </section>
        )}

        {notice && <div className="notice" role="status"><span>{notice}</span><button onClick={mixCards}><Shuffle size={15}/> Mezclar de nuevo</button></div>}

        {gameId === 'verdad-reto' ? (
          displayedTruth ? (
            <article className={'play-card reveal-card ' + displayedTruth.type} key={displayedTruth.id}>
              <div className="play-card-top"><span className="play-type">{displayedTruth.type === 'verdad' ? '💬 VERDAD' : '⚡ RETO'}</span><span>#{displayedTruth.id.replace('-', '')}</span></div>
              <p className="play-prompt">{displayedTruth.text}</p>
              <div className="play-actions">
                <button type="button" onClick={() => drawTruth(displayedTruth.type)}><Shuffle size={16}/> Otra carta</button>
                <button type="button" onClick={nextTurn}><Trash2 size={16}/> Pasar</button>
                <button type="button" className="next-button" onClick={nextTurn}>Siguiente turno <ArrowRight size={16}/></button>
              </div>
            </article>
          ) : (
            <div className="play-card choice-panel">
              <span className="choice-sparkle">✦</span>
              <h3>¿Verdad o reto?</h3>
              <p>Elige una opción y deja que el juego te sorprenda.</p>
              <div className="choice-buttons">
                <button className="truth" disabled={remainingActivities(filteredTruths, used, 'verdad') === 0} onClick={() => drawTruth('verdad')}><span>VERDAD</span><small>Una pregunta para conectar</small></button>
                <button className="dare" disabled={remainingActivities(filteredTruths, used, 'reto') === 0} onClick={() => drawTruth('reto')}><span>RETO</span><small>Un desafío para divertirse</small></button>
              </div>
              {available === 0 && <button className="remix-link" onClick={mixCards}><Shuffle size={16}/> Mezclar el mazo</button>}
            </div>
          )
        ) : displayedParty ? (
          <article className="play-card reveal-card social-card" key={displayedParty.id}>
            <div className="play-card-top"><span className="play-type">{activeGame.emoji} {activeGame.title.toUpperCase()}</span><span>#{displayedParty.id}</span></div>
            {gameId === 'que-prefieres' ? (
              <>
                <h3 className="would-title">¿Qué prefieres?</h3>
                <p className="vote-instruction">Cada persona puede votar tocando su opción una vez.</p>
                <div className="either-grid">
                  <button className="either-choice option-a" onClick={() => addVote('A')}><span>A</span><strong>{displayedParty.optionA}</strong><small>{voteCounts.A || 0} votos</small></button>
                  <span className="either-or">O</span>
                  <button className="either-choice option-b" onClick={() => addVote('B')}><span>B</span><strong>{displayedParty.optionB}</strong><small>{voteCounts.B || 0} votos</small></button>
                </div>
              </>
            ) : (
              <>
                <p className="play-prompt">{displayedParty.text}</p>
                {gameId === 'yo-nunca' && <div className="participation-row">
                  <button className="participation-button" onClick={() => addVote('hice')}>🙋 Yo sí lo hice <strong>+1</strong></button>
                  <span>{voteCounts.hice || 0} personas dijeron que sí</span>
                </div>}
                {gameId === 'quien-probable' && (
                  <div className="who-votes">
                    <p>Voten tocando el nombre de quien crean que sería. Cada toque suma un voto.</p>
                    {players.length ? <div className="who-players">
                      {players.map((player, index) => (
                        <button key={index + '-' + player} onClick={() => addVote(String(index))} className="who-player">
                          <span>{player}</span><strong>{voteCounts[String(index)] || 0} votos</strong>
                        </button>
                      ))}
                    </div> : <p className="muted">Sin nombres: ¡digan en voz alta a quién elegirían!</p>}
                  </div>
                )}
              </>
            )}
            <div className="play-actions">
              <button type="button" onClick={drawSocial}><Shuffle size={16}/> Otra carta</button>
              <button type="button" onClick={nextTurn}><Trash2 size={16}/> Pasar</button>
              <button type="button" className="next-button" onClick={nextTurn}>Siguiente turno <ArrowRight size={16}/></button>
            </div>
          </article>
        ) : (
          <div className="play-card choice-panel">
            <span className="choice-sparkle">{activeGame.emoji}</span>
            <h3>{activeGame.title}</h3>
            <p>{activeGame.description}</p>
            <button className="primary-cta draw-button" disabled={available === 0} onClick={drawSocial}><Sparkles size={18}/> Sacar una carta <ArrowRight size={18}/></button>
            {available === 0 && <button className="remix-link" onClick={mixCards}><Shuffle size={16}/> Mezclar el mazo</button>}
          </div>
        )}

        <div className="game-tools">
          <div className="timer-tool">
            <Clock3 size={18}/><strong aria-live="off">{String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}</strong>
            <select aria-label="Segundos del temporizador" value={seconds} onChange={(e) => {
              const amount = Number(e.target.value)
              setSeconds(amount); setTimeLeft(amount); setTimerRunning(false)
            }}>
              <option value={15}>15 s</option><option value={30}>30 s</option><option value={60}>60 s</option>
            </select>
            <button onClick={() => setTimerRunning((running) => !running)} disabled={timeLeft === 0}>{timerRunning ? 'Pausar' : 'Iniciar'}</button>
            <button onClick={resetTimer}><RotateCw size={14}/> Reiniciar</button>
            {timeLeft === 0 && <span className="time-up" role="status">¡Tiempo!</span>}
          </div>
          {players.length > 1 && <button className="spin-button" onClick={() => setWheelOpen(true)}>🎡 Girar ruleta</button>}
        </div>
        <p className="respect-note"><Heart size={15}/> Se vale pasar. Lo importante es pasarla bien.</p>
      </section>
    </main>
  )
}
