import type { Alimento, Ejercicio, Plato } from '../types'
import { ALIMENTOS } from './foods'
import { EJERCICIOS } from './exercises'
import { PLATOS } from './dishes'

export { ALIMENTOS, EJERCICIOS, PLATOS }

export const ALIMENTOS_POR_ID: Map<string, Alimento> = new Map(
  ALIMENTOS.map((a) => [a.id, a]),
)

export const PLATOS_POR_ID: Map<string, Plato> = new Map(PLATOS.map((p) => [p.id, p]))

export const EJERCICIOS_POR_ID: Map<string, Ejercicio> = new Map(
  EJERCICIOS.map((e) => [e.id, e]),
)
