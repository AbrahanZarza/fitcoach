import { describe, expect, it } from 'vitest'
import {
  formatearCantidad,
  formatearUnidades,
  generarListaCompra,
  ORDEN_PASILLOS,
} from '../shoppingList'
import { generarMenuSemanal } from '../mealPlanner'
import { ALIMENTOS_POR_ID, PLATOS_POR_ID } from '../../data'
import type { Macros, MenuSemanal } from '../../types'

const OBJETIVO: Macros = { kcal: 2200, proteinaG: 160, grasaG: 72, carbosG: 228 }

function menu(): MenuSemanal {
  const r = generarMenuSemanal(OBJETIVO, new Set(), 42)
  if (r.inviable) throw new Error('menú inviable')
  return r
}

describe('generarListaCompra', () => {
  it('suma los gramos escalados por ración de toda la semana', () => {
    const m = menu()
    const lista = generarListaCompra(m)
    // recomputar a mano el total esperado de un alimento presente
    const esperado = new Map<string, number>()
    for (const dia of m.dias) {
      for (const comida of Object.values(dia.comidas)) {
        if (!comida) continue
        const plato = PLATOS_POR_ID.get(comida.platoId)!
        for (const ing of plato.ingredientes) {
          esperado.set(ing.alimentoId, (esperado.get(ing.alimentoId) ?? 0) + ing.gramos * comida.racion)
        }
      }
    }
    for (const seccion of lista) {
      for (const item of seccion.items) {
        const raw = esperado.get(item.alimentoId)!
        expect(item.gramosTotales).toBe(Math.round(raw / 5) * 5)
      }
    }
    // todos los alimentos esperados aparecen
    const enLista = new Set(lista.flatMap((s) => s.items.map((i) => i.alimentoId)))
    expect(enLista.size).toBe(esperado.size)
  })

  it('agrupa por pasillo y respeta el orden de supermercado', () => {
    const lista = generarListaCompra(menu())
    const indices = lista.map((s) => ORDEN_PASILLOS.indexOf(s.pasillo))
    expect([...indices].sort((a, b) => a - b)).toEqual(indices)
    for (const seccion of lista) {
      for (const item of seccion.items) {
        expect(ALIMENTOS_POR_ID.get(item.alimentoId)!.pasillo).toBe(seccion.pasillo)
      }
    }
  })
})

describe('formatearCantidad', () => {
  it('gramos por debajo de 1 kg', () => {
    expect(formatearCantidad(250)).toBe('250 g')
  })

  it('kilos con un decimal a partir de 1000 g', () => {
    expect(formatearCantidad(1250)).toBe('1,3 kg')
    expect(formatearCantidad(2000)).toBe('2 kg')
  })
})

describe('formatearUnidades', () => {
  it('convierte gramos a unidades naturales redondeando hacia arriba', () => {
    const huevo = ALIMENTOS_POR_ID.get('huevo')!
    expect(formatearUnidades(huevo, 660)).toBe('12 huevos')
    expect(formatearUnidades(huevo, 30)).toBe('1 huevo')
    const tomate = ALIMENTOS_POR_ID.get('tomate')!
    expect(formatearUnidades(tomate, 610)).toBe('5 tomates')
    const garbanzos = ALIMENTOS_POR_ID.get('garbanzos')!
    expect(formatearUnidades(garbanzos, 400)).toBe('1 bote')
  })

  it('devuelve null para alimentos que se compran a peso', () => {
    expect(formatearUnidades(ALIMENTOS_POR_ID.get('arroz-blanco')!, 500)).toBeNull()
    expect(formatearUnidades(ALIMENTOS_POR_ID.get('aceite-oliva')!, 300)).toBeNull()
  })
})
