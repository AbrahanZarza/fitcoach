import type {
  ComidaPlanificada,
  DiaMenu,
  Macros,
  MenuInviable,
  Plato,
  ResultadoMenu,
  Slot,
  Sugerencia,
} from '../types'
import { PLATOS, PLATOS_POR_ID } from '../data'
import { escalarMacros, macrosDePlato, sumarMacros } from './dishMacros'
import { mulberry32, pickWeighted, type Rng } from './rng'

/** Slots activos en orden de día según el número de comidas elegido. */
export function slotsPara(comidasDia: 4 | 5): Slot[] {
  return comidasDia === 5
    ? ['desayuno', 'comida', 'merienda', 'cena', 'snack']
    : ['desayuno', 'comida', 'cena', 'snack']
}

/** Fracción de las kcal (y proteína) diarias que corresponde a cada slot. */
const REPARTO: Record<4 | 5, Partial<Record<Slot, number>>> = {
  4: { desayuno: 0.25, comida: 0.35, cena: 0.3, snack: 0.1 },
  5: { desayuno: 0.25, comida: 0.3, merienda: 0.1, cena: 0.25, snack: 0.1 },
}

export const NOMBRE_SLOT: Record<Slot, string> = {
  desayuno: 'Desayuno',
  comida: 'Comida',
  merienda: 'Merienda',
  cena: 'Cena',
  snack: 'Snack',
}

export const DIAS_SEMANA = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
]

const RACIONES = [0.5, 0.75, 1, 1.25, 1.5, 1.75]
const RACION_MIN = 0.5
const RACION_MAX = 1.75

/** Orden de planificación: primero los slots con más peso calórico; el snack
 *  se elige el último porque es la pieza de ajuste fino del día. */
const ORDEN_PLANIFICACION: Slot[] = ['comida', 'cena', 'desayuno', 'merienda', 'snack']

interface ModoSlot {
  maxUsosSemana: number
  permiteDiasConsecutivos: boolean
}

function mejorRacion(base: Macros, kcalTarget: number): number {
  let mejor = RACIONES[0]
  let mejorErr = Infinity
  for (const r of RACIONES) {
    const err = Math.abs(base.kcal * r - kcalTarget)
    if (err < mejorErr) {
      mejorErr = err
      mejor = r
    }
  }
  return mejor
}

function planificarComida(plato: Plato, kcalTarget: number): ComidaPlanificada {
  const base = macrosDePlato(plato)
  const racion = mejorRacion(base, kcalTarget)
  return { platoId: plato.id, racion, macros: escalarMacros(base, racion) }
}

/** Qué alimentos excluidos conviene re-marcar para desbloquear más platos de los slots dados. */
export function sugerirDesbloqueos(slotsBloqueados: Slot[], excluidos: Set<string>): Sugerencia[] {
  const unicos = new Map<string, number>()
  const frecuencia = new Map<string, number>()
  for (const slot of slotsBloqueados) {
    for (const plato of PLATOS.filter((p) => p.slots.includes(slot))) {
      const bloqueantes = [...new Set(plato.ingredientes.map((i) => i.alimentoId))].filter((id) =>
        excluidos.has(id),
      )
      for (const id of bloqueantes) {
        frecuencia.set(id, (frecuencia.get(id) ?? 0) + 1)
      }
      if (bloqueantes.length === 1) {
        unicos.set(bloqueantes[0], (unicos.get(bloqueantes[0]) ?? 0) + 1)
      }
    }
  }
  // Preferimos alimentos que por sí solos desbloquean platos; si ninguno lo
  // hace, sugerimos los bloqueantes más frecuentes.
  const fuente = unicos.size > 0 ? unicos : frecuencia
  return [...fuente.entries()]
    .map(([alimentoId, platosDesbloqueados]) => ({ alimentoId, platosDesbloqueados }))
    .sort((a, b) => b.platosDesbloqueados - a.platosDesbloqueados)
    .slice(0, 5)
}

export function generarMenuSemanal(
  objetivoDiario: Macros,
  excluidos: Set<string>,
  semilla: number,
  comidasDia: 4 | 5 = 5,
): ResultadoMenu {
  const slots = slotsPara(comidasDia)
  const reparto = REPARTO[comidasDia]
  const permitidos = PLATOS.filter((p) =>
    p.ingredientes.every((i) => !excluidos.has(i.alimentoId)),
  )
  const pool = {} as Record<Slot, Plato[]>
  for (const slot of slots) {
    pool[slot] = permitidos.filter((p) => p.slots.includes(slot))
  }

  const slotsBloqueados = slots.filter((s) => pool[s].length === 0)
  if (slotsBloqueados.length > 0) {
    const inviable: MenuInviable = {
      inviable: true,
      slotsBloqueados,
      sugerencias: sugerirDesbloqueos(slotsBloqueados, excluidos),
    }
    return inviable
  }

  const avisos: string[] = []
  const modo = {} as Record<Slot, ModoSlot>
  for (const slot of slots) {
    const n = pool[slot].length
    if (n >= 4) {
      modo[slot] = { maxUsosSemana: 2, permiteDiasConsecutivos: false }
    } else if (n >= 2) {
      modo[slot] = { maxUsosSemana: Math.ceil(7 / n), permiteDiasConsecutivos: true }
      avisos.push(
        `Variedad limitada en ${NOMBRE_SLOT[slot].toLowerCase()}: hay pocas opciones y se repetirán platos.`,
      )
    } else {
      modo[slot] = { maxUsosSemana: 7, permiteDiasConsecutivos: true }
      avisos.push(
        `Solo hay un plato disponible para ${NOMBRE_SLOT[slot].toLowerCase()}: se repetirá toda la semana.`,
      )
    }
  }

  const rng = mulberry32(semilla)
  const usosSemana = new Map<string, number>()
  const dias: DiaMenu[] = []
  let usadosAyer = new Set<string>()

  for (let dia = 0; dia < 7; dia++) {
    const comidas: Partial<Record<Slot, ComidaPlanificada>> = {}
    const usadosHoy = new Set<string>()

    for (const slot of ORDEN_PLANIFICACION.filter((s) => slots.includes(s))) {
      const kcalTarget = objetivoDiario.kcal * (reparto[slot] ?? 0)
      const protTarget = objetivoDiario.proteinaG * (reparto[slot] ?? 0)
      const elegido = elegirPlato(
        rng,
        pool[slot],
        modo[slot],
        kcalTarget,
        protTarget,
        usosSemana,
        usadosAyer,
        usadosHoy,
      )
      comidas[slot] = planificarComida(elegido, kcalTarget)
      usosSemana.set(elegido.id, (usosSemana.get(elegido.id) ?? 0) + 1)
      usadosHoy.add(elegido.id)
    }

    repararDia(comidas, slots, objetivoDiario, pool.snack, modo.snack, usosSemana, usadosHoy)

    const totales = sumarMacros(slots.map((s) => comidas[s]!.macros))
    const desvio = (totales.kcal - objetivoDiario.kcal) / objetivoDiario.kcal
    if (Math.abs(desvio) > 0.1) {
      const pct = Math.round(Math.abs(desvio) * 100)
      avisos.push(
        `El ${DIAS_SEMANA[dia].toLowerCase()} queda un ${pct}% por ${desvio > 0 ? 'encima' : 'debajo'} del objetivo de calorías.`,
      )
    }

    dias.push({ comidas, totales })
    usadosAyer = usadosHoy
  }

  return { inviable: false, slots, dias, objetivoDiario, avisos }
}

function elegirPlato(
  rng: Rng,
  poolSlot: Plato[],
  modo: ModoSlot,
  kcalTarget: number,
  protTarget: number,
  usosSemana: Map<string, number>,
  usadosAyer: Set<string>,
  usadosHoy: Set<string>,
): Plato {
  // Filtros de variedad con relajación progresiva: nunca nos quedamos sin candidatos.
  const filtros: ((p: Plato) => boolean)[] = [
    (p) =>
      !usadosHoy.has(p.id) &&
      (usosSemana.get(p.id) ?? 0) < modo.maxUsosSemana &&
      (modo.permiteDiasConsecutivos || !usadosAyer.has(p.id)),
    (p) => !usadosHoy.has(p.id) && (usosSemana.get(p.id) ?? 0) < modo.maxUsosSemana,
    (p) => !usadosHoy.has(p.id),
    () => true,
  ]
  let candidatos: Plato[] = []
  for (const filtro of filtros) {
    candidatos = poolSlot.filter(filtro)
    if (candidatos.length > 0) break
  }

  return pickWeighted(rng, candidatos, (p) => {
    const base = macrosDePlato(p)
    const racion = mejorRacion(base, kcalTarget)
    const errKcal = Math.abs(base.kcal * racion - kcalTarget) / kcalTarget
    const errProt = protTarget > 0 ? Math.abs(base.proteinaG * racion - protTarget) / protTarget : 0
    const score =
      errKcal +
      0.8 * errProt +
      0.35 * (usosSemana.get(p.id) ?? 0) +
      (usadosAyer.has(p.id) ? 0.25 : 0)
    return 1 / (0.1 + score)
  })
}

/** Ajusta el día para acercarlo al objetivo: reescala la comida principal y,
 *  si no basta, re-elige el snack como pieza de ajuste fino. */
function repararDia(
  comidas: Partial<Record<Slot, ComidaPlanificada>>,
  slots: Slot[],
  objetivo: Macros,
  poolSnack: Plato[],
  modoSnack: ModoSlot,
  usosSemana: Map<string, number>,
  usadosHoy: Set<string>,
) {
  const totalKcal = () => slots.reduce((s, slot) => s + comidas[slot]!.macros.kcal, 0)
  const totalProt = () => slots.reduce((s, slot) => s + comidas[slot]!.macros.proteinaG, 0)

  // 3a: reescalar la comida principal (la más calórica entre comida y cena)
  for (let i = 0; i < 2; i++) {
    const delta = totalKcal() - objetivo.kcal
    if (Math.abs(delta) <= objetivo.kcal * 0.05) break
    const principal: Slot =
      comidas.comida!.macros.kcal >= comidas.cena!.macros.kcal ? 'comida' : 'cena'
    const actual = comidas[principal]!
    const base = macrosDePlato(platoDe(actual.platoId))
    const paso = delta > 0 ? -0.25 : 0.25
    const nuevaRacion = Math.min(RACION_MAX, Math.max(RACION_MIN, actual.racion + paso))
    if (nuevaRacion === actual.racion) break
    comidas[principal] = {
      platoId: actual.platoId,
      racion: nuevaRacion,
      macros: escalarMacros(base, nuevaRacion),
    }
  }

  // 3b: si sigue fuera de ±10%, re-elegir el snack por argmin sobre el gap
  const fueraKcal = () => Math.abs(totalKcal() - objetivo.kcal) > objetivo.kcal * 0.1
  const bajaProteina = () => totalProt() < objetivo.proteinaG * 0.9
  if (fueraKcal() || bajaProteina()) {
    const snackActual = comidas.snack!
    const gapKcal = objetivo.kcal - (totalKcal() - snackActual.macros.kcal)
    const gapProt = objetivo.proteinaG - (totalProt() - snackActual.macros.proteinaG)
    // El reemplazo también respeta la variedad (con relajación si no hay candidatos):
    // sin esto, un mismo snack podría colarse 3+ veces por semana o repetirse en el día.
    const filtros: ((p: Plato) => boolean)[] = [
      (p) =>
        p.id === snackActual.platoId ||
        (!usadosHoy.has(p.id) && (usosSemana.get(p.id) ?? 0) < modoSnack.maxUsosSemana),
      (p) => p.id === snackActual.platoId || !usadosHoy.has(p.id),
      () => true,
    ]
    let candidatos: Plato[] = []
    for (const filtro of filtros) {
      candidatos = poolSnack.filter(filtro)
      if (candidatos.length > 0) break
    }
    let mejor = snackActual
    let mejorScore = scoreSnack(mejor.macros, gapKcal, gapProt, objetivo)
    for (const plato of candidatos) {
      const base = macrosDePlato(plato)
      for (const r of RACIONES) {
        const macros = escalarMacros(base, r)
        const score = scoreSnack(macros, gapKcal, gapProt, objetivo)
        if (score < mejorScore - 1e-9) {
          mejorScore = score
          mejor = { platoId: plato.id, racion: r, macros }
        }
      }
    }
    if (mejor.platoId !== snackActual.platoId) {
      usosSemana.set(snackActual.platoId, Math.max(0, (usosSemana.get(snackActual.platoId) ?? 1) - 1))
      usosSemana.set(mejor.platoId, (usosSemana.get(mejor.platoId) ?? 0) + 1)
      usadosHoy.delete(snackActual.platoId)
      usadosHoy.add(mejor.platoId)
    }
    comidas.snack = mejor
  }
}

function scoreSnack(macros: Macros, gapKcal: number, gapProt: number, objetivo: Macros): number {
  const errKcal = Math.abs(macros.kcal - gapKcal) / objetivo.kcal
  const errProt = Math.abs(macros.proteinaG - Math.max(0, gapProt)) / Math.max(1, objetivo.proteinaG)
  return errKcal + 0.8 * errProt
}

function platoDe(id: string): Plato {
  const plato = PLATOS_POR_ID.get(id)
  if (!plato) throw new Error(`Plato desconocido: ${id}`)
  return plato
}
