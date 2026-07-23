import type { Alimento, ListaCompra, MenuSemanal, Pasillo } from '../types'
import { ALIMENTOS_POR_ID, PLATOS_POR_ID } from '../data'

export const ORDEN_PASILLOS: Pasillo[] = [
  'fruteria_verduleria',
  'carniceria',
  'pescaderia',
  'lacteos_huevos',
  'despensa',
  'panaderia',
  'congelados',
]

export const NOMBRE_PASILLO: Record<Pasillo, string> = {
  fruteria_verduleria: 'Frutería y verdulería',
  carniceria: 'Carnicería',
  pescaderia: 'Pescadería',
  lacteos_huevos: 'Lácteos y huevos',
  despensa: 'Despensa',
  panaderia: 'Panadería',
  congelados: 'Congelados',
}

/** Agrega los ingredientes de todo el menú semanal (escalados por ración)
 *  y los agrupa por pasillo de supermercado. */
export function generarListaCompra(menu: MenuSemanal): ListaCompra {
  const totales = new Map<string, number>()
  for (const dia of menu.dias) {
    for (const comida of Object.values(dia.comidas)) {
      if (!comida) continue
      const plato = PLATOS_POR_ID.get(comida.platoId)
      if (!plato) continue
      for (const ing of plato.ingredientes) {
        totales.set(
          ing.alimentoId,
          (totales.get(ing.alimentoId) ?? 0) + ing.gramos * comida.racion,
        )
      }
    }
  }

  const porPasillo = new Map<Pasillo, { alimentoId: string; gramosTotales: number }[]>()
  for (const [alimentoId, gramos] of totales) {
    const alimento = ALIMENTOS_POR_ID.get(alimentoId)
    if (!alimento) continue
    const items = porPasillo.get(alimento.pasillo) ?? []
    // Redondeo a múltiplos de 5 g: cantidades realistas para la compra.
    items.push({ alimentoId, gramosTotales: Math.round(gramos / 5) * 5 })
    porPasillo.set(alimento.pasillo, items)
  }

  return ORDEN_PASILLOS.filter((p) => porPasillo.has(p)).map((pasillo) => ({
    pasillo,
    items: (porPasillo.get(pasillo) ?? []).sort((x, y) => y.gramosTotales - x.gramosTotales),
  }))
}

/** Formatea gramos para mostrar: ≥1000 g → kilos con un decimal. */
export function formatearCantidad(gramos: number): string {
  if (gramos >= 1000) {
    const kg = Math.round(gramos / 100) / 10
    return `${kg.toLocaleString('es-ES')} kg`
  }
  return `${gramos} g`
}

/** Cantidad en unidades naturales de compra ("6 huevos", "2 botes")
 *  redondeando hacia arriba, o null si el alimento se compra a peso. */
export function formatearUnidades(alimento: Alimento, gramos: number): string | null {
  if (!alimento.unidad) return null
  const n = Math.max(1, Math.ceil(gramos / alimento.unidad.gramos))
  return `${n} ${n === 1 ? alimento.unidad.singular : alimento.unidad.plural}`
}
