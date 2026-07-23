import type { Macros, NivelActividad, Objetivo, Perfil } from '../types'

export const FACTORES_ACTIVIDAD: Record<NivelActividad, number> = {
  sedentario: 1.2,
  ligero: 1.375,
  moderado: 1.55,
  activo: 1.725,
  muy_activo: 1.9,
}

const PROTEINA_G_POR_KG: Record<Objetivo, number> = {
  perder_grasa: 2.2,
  ganar_musculo: 1.8,
  recomposicion: 2.0,
  mantenimiento: 1.6,
}

/** BMR según Mifflin-St Jeor. */
export function calcularBMR(perfil: Pick<Perfil, 'pesoKg' | 'alturaCm' | 'edad' | 'sexo'>): number {
  const base = 10 * perfil.pesoKg + 6.25 * perfil.alturaCm - 5 * perfil.edad
  return Math.round(base + (perfil.sexo === 'hombre' ? 5 : -161))
}

export function calcularTDEE(perfil: Perfil): number {
  return Math.round(calcularBMR(perfil) * FACTORES_ACTIVIDAD[perfil.actividad])
}

/** Calorías objetivo con ajuste por objetivo y suelo de seguridad (BMR × 1.1). */
export function calcularKcalObjetivo(perfil: Perfil): number {
  const bmr = calcularBMR(perfil)
  const tdee = calcularTDEE(perfil)
  let kcal: number
  switch (perfil.objetivo) {
    case 'perder_grasa':
      kcal = tdee - Math.min(tdee * 0.2, 500)
      break
    case 'ganar_musculo':
      kcal = tdee + Math.min(tdee * 0.1, 400)
      break
    case 'recomposicion':
      kcal = tdee * 0.9
      break
    case 'mantenimiento':
      kcal = tdee
      break
  }
  return Math.round(Math.max(kcal, bmr * 1.1))
}

/** Objetivo diario completo: kcal + reparto de macros. */
export function calcularObjetivoDiario(perfil: Perfil): Macros {
  const kcal = calcularKcalObjetivo(perfil)
  const proteinaG = Math.round(PROTEINA_G_POR_KG[perfil.objetivo] * perfil.pesoKg)
  let grasaG = Math.round(0.9 * perfil.pesoKg)
  let kcalRestantes = kcal - proteinaG * 4 - grasaG * 9
  if (kcalRestantes < 0) {
    grasaG = Math.round(0.6 * perfil.pesoKg)
    kcalRestantes = Math.max(0, kcal - proteinaG * 4 - grasaG * 9)
  }
  const carbosG = Math.round(kcalRestantes / 4)
  return { kcal, proteinaG, grasaG, carbosG }
}
