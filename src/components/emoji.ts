import type { CategoriaAlimento, GrupoMuscular, Slot } from '../types'

export const EMOJI_CATEGORIA: Record<CategoriaAlimento, string> = {
  proteinas: '🍗',
  carbohidratos: '🍚',
  grasas: '🥑',
  verduras: '🥦',
  frutas: '🍓',
  lacteos: '🥛',
  legumbres: '🫘',
}

export const NOMBRE_CATEGORIA: Record<CategoriaAlimento, string> = {
  proteinas: 'Proteínas',
  carbohidratos: 'Carbohidratos',
  grasas: 'Grasas saludables',
  verduras: 'Verduras',
  frutas: 'Frutas',
  lacteos: 'Lácteos',
  legumbres: 'Legumbres',
}

export const EMOJI_SLOT: Record<Slot, string> = {
  desayuno: '🍳',
  comida: '🍽️',
  merienda: '🥪',
  cena: '🌙',
  snack: '🥜',
}

export const EMOJI_GRUPO: Record<GrupoMuscular, string> = {
  pecho: '💪',
  espalda: '🏋️',
  hombros: '🤸',
  biceps: '💪',
  triceps: '💪',
  cuadriceps: '🦵',
  femoral_gluteo: '🦵',
  gemelos: '🦵',
  core: '🧘',
}

export const NOMBRE_GRUPO: Record<GrupoMuscular, string> = {
  pecho: 'Pecho',
  espalda: 'Espalda',
  hombros: 'Hombros',
  biceps: 'Bíceps',
  triceps: 'Tríceps',
  cuadriceps: 'Cuádriceps',
  femoral_gluteo: 'Femoral y glúteo',
  gemelos: 'Gemelos',
  core: 'Core',
}
