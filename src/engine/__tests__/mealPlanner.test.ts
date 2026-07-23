import { describe, expect, it } from 'vitest'
import { generarMenuSemanal, slotsPara } from '../mealPlanner'
import { PLATOS, PLATOS_POR_ID } from '../../data'
import type { Macros, MenuSemanal } from '../../types'

const OBJETIVO: Macros = { kcal: 2200, proteinaG: 160, grasaG: 72, carbosG: 228 }

function menuValido(
  objetivo = OBJETIVO,
  excluidos = new Set<string>(),
  semilla = 42,
  comidasDia: 4 | 5 = 5,
): MenuSemanal {
  const resultado = generarMenuSemanal(objetivo, excluidos, semilla, comidasDia)
  if (resultado.inviable) throw new Error('El menú debería ser viable')
  return resultado
}

describe('generarMenuSemanal', () => {
  it('es determinista: misma semilla → mismo menú', () => {
    expect(menuValido()).toEqual(menuValido())
  })

  it('semillas distintas producen menús distintos', () => {
    const a = menuValido(OBJETIVO, new Set(), 1)
    const b = menuValido(OBJETIVO, new Set(), 2)
    expect(JSON.stringify(a.dias)).not.toBe(JSON.stringify(b.dias))
  })

  it('genera 7 días con 5 comidas (merienda incluida) por defecto', () => {
    const menu = menuValido()
    expect(menu.slots).toEqual(['desayuno', 'comida', 'merienda', 'cena', 'snack'])
    expect(menu.dias).toHaveLength(7)
    for (const dia of menu.dias) {
      for (const slot of menu.slots) expect(dia.comidas[slot]).toBeDefined()
    }
  })

  it('con 4 comidas no planifica merienda', () => {
    const menu = menuValido(OBJETIVO, new Set(), 42, 4)
    expect(menu.slots).toEqual(['desayuno', 'comida', 'cena', 'snack'])
    for (const dia of menu.dias) {
      expect(dia.comidas.merienda).toBeUndefined()
      for (const slot of menu.slots) expect(dia.comidas[slot]).toBeDefined()
    }
  })

  it('slotsPara refleja la configuración', () => {
    expect(slotsPara(5)).toContain('merienda')
    expect(slotsPara(4)).not.toContain('merienda')
  })

  it('con la BD completa, ≥6 de 7 días quedan dentro de ±10% de kcal (4 y 5 comidas)', () => {
    for (const comidasDia of [4, 5] as const) {
      for (const semilla of [1, 7, 42, 99, 1234]) {
        const menu = menuValido(OBJETIVO, new Set(), semilla, comidasDia)
        const dentro = menu.dias.filter(
          (d) => Math.abs(d.totales.kcal - OBJETIVO.kcal) / OBJETIVO.kcal <= 0.1,
        ).length
        expect(dentro, `semilla ${semilla}, ${comidasDia} comidas`).toBeGreaterThanOrEqual(6)
      }
    }
  })

  it('funciona con objetivos bajos y altos', () => {
    for (const kcal of [1500, 3000]) {
      const objetivo: Macros = { ...OBJETIVO, kcal, proteinaG: Math.round(kcal * 0.07) }
      const menu = menuValido(objetivo, new Set(), 5)
      const dentro = menu.dias.filter(
        (d) => Math.abs(d.totales.kcal - kcal) / kcal <= 0.1,
      ).length
      expect(dentro, `${kcal} kcal`).toBeGreaterThanOrEqual(5)
    }
  })

  it('nunca usa ingredientes excluidos', () => {
    const excluidos = new Set(['pechuga-pollo', 'huevo', 'tomate'])
    const menu = menuValido(OBJETIVO, excluidos, 42)
    for (const dia of menu.dias) {
      for (const slot of menu.slots) {
        const plato = PLATOS_POR_ID.get(dia.comidas[slot]!.platoId)!
        for (const ing of plato.ingredientes) {
          expect(excluidos.has(ing.alimentoId), `${plato.id} usa ${ing.alimentoId}`).toBe(false)
        }
      }
    }
  })

  it('en modo normal ningún plato aparece más de 2 veces', () => {
    const menu = menuValido()
    const usos = new Map<string, number>()
    for (const dia of menu.dias) {
      for (const slot of menu.slots) {
        const id = dia.comidas[slot]!.platoId
        usos.set(id, (usos.get(id) ?? 0) + 1)
      }
    }
    for (const [id, n] of usos) expect(n, id).toBeLessThanOrEqual(2)
  })

  it('degrada con aviso si solo queda un desayuno', () => {
    // Excluir ingredientes hasta dejar exactamente 1 desayuno disponible
    const desayunos = PLATOS.filter((p) => p.slots.includes('desayuno'))
    const superviviente = desayunos.find((p) => p.id === 'bol-requeson-arandanos')!
    const ingredientesSuperviviente = new Set(superviviente.ingredientes.map((i) => i.alimentoId))
    const excluidos = new Set<string>()
    for (const p of desayunos) {
      if (p.id === superviviente.id) continue
      const bloqueante = p.ingredientes.find((i) => !ingredientesSuperviviente.has(i.alimentoId))
      if (bloqueante) excluidos.add(bloqueante.alimentoId)
    }
    const resultado = generarMenuSemanal(OBJETIVO, excluidos, 42)
    expect(resultado.inviable).toBe(false)
    if (resultado.inviable) return
    const idsDesayuno = new Set(resultado.dias.map((d) => d.comidas.desayuno!.platoId))
    expect(idsDesayuno.size).toBeLessThanOrEqual(2)
    expect(resultado.avisos.some((a) => a.includes('desayuno'))).toBe(true)
  })

  it('devuelve inviable con sugerencias si un slot se queda sin platos', () => {
    // Excluir avena, pan integral, yogur y requesón bloquea todos los desayunos
    const excluidos = new Set(['avena', 'pan-integral', 'yogur-griego', 'requeson'])
    const resultado = generarMenuSemanal(OBJETIVO, excluidos, 42)
    expect(resultado.inviable).toBe(true)
    if (!resultado.inviable) return
    expect(resultado.slotsBloqueados).toContain('desayuno')
    expect(resultado.sugerencias.length).toBeGreaterThan(0)
    for (const s of resultado.sugerencias) {
      expect(excluidos.has(s.alimentoId)).toBe(true)
      expect(s.platosDesbloqueados).toBeGreaterThan(0)
    }
  })
})
