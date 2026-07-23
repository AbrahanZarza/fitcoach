import type { ButtonHTMLAttributes, ReactNode } from 'react'

export function Sticker({
  children,
  className = '',
  tone = 'blanco',
}: {
  children: ReactNode
  className?: string
  tone?: 'blanco' | 'mandarina' | 'hoja' | 'frambuesa' | 'miel' | 'cielo'
}) {
  const fondos: Record<string, string> = {
    blanco: 'bg-white',
    mandarina: 'bg-mandarina-suave',
    hoja: 'bg-hoja-suave',
    frambuesa: 'bg-frambuesa-suave',
    miel: 'bg-miel-suave',
    cielo: 'bg-cielo-suave',
  }
  return (
    <div className={`rounded-2xl border-2 border-ink shadow-sticker ${fondos[tone]} ${className}`}>
      {children}
    </div>
  )
}

type BotonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variante?: 'primario' | 'secundario' | 'fantasma'
}

export function Boton({ variante = 'primario', className = '', ...props }: BotonProps) {
  const estilos: Record<string, string> = {
    primario:
      'bg-mandarina text-white border-2 border-ink shadow-sticker-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none',
    secundario:
      'bg-white text-ink border-2 border-ink shadow-sticker-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none',
    fantasma: 'bg-transparent text-ink underline underline-offset-4 hover:text-mandarina',
  }
  return (
    <button
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-2.5 font-display font-bold transition-all disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-0 ${estilos[variante]} ${className}`}
      {...props}
    />
  )
}

export function Etiqueta({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-block rounded-full border-2 border-ink px-2.5 py-0.5 text-xs font-bold ${className}`}
    >
      {children}
    </span>
  )
}
