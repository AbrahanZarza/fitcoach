// ── Perfil del usuario ────────────────────────────────────────────────────────

export type Sexo = 'hombre' | 'mujer'

export type NivelActividad = 'sedentario' | 'ligero' | 'moderado' | 'activo' | 'muy_activo'

export type Objetivo = 'perder_grasa' | 'ganar_musculo' | 'recomposicion' | 'mantenimiento'

export type Entorno = 'gimnasio' | 'casa' | 'calistenia'

export type TipoRutina = 'auto' | 'full_body' | 'torso_pierna' | 'ppl' | 'grupos'

export interface Perfil {
  nombre: string
  edad: number
  sexo: Sexo
  alturaCm: number
  pesoKg: number
  actividad: NivelActividad
  objetivo: Objetivo
  entorno: Entorno
  diasEntreno: 1 | 2 | 3 | 4 | 5 | 6
  /** 4 = sin merienda · 5 = con merienda */
  comidasDia: 4 | 5
  rutina: TipoRutina
}

export interface Macros {
  kcal: number
  proteinaG: number
  grasaG: number
  carbosG: number
}

// ── Alimentos ─────────────────────────────────────────────────────────────────

export type CategoriaAlimento =
  | 'proteinas'
  | 'carbohidratos'
  | 'grasas'
  | 'verduras'
  | 'frutas'
  | 'lacteos'
  | 'legumbres'

export type Pasillo =
  | 'fruteria_verduleria'
  | 'carniceria'
  | 'pescaderia'
  | 'lacteos_huevos'
  | 'despensa'
  | 'panaderia'
  | 'congelados'

export interface UnidadCompra {
  singular: string
  plural: string
  /** gramos aproximados de una unidad */
  gramos: number
}

export interface Alimento {
  /** slug: también nombra su imagen en /images/foods/{id}.webp */
  id: string
  nombre: string
  categoria: CategoriaAlimento
  pasillo: Pasillo
  por100g: Macros
  /** unidad natural de compra (huevo, tomate, bote…); si falta, se compra a peso */
  unidad?: UnidadCompra
}

// ── Platos ────────────────────────────────────────────────────────────────────

export type Slot = 'desayuno' | 'comida' | 'merienda' | 'cena' | 'snack'

export interface Ingrediente {
  alimentoId: string
  gramos: number
}

export interface Plato {
  /** slug: también nombra su imagen en /images/dishes/{id}.webp */
  id: string
  nombre: string
  slots: Slot[]
  ingredientes: Ingrediente[]
}

// ── Ejercicios ────────────────────────────────────────────────────────────────

export type GrupoMuscular =
  | 'pecho'
  | 'espalda'
  | 'hombros'
  | 'biceps'
  | 'triceps'
  | 'cuadriceps'
  | 'femoral_gluteo'
  | 'gemelos'
  | 'core'

export interface Ejercicio {
  /** slug: también nombra su imagen en /images/exercises/{id}.webp */
  id: string
  nombre: string
  entornos: Entorno[]
  grupo: GrupoMuscular
  nivel: 1 | 2 | 3
  /** multiarticular: va primero en la sesión y con más series */
  compuesto: boolean
}

// ── Salidas del motor ─────────────────────────────────────────────────────────

export interface ComidaPlanificada {
  platoId: string
  /** factor de escala de la ración (0.75–1.75, pasos de 0.25) */
  racion: number
  macros: Macros
}

export interface DiaMenu {
  /** solo contiene los slots activos según comidasDia */
  comidas: Partial<Record<Slot, ComidaPlanificada>>
  totales: Macros
}

export interface MenuSemanal {
  inviable: false
  /** slots activos, en orden de día (según 4 o 5 comidas) */
  slots: Slot[]
  /** Lunes..Domingo */
  dias: DiaMenu[]
  objetivoDiario: Macros
  avisos: string[]
}

export interface Sugerencia {
  alimentoId: string
  /** nº de platos del slot bloqueado que se desbloquean al re-marcarlo */
  platosDesbloqueados: number
}

export interface MenuInviable {
  inviable: true
  slotsBloqueados: Slot[]
  sugerencias: Sugerencia[]
}

export type ResultadoMenu = MenuSemanal | MenuInviable

export interface EjercicioPlanificado {
  ejercicioId: string
  series: number
  repeticiones: string
  descansoSeg: number
}

export interface DiaEntreno {
  titulo: string
  ejercicios: EjercicioPlanificado[]
}

export interface RutinaSemanal {
  split: string
  dias: DiaEntreno[]
}

export interface ItemCompra {
  alimentoId: string
  gramosTotales: number
}

export interface SeccionCompra {
  pasillo: Pasillo
  items: ItemCompra[]
}

export type ListaCompra = SeccionCompra[]
