import type {
  DiaEntreno,
  Ejercicio,
  EjercicioPlanificado,
  GrupoMuscular,
  Objetivo,
  Perfil,
  RutinaSemanal,
  TipoRutina,
} from '../types'
import { EJERCICIOS } from '../data'
import { mulberry32, pickWeighted, type Rng } from './rng'

interface Hueco {
  grupo: GrupoMuscular
  tipo: 'compuesto' | 'accesorio'
}

interface PlantillaDia {
  titulo: string
  huecos: Hueco[]
}

const c = (grupo: GrupoMuscular): Hueco => ({ grupo, tipo: 'compuesto' })
const a = (grupo: GrupoMuscular): Hueco => ({ grupo, tipo: 'accesorio' })

const FULL_BODY_A: PlantillaDia = {
  titulo: 'Cuerpo completo A',
  huecos: [c('cuadriceps'), c('pecho'), c('espalda'), c('hombros'), a('core'), a('gemelos')],
}
const FULL_BODY_B: PlantillaDia = {
  titulo: 'Cuerpo completo B',
  huecos: [c('femoral_gluteo'), c('espalda'), c('pecho'), a('biceps'), a('triceps'), a('core')],
}
const TORSO: PlantillaDia = {
  titulo: 'Torso',
  huecos: [c('pecho'), c('espalda'), c('hombros'), a('biceps'), a('triceps'), a('core')],
}
const PIERNA: PlantillaDia = {
  titulo: 'Pierna',
  huecos: [c('cuadriceps'), c('femoral_gluteo'), a('cuadriceps'), a('femoral_gluteo'), a('gemelos'), a('core')],
}
const EMPUJE: PlantillaDia = {
  titulo: 'Empuje (push)',
  huecos: [c('pecho'), c('hombros'), a('pecho'), a('triceps'), a('hombros')],
}
const TIRON: PlantillaDia = {
  titulo: 'Tirón (pull)',
  huecos: [c('espalda'), c('espalda'), a('biceps'), a('espalda'), a('core')],
}

// Días de rutina Weider (un grupo muscular protagonista por sesión)
const DIA_PECHO: PlantillaDia = {
  titulo: 'Pecho',
  huecos: [c('pecho'), c('pecho'), a('pecho'), a('triceps'), a('core')],
}
const DIA_ESPALDA: PlantillaDia = {
  titulo: 'Espalda',
  huecos: [c('espalda'), c('espalda'), a('espalda'), a('biceps'), a('core')],
}
const DIA_HOMBROS: PlantillaDia = {
  titulo: 'Hombros',
  huecos: [c('hombros'), c('hombros'), a('hombros'), a('gemelos'), a('core')],
}
const DIA_BRAZOS: PlantillaDia = {
  titulo: 'Brazos',
  huecos: [c('biceps'), a('triceps'), a('biceps'), a('triceps'), a('core')],
}

function conTitulo(plantilla: PlantillaDia, titulo: string): PlantillaDia {
  return { ...plantilla, titulo }
}

/** Cicla las plantillas base hasta cubrir los días pedidos, renombrando las
 *  repeticiones (Torso, Torso B…) para que cada sesión tenga identidad. */
function ciclar(base: PlantillaDia[], dias: number): PlantillaDia[] {
  const resultado: PlantillaDia[] = []
  const vueltas = new Map<string, number>()
  for (let i = 0; i < dias; i++) {
    const plantilla = base[i % base.length]
    const vuelta = vueltas.get(plantilla.titulo) ?? 0
    vueltas.set(plantilla.titulo, vuelta + 1)
    resultado.push(
      vuelta === 0 ? plantilla : conTitulo(plantilla, `${plantilla.titulo} ${'ABCDEF'[vuelta]}`),
    )
  }
  return resultado
}

const SPLIT_AUTO: Record<number, { nombre: string; dias: PlantillaDia[] }> = {
  1: { nombre: 'Cuerpo completo', dias: [FULL_BODY_A] },
  2: { nombre: 'Cuerpo completo', dias: [FULL_BODY_A, FULL_BODY_B] },
  3: {
    nombre: 'Cuerpo completo A/B/A',
    dias: [FULL_BODY_A, FULL_BODY_B, conTitulo(FULL_BODY_A, 'Cuerpo completo C')],
  },
  4: { nombre: 'Torso / Pierna', dias: ciclar([TORSO, PIERNA], 4) },
  5: {
    nombre: 'Empuje / Tirón / Pierna + Torso / Pierna',
    dias: [EMPUJE, TIRON, PIERNA, TORSO, conTitulo(PIERNA, 'Pierna B')],
  },
  6: { nombre: 'Push / Pull / Legs ×2', dias: ciclar([EMPUJE, TIRON, PIERNA], 6) },
}

function elegirSplit(rutina: TipoRutina, dias: number): { nombre: string; dias: PlantillaDia[] } {
  switch (rutina) {
    case 'auto':
      return SPLIT_AUTO[dias]
    case 'full_body':
      return { nombre: 'Cuerpo completo', dias: ciclar([FULL_BODY_A, FULL_BODY_B], dias) }
    case 'torso_pierna':
      return { nombre: 'Torso / Pierna', dias: ciclar([TORSO, PIERNA], dias) }
    case 'ppl':
      return { nombre: 'Push / Pull / Legs', dias: ciclar([EMPUJE, TIRON, PIERNA], dias) }
    case 'grupos':
      return {
        nombre: 'Weider (por grupos musculares)',
        dias: ciclar([DIA_PECHO, DIA_ESPALDA, PIERNA, DIA_HOMBROS, DIA_BRAZOS], dias),
      }
  }
}

interface Esquema {
  compuesto: { series: number; repeticiones: string; descansoSeg: number }
  accesorio: { series: number; repeticiones: string; descansoSeg: number }
}

const ESQUEMAS: Record<Objetivo, Esquema> = {
  ganar_musculo: {
    compuesto: { series: 4, repeticiones: '6-10', descansoSeg: 150 },
    accesorio: { series: 3, repeticiones: '8-12', descansoSeg: 90 },
  },
  recomposicion: {
    compuesto: { series: 4, repeticiones: '6-10', descansoSeg: 150 },
    accesorio: { series: 3, repeticiones: '8-12', descansoSeg: 90 },
  },
  perder_grasa: {
    compuesto: { series: 3, repeticiones: '8-12', descansoSeg: 120 },
    accesorio: { series: 3, repeticiones: '12-15', descansoSeg: 60 },
  },
  mantenimiento: {
    compuesto: { series: 3, repeticiones: '8-12', descansoSeg: 120 },
    accesorio: { series: 3, repeticiones: '12-15', descansoSeg: 60 },
  },
}

/** En calistenia los ejercicios sin lastre se llevan cerca del fallo. */
function repeticionesPara(ejercicio: Ejercicio, perfil: Perfil, base: string): string {
  if (perfil.entorno !== 'gimnasio' && ejercicio.nivel === 1) return 'AMRAP'
  return base
}

export function generarRutina(perfil: Perfil, semilla: number): RutinaSemanal {
  const split = elegirSplit(perfil.rutina, perfil.diasEntreno)
  const esquema = ESQUEMAS[perfil.objetivo]
  const pool = EJERCICIOS.filter((e) => e.entornos.includes(perfil.entorno))
  // Semilla desplazada para que la rutina no quede acoplada al menú.
  const rng = mulberry32(semilla + 7919)

  const usosSemana = new Map<string, number>()
  const dias: DiaEntreno[] = split.dias.map((plantilla, i) => {
    const usadosHoy = new Set<string>()
    const ejercicios: EjercicioPlanificado[] = []
    for (const hueco of plantilla.huecos) {
      const elegido = elegirEjercicio(rng, pool, hueco, usosSemana, usadosHoy)
      if (!elegido) continue // hueco sin candidato en este entorno: se omite
      usadosHoy.add(elegido.id)
      usosSemana.set(elegido.id, (usosSemana.get(elegido.id) ?? 0) + 1)
      const base = hueco.tipo === 'compuesto' ? esquema.compuesto : esquema.accesorio
      ejercicios.push({
        ejercicioId: elegido.id,
        series: base.series,
        repeticiones: repeticionesPara(elegido, perfil, base.repeticiones),
        descansoSeg: base.descansoSeg,
      })
    }
    return { titulo: `Día ${i + 1} · ${plantilla.titulo}`, ejercicios }
  })

  return { split: split.nombre, dias }
}

function elegirEjercicio(
  rng: Rng,
  pool: Ejercicio[],
  hueco: Hueco,
  usosSemana: Map<string, number>,
  usadosHoy: Set<string>,
): Ejercicio | null {
  const delGrupo = pool.filter((e) => e.grupo === hueco.grupo && !usadosHoy.has(e.id))
  // Preferencia estricta por el tipo pedido; si no hay, vale el otro tipo del
  // mismo grupo (p. ej. accesorio de femoral en casa).
  const preferidos = delGrupo.filter((e) => e.compuesto === (hueco.tipo === 'compuesto'))
  const candidatosBase = preferidos.length > 0 ? preferidos : delGrupo
  if (candidatosBase.length === 0) return null

  // Máximo 2 usos semanales por ejercicio; si el filtro vacía la lista, se relaja.
  const frescos = candidatosBase.filter((e) => (usosSemana.get(e.id) ?? 0) < 2)
  const candidatos = frescos.length > 0 ? frescos : candidatosBase

  return pickWeighted(rng, candidatos, (e) => 1 / (1 + 2 * (usosSemana.get(e.id) ?? 0)))
}
