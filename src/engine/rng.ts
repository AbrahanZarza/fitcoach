/** PRNG determinista mulberry32: misma semilla → misma secuencia. */
export type Rng = () => number

export function mulberry32(seed: number): Rng {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Elige un elemento con probabilidad proporcional a su peso (> 0). */
export function pickWeighted<T>(rng: Rng, items: T[], pesoDe: (item: T) => number): T {
  if (items.length === 0) throw new Error('pickWeighted: lista vacía')
  const pesos = items.map(pesoDe)
  const total = pesos.reduce((s, p) => s + p, 0)
  let r = rng() * total
  for (let i = 0; i < items.length; i++) {
    r -= pesos[i]
    if (r <= 0) return items[i]
  }
  return items[items.length - 1]
}

export function shuffle<T>(rng: Rng, items: T[]): T[] {
  const copia = [...items]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia
}
