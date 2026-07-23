import { describe, expect, it } from 'vitest'
import { ALIMENTOS, ALIMENTOS_POR_ID, EJERCICIOS, PLATOS } from '../../data'
import { macrosDePlato } from '../dishMacros'
import type { Entorno, GrupoMuscular, Slot } from '../../types'

const SLUG = /^[a-z0-9-]+$/

describe('integridad de alimentos', () => {
  it('ids únicos y en formato slug', () => {
    const ids = ALIMENTOS.map((a) => a.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) expect(id).toMatch(SLUG)
  })

  it('las kcal cuadran con los macros (Atwater ±15% o ±15 kcal)', () => {
    for (const a of ALIMENTOS) {
      const { kcal, proteinaG, grasaG, carbosG } = a.por100g
      const atwater = proteinaG * 4 + grasaG * 9 + carbosG * 4
      const diff = Math.abs(kcal - atwater)
      expect(
        diff <= 15 || diff / kcal <= 0.15,
        `${a.id}: kcal=${kcal} vs Atwater=${atwater.toFixed(0)}`,
      ).toBe(true)
    }
  })
})

describe('integridad de platos', () => {
  it('ids únicos, slug, y ≥1 slot', () => {
    const ids = PLATOS.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const p of PLATOS) {
      expect(p.id).toMatch(SLUG)
      expect(p.slots.length).toBeGreaterThan(0)
      expect(p.ingredientes.length).toBeGreaterThan(0)
    }
  })

  it('todos los ingredientes existen', () => {
    for (const p of PLATOS) {
      for (const ing of p.ingredientes) {
        expect(ALIMENTOS_POR_ID.has(ing.alimentoId), `${p.id} → ${ing.alimentoId}`).toBe(true)
        expect(ing.gramos).toBeGreaterThan(0)
      }
    }
  })

  it('cada slot tiene ≥6 platos', () => {
    const slots: Slot[] = ['desayuno', 'comida', 'merienda', 'cena', 'snack']
    for (const slot of slots) {
      const n = PLATOS.filter((p) => p.slots.includes(slot)).length
      expect(n, `slot ${slot}`).toBeGreaterThanOrEqual(6)
    }
  })

  it('hay ≥3 snacks con >15 g de proteína por ración', () => {
    const proteicos = PLATOS.filter(
      (p) => p.slots.includes('snack') && macrosDePlato(p).proteinaG > 15,
    )
    expect(proteicos.length).toBeGreaterThanOrEqual(3)
  })
})

describe('integridad de ejercicios', () => {
  it('ids únicos y en formato slug', () => {
    const ids = EJERCICIOS.map((e) => e.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) expect(id).toMatch(SLUG)
  })

  it('cada (grupo, entorno) tiene al menos un ejercicio', () => {
    const grupos: GrupoMuscular[] = [
      'pecho', 'espalda', 'hombros', 'biceps', 'triceps',
      'cuadriceps', 'femoral_gluteo', 'gemelos', 'core',
    ]
    const entornos: Entorno[] = ['gimnasio', 'casa', 'calistenia']
    for (const grupo of grupos) {
      for (const entorno of entornos) {
        const n = EJERCICIOS.filter(
          (e) => e.grupo === grupo && e.entornos.includes(entorno),
        ).length
        expect(n, `${grupo} en ${entorno}`).toBeGreaterThanOrEqual(1)
      }
    }
  })

  it('los grupos grandes tienen un compuesto en cada entorno', () => {
    const grandes: GrupoMuscular[] = ['pecho', 'espalda', 'hombros', 'cuadriceps', 'femoral_gluteo']
    const entornos: Entorno[] = ['gimnasio', 'casa', 'calistenia']
    for (const grupo of grandes) {
      for (const entorno of entornos) {
        const n = EJERCICIOS.filter(
          (e) => e.grupo === grupo && e.compuesto && e.entornos.includes(entorno),
        ).length
        expect(n, `compuesto de ${grupo} en ${entorno}`).toBeGreaterThanOrEqual(1)
      }
    }
  })
})
