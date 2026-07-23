import type { ReactNode } from 'react'

/** Tarjeta seleccionable grande, estilo pegatina. */
export function OpcionCard({
  seleccionada,
  onClick,
  emoji,
  titulo,
  descripcion,
  compacta = false,
}: {
  seleccionada: boolean
  onClick: () => void
  emoji: ReactNode
  titulo: string
  descripcion?: string
  compacta?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={seleccionada}
      className={`cursor-pointer rounded-2xl border-2 border-ink text-left transition-all ${
        compacta ? 'px-3 py-2' : 'p-4'
      } ${
        seleccionada
          ? 'bg-mandarina-suave shadow-sticker -rotate-1'
          : 'bg-white shadow-sticker-sm hover:-translate-y-0.5'
      }`}
    >
      <div className={compacta ? 'flex items-center gap-2' : 'flex flex-col gap-1'}>
        <span className={compacta ? 'text-xl' : 'text-3xl'} aria-hidden>
          {emoji}
        </span>
        <span className="font-display font-bold leading-tight">{titulo}</span>
        {descripcion && <span className="text-sm opacity-75">{descripcion}</span>}
      </div>
    </button>
  )
}
