'use client'
import { useState } from 'react'
import { Check, Palette, X } from 'lucide-react'

export type ThemeName = 'neon' | 'pop' | 'midnight' | 'candy'
const themes: { id: ThemeName; name: string; description: string; colors: string[] }[] = [
  { id: 'neon', name: 'Neon Party', description: 'Oscuro y eléctrico', colors: ['#111126', '#8a4bff', '#f445a0'] },
  { id: 'pop', name: 'Party Pop', description: 'Alegre y colorido', colors: ['#fff1bb', '#ff6868', '#4869f0'] },
  { id: 'midnight', name: 'Midnight', description: 'Elegante y sobrio', colors: ['#111419', '#c5a174', '#f7f3ed'] },
  { id: 'candy', name: 'Candy Play', description: 'Suave y amigable', colors: ['#f6efff', '#8651df', '#f486a7'] },
]
export const themeIds = themes.map((theme) => theme.id)
export function ThemePicker({ theme, onChange }: { theme: ThemeName; onChange: (theme: ThemeName) => void }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="theme-dock">
      {open && (
        <div className="theme-popover" id="theme-options" role="group" aria-label="Diseños disponibles">
          <div className="theme-popover-heading">
            <strong>Elige tu estilo</strong>
            <button type="button" aria-label="Cerrar diseños" onClick={() => setOpen(false)}><X size={17}/></button>
          </div>
          <p>Prueba los cuatro diseños. Puedes cambiarlos cuando quieras.</p>
          <div className="theme-list">
            {themes.map((item) => (
              <button
                key={item.id} type="button"
                className={theme === item.id ? 'theme-option selected' : 'theme-option'}
                aria-pressed={theme === item.id}
                onClick={() => { onChange(item.id); setOpen(false) }}
              >
                <span className="theme-swatch" aria-hidden="true">{item.colors.map((color, i) => <span key={i} style={{ backgroundColor: color }}/>)}</span>
                <span className="theme-option-label"><strong>{item.name}</strong><small>{item.description}</small></span>
                {theme === item.id && <Check size={17}/>}
              </button>
            ))}
          </div>
        </div>
      )}
      <button className="theme-trigger" type="button" onClick={() => setOpen((value) => !value)}
        aria-expanded={open} aria-controls="theme-options" aria-label="Cambiar diseño de la página" title="Cambiar diseño">
        <Palette size={20} strokeWidth={2}/><span>Diseño</span>
      </button>
    </div>
  )
}
