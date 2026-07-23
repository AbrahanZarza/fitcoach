import { useState } from 'react'

interface Props {
  tipo: 'foods' | 'exercises' | 'dishes'
  id: string
  alt: string
  /** fallback si la imagen no existe todavía */
  emoji: string
  className?: string
}

/** Ilustración de un alimento/plato/ejercicio con fallback a emoji. */
export function ItemImg({ tipo, id, alt, emoji, className = '' }: Props) {
  const [fallo, setFallo] = useState(false)
  if (fallo) {
    return (
      <div
        aria-hidden
        className={`flex items-center justify-center bg-white text-3xl ${className}`}
      >
        {emoji}
      </div>
    )
  }
  return (
    <img
      src={`${import.meta.env.BASE_URL}images/${tipo}/${id}.webp`}
      alt={alt}
      loading="lazy"
      onError={() => setFallo(true)}
      className={`object-cover ${className}`}
    />
  )
}
