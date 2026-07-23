import { describe, expect, it } from 'vitest'
import { generarRutina } from '../workoutPlanner'
import { EJERCICIOS_POR_ID } from '../../data'
import type { Entorno, Perfil } from '../../types'

const base: Perfil = {
  nombre: 'Test',
  edad: 30,
  sexo: 'hombre',
  alturaCm: 180,
  pesoKg: 80,
  actividad: 'moderado',
  objetivo: 'ganar_musculo',
  entorno: 'gimnasio',
  diasEntreno: 4,
  comidasDia: 5,
  rutina: 'auto',
}

describe('generarRutina', () => {
  it('genera tantos días como diasEntreno', () => {
    for (const dias of [1, 2, 3, 4, 5, 6] as const) {
      const rutina = generarRutina({ ...base, diasEntreno: dias }, 42)
      expect(rutina.dias).toHaveLength(dias)
      for (const dia of rutina.dias) {
        expect(dia.ejercicios.length).toBeGreaterThanOrEqual(4)
      }
    }
  })

  it('en modo auto elige el split esperado según los días', () => {
    expect(generarRutina({ ...base, diasEntreno: 3 }, 1).split).toContain('Cuerpo completo')
    expect(generarRutina({ ...base, diasEntreno: 4 }, 1).split).toContain('Torso')
    expect(generarRutina({ ...base, diasEntreno: 6 }, 1).split).toContain('Push / Pull / Legs')
  })

  it('respeta el tipo de rutina elegido con cualquier número de días', () => {
    const ppl = generarRutina({ ...base, rutina: 'ppl', diasEntreno: 4 }, 1)
    expect(ppl.split).toBe('Push / Pull / Legs')
    expect(ppl.dias.map((d) => d.titulo)).toEqual([
      'Día 1 · Empuje (push)',
      'Día 2 · Tirón (pull)',
      'Día 3 · Pierna',
      'Día 4 · Empuje (push) B',
    ])

    const fb = generarRutina({ ...base, rutina: 'full_body', diasEntreno: 5 }, 1)
    expect(fb.split).toBe('Cuerpo completo')
    expect(fb.dias).toHaveLength(5)

    const tp = generarRutina({ ...base, rutina: 'torso_pierna', diasEntreno: 3 }, 1)
    expect(tp.dias.map((d) => d.titulo.includes('Torso') || d.titulo.includes('Pierna'))).toEqual([
      true, true, true,
    ])
  })

  it('la rutina Weider dedica cada día a un grupo', () => {
    const weider = generarRutina({ ...base, rutina: 'grupos', diasEntreno: 5 }, 1)
    expect(weider.split).toContain('Weider')
    expect(weider.dias.map((d) => d.titulo)).toEqual([
      'Día 1 · Pecho',
      'Día 2 · Espalda',
      'Día 3 · Pierna',
      'Día 4 · Hombros',
      'Día 5 · Brazos',
    ])
    // el día de pecho solo trabaja pecho, tríceps y core
    for (const ep of weider.dias[0].ejercicios) {
      const grupo = EJERCICIOS_POR_ID.get(ep.ejercicioId)!.grupo
      expect(['pecho', 'triceps', 'core']).toContain(grupo)
    }
  })

  it('la rutina Weider funciona en casa y calistenia (fallbacks sin fallar)', () => {
    for (const entorno of ['casa', 'calistenia'] as Entorno[]) {
      const rutina = generarRutina({ ...base, rutina: 'grupos', entorno, diasEntreno: 5 }, 3)
      for (const dia of rutina.dias) {
        expect(dia.ejercicios.length).toBeGreaterThanOrEqual(3)
      }
    }
  })

  it('respeta el entorno del usuario', () => {
    for (const entorno of ['gimnasio', 'casa', 'calistenia'] as Entorno[]) {
      const rutina = generarRutina({ ...base, entorno, diasEntreno: 4 }, 7)
      for (const dia of rutina.dias) {
        for (const ep of dia.ejercicios) {
          const ejercicio = EJERCICIOS_POR_ID.get(ep.ejercicioId)!
          expect(ejercicio.entornos, `${ejercicio.id} en ${entorno}`).toContain(entorno)
        }
      }
    }
  })

  it('es determinista', () => {
    expect(generarRutina(base, 42)).toEqual(generarRutina(base, 42))
  })

  it('aplica el esquema de series según el objetivo', () => {
    const hipertrofia = generarRutina({ ...base, objetivo: 'ganar_musculo' }, 42)
    expect(hipertrofia.dias[0].ejercicios[0].series).toBe(4)
    const definicion = generarRutina({ ...base, objetivo: 'perder_grasa' }, 42)
    expect(definicion.dias[0].ejercicios[0].series).toBe(3)
  })
})
