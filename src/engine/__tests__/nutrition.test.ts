import { describe, expect, it } from 'vitest'
import { calcularBMR, calcularKcalObjetivo, calcularObjetivoDiario, calcularTDEE } from '../nutrition'
import type { Perfil } from '../../types'

const base: Perfil = {
  nombre: 'Test',
  edad: 30,
  sexo: 'hombre',
  alturaCm: 180,
  pesoKg: 80,
  actividad: 'moderado',
  objetivo: 'mantenimiento',
  entorno: 'gimnasio',
  diasEntreno: 4,
  comidasDia: 5,
  rutina: 'auto',
}

describe('calcularBMR', () => {
  it('hombre 30a / 80 kg / 180 cm → 1780 kcal', () => {
    expect(calcularBMR(base)).toBe(1780)
  })

  it('mujer 30a / 60 kg / 165 cm → 1320 kcal', () => {
    expect(calcularBMR({ ...base, sexo: 'mujer', pesoKg: 60, alturaCm: 165 })).toBe(1320)
  })
})

describe('calcularTDEE', () => {
  it('aplica el factor de actividad', () => {
    expect(calcularTDEE(base)).toBe(Math.round(1780 * 1.55))
    expect(calcularTDEE({ ...base, actividad: 'sedentario' })).toBe(Math.round(1780 * 1.2))
  })
})

describe('calcularKcalObjetivo', () => {
  it('déficit del 20% (acotado a 500) al perder grasa', () => {
    const tdee = calcularTDEE(base)
    expect(calcularKcalObjetivo({ ...base, objetivo: 'perder_grasa' })).toBe(
      Math.round(tdee - Math.min(tdee * 0.2, 500)),
    )
  })

  it('nunca baja del suelo de seguridad (BMR × 1.1)', () => {
    const perfil: Perfil = { ...base, actividad: 'sedentario', objetivo: 'perder_grasa' }
    expect(calcularKcalObjetivo(perfil)).toBeGreaterThanOrEqual(Math.round(calcularBMR(perfil) * 1.1))
  })
})

describe('calcularObjetivoDiario', () => {
  it('los macros suman las kcal objetivo (±2%)', () => {
    for (const objetivo of ['perder_grasa', 'ganar_musculo', 'recomposicion', 'mantenimiento'] as const) {
      const m = calcularObjetivoDiario({ ...base, objetivo })
      const suma = m.proteinaG * 4 + m.grasaG * 9 + m.carbosG * 4
      expect(Math.abs(suma - m.kcal) / m.kcal, objetivo).toBeLessThanOrEqual(0.02)
    }
  })

  it('proteína según g/kg del objetivo', () => {
    expect(calcularObjetivoDiario({ ...base, objetivo: 'perder_grasa' }).proteinaG).toBe(176)
    expect(calcularObjetivoDiario({ ...base, objetivo: 'mantenimiento' }).proteinaG).toBe(128)
  })
})
