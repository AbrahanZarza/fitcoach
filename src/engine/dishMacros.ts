import type { Macros, Plato } from '../types'
import { ALIMENTOS_POR_ID } from '../data'

const cache = new Map<string, Macros>()

/** Macros de un plato para la ración base (factor 1.0), derivados de sus ingredientes. */
export function macrosDePlato(plato: Plato): Macros {
  const memo = cache.get(plato.id)
  if (memo) return memo
  const total: Macros = { kcal: 0, proteinaG: 0, grasaG: 0, carbosG: 0 }
  for (const ing of plato.ingredientes) {
    const alimento = ALIMENTOS_POR_ID.get(ing.alimentoId)
    if (!alimento) throw new Error(`Ingrediente desconocido: ${ing.alimentoId}`)
    const factor = ing.gramos / 100
    total.kcal += alimento.por100g.kcal * factor
    total.proteinaG += alimento.por100g.proteinaG * factor
    total.grasaG += alimento.por100g.grasaG * factor
    total.carbosG += alimento.por100g.carbosG * factor
  }
  const redondeado: Macros = {
    kcal: Math.round(total.kcal),
    proteinaG: Math.round(total.proteinaG * 10) / 10,
    grasaG: Math.round(total.grasaG * 10) / 10,
    carbosG: Math.round(total.carbosG * 10) / 10,
  }
  cache.set(plato.id, redondeado)
  return redondeado
}

export function escalarMacros(m: Macros, factor: number): Macros {
  return {
    kcal: Math.round(m.kcal * factor),
    proteinaG: Math.round(m.proteinaG * factor * 10) / 10,
    grasaG: Math.round(m.grasaG * factor * 10) / 10,
    carbosG: Math.round(m.carbosG * factor * 10) / 10,
  }
}

export function sumarMacros(lista: Macros[]): Macros {
  return {
    kcal: Math.round(lista.reduce((s, m) => s + m.kcal, 0)),
    proteinaG: Math.round(lista.reduce((s, m) => s + m.proteinaG, 0) * 10) / 10,
    grasaG: Math.round(lista.reduce((s, m) => s + m.grasaG, 0) * 10) / 10,
    carbosG: Math.round(lista.reduce((s, m) => s + m.carbosG, 0) * 10) / 10,
  }
}
