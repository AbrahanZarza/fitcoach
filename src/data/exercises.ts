import type { Ejercicio } from '../types'

export const EJERCICIOS: Ejercicio[] = [
  // ── Pecho ──────────────────────────────────────────────────────────────────
  { id: 'press-banca', nombre: 'Press de banca', entornos: ['gimnasio'], grupo: 'pecho', nivel: 2, compuesto: true },
  { id: 'press-inclinado-mancuernas', nombre: 'Press inclinado con mancuernas', entornos: ['gimnasio'], grupo: 'pecho', nivel: 2, compuesto: true },
  { id: 'aperturas-polea', nombre: 'Aperturas en polea', entornos: ['gimnasio'], grupo: 'pecho', nivel: 1, compuesto: false },
  { id: 'fondos-paralelas', nombre: 'Fondos en paralelas', entornos: ['gimnasio', 'calistenia'], grupo: 'pecho', nivel: 2, compuesto: true },
  { id: 'flexiones', nombre: 'Flexiones', entornos: ['casa', 'calistenia'], grupo: 'pecho', nivel: 1, compuesto: true },
  { id: 'flexiones-declinadas', nombre: 'Flexiones declinadas', entornos: ['casa', 'calistenia'], grupo: 'pecho', nivel: 2, compuesto: true },
  { id: 'flexiones-arqueras', nombre: 'Flexiones arqueras', entornos: ['casa', 'calistenia'], grupo: 'pecho', nivel: 3, compuesto: true },

  // ── Espalda ────────────────────────────────────────────────────────────────
  { id: 'dominadas', nombre: 'Dominadas', entornos: ['gimnasio', 'calistenia'], grupo: 'espalda', nivel: 2, compuesto: true },
  { id: 'jalon-al-pecho', nombre: 'Jalón al pecho', entornos: ['gimnasio'], grupo: 'espalda', nivel: 1, compuesto: true },
  { id: 'remo-barra', nombre: 'Remo con barra', entornos: ['gimnasio'], grupo: 'espalda', nivel: 2, compuesto: true },
  { id: 'remo-mancuerna', nombre: 'Remo con mancuerna', entornos: ['gimnasio'], grupo: 'espalda', nivel: 1, compuesto: true },
  { id: 'remo-invertido', nombre: 'Remo invertido', entornos: ['casa', 'calistenia'], grupo: 'espalda', nivel: 2, compuesto: true },
  { id: 'remo-toalla', nombre: 'Remo con toalla en puerta', entornos: ['casa'], grupo: 'espalda', nivel: 1, compuesto: true },
  { id: 'superman', nombre: 'Superman lumbar', entornos: ['casa', 'calistenia'], grupo: 'espalda', nivel: 1, compuesto: false },
  { id: 'face-pull', nombre: 'Face pull en polea', entornos: ['gimnasio'], grupo: 'espalda', nivel: 1, compuesto: false },

  // ── Hombros ────────────────────────────────────────────────────────────────
  { id: 'press-militar', nombre: 'Press militar con barra', entornos: ['gimnasio'], grupo: 'hombros', nivel: 2, compuesto: true },
  { id: 'press-hombro-mancuernas', nombre: 'Press de hombro con mancuernas', entornos: ['gimnasio'], grupo: 'hombros', nivel: 1, compuesto: true },
  { id: 'elevaciones-laterales', nombre: 'Elevaciones laterales', entornos: ['gimnasio'], grupo: 'hombros', nivel: 1, compuesto: false },
  { id: 'pike-push-ups', nombre: 'Flexiones pike', entornos: ['casa', 'calistenia'], grupo: 'hombros', nivel: 2, compuesto: true },
  { id: 'flexiones-vertical', nombre: 'Flexiones verticales en pared', entornos: ['calistenia'], grupo: 'hombros', nivel: 3, compuesto: true },
  { id: 'elevaciones-laterales-botellas', nombre: 'Elevaciones laterales con botellas', entornos: ['casa'], grupo: 'hombros', nivel: 1, compuesto: false },

  // ── Bíceps ─────────────────────────────────────────────────────────────────
  { id: 'curl-biceps-barra', nombre: 'Curl de bíceps con barra', entornos: ['gimnasio'], grupo: 'biceps', nivel: 1, compuesto: false },
  { id: 'curl-biceps-mancuernas', nombre: 'Curl de bíceps con mancuernas', entornos: ['gimnasio'], grupo: 'biceps', nivel: 1, compuesto: false },
  { id: 'dominadas-supinas', nombre: 'Dominadas supinas', entornos: ['gimnasio', 'calistenia'], grupo: 'biceps', nivel: 2, compuesto: true },
  { id: 'curl-biceps-mochila', nombre: 'Curl de bíceps con mochila', entornos: ['casa'], grupo: 'biceps', nivel: 1, compuesto: false },

  // ── Tríceps ────────────────────────────────────────────────────────────────
  { id: 'extension-triceps-polea', nombre: 'Extensión de tríceps en polea', entornos: ['gimnasio'], grupo: 'triceps', nivel: 1, compuesto: false },
  { id: 'press-frances', nombre: 'Press francés', entornos: ['gimnasio'], grupo: 'triceps', nivel: 2, compuesto: false },
  { id: 'fondos-banco', nombre: 'Fondos en banco o silla', entornos: ['casa', 'calistenia'], grupo: 'triceps', nivel: 1, compuesto: false },
  { id: 'flexiones-diamante', nombre: 'Flexiones diamante', entornos: ['casa', 'calistenia'], grupo: 'triceps', nivel: 2, compuesto: false },

  // ── Cuádriceps ─────────────────────────────────────────────────────────────
  { id: 'sentadilla-barra', nombre: 'Sentadilla con barra', entornos: ['gimnasio'], grupo: 'cuadriceps', nivel: 2, compuesto: true },
  { id: 'prensa-piernas', nombre: 'Prensa de piernas', entornos: ['gimnasio'], grupo: 'cuadriceps', nivel: 1, compuesto: true },
  { id: 'extension-cuadriceps', nombre: 'Extensión de cuádriceps', entornos: ['gimnasio'], grupo: 'cuadriceps', nivel: 1, compuesto: false },
  { id: 'sentadilla-goblet', nombre: 'Sentadilla goblet', entornos: ['gimnasio'], grupo: 'cuadriceps', nivel: 1, compuesto: true },
  { id: 'sentadilla-corporal', nombre: 'Sentadilla corporal', entornos: ['casa', 'calistenia'], grupo: 'cuadriceps', nivel: 1, compuesto: true },
  { id: 'zancadas', nombre: 'Zancadas', entornos: ['gimnasio', 'casa', 'calistenia'], grupo: 'cuadriceps', nivel: 1, compuesto: true },
  { id: 'sentadilla-bulgara', nombre: 'Sentadilla búlgara', entornos: ['gimnasio', 'casa', 'calistenia'], grupo: 'cuadriceps', nivel: 2, compuesto: true },
  { id: 'pistol-squat', nombre: 'Sentadilla a una pierna (pistol)', entornos: ['calistenia'], grupo: 'cuadriceps', nivel: 3, compuesto: true },

  // ── Femoral y glúteo ───────────────────────────────────────────────────────
  { id: 'peso-muerto', nombre: 'Peso muerto', entornos: ['gimnasio'], grupo: 'femoral_gluteo', nivel: 3, compuesto: true },
  { id: 'peso-muerto-rumano', nombre: 'Peso muerto rumano', entornos: ['gimnasio'], grupo: 'femoral_gluteo', nivel: 2, compuesto: true },
  { id: 'curl-femoral', nombre: 'Curl femoral en máquina', entornos: ['gimnasio'], grupo: 'femoral_gluteo', nivel: 1, compuesto: false },
  { id: 'hip-thrust', nombre: 'Hip thrust', entornos: ['gimnasio'], grupo: 'femoral_gluteo', nivel: 2, compuesto: true },
  { id: 'peso-muerto-una-pierna', nombre: 'Peso muerto rumano a una pierna', entornos: ['casa', 'calistenia'], grupo: 'femoral_gluteo', nivel: 2, compuesto: true },
  { id: 'puente-gluteo', nombre: 'Puente de glúteo', entornos: ['casa', 'calistenia'], grupo: 'femoral_gluteo', nivel: 1, compuesto: true },
  { id: 'curl-nordico', nombre: 'Curl nórdico', entornos: ['calistenia'], grupo: 'femoral_gluteo', nivel: 3, compuesto: false },

  // ── Gemelos ────────────────────────────────────────────────────────────────
  { id: 'elevacion-gemelos', nombre: 'Elevación de gemelos de pie', entornos: ['gimnasio', 'casa', 'calistenia'], grupo: 'gemelos', nivel: 1, compuesto: false },
  { id: 'elevacion-gemelos-una-pierna', nombre: 'Elevación de gemelos a una pierna', entornos: ['casa', 'calistenia'], grupo: 'gemelos', nivel: 2, compuesto: false },

  // ── Core ───────────────────────────────────────────────────────────────────
  { id: 'plancha', nombre: 'Plancha abdominal', entornos: ['gimnasio', 'casa', 'calistenia'], grupo: 'core', nivel: 1, compuesto: false },
  { id: 'plancha-lateral', nombre: 'Plancha lateral', entornos: ['casa', 'calistenia'], grupo: 'core', nivel: 1, compuesto: false },
  { id: 'crunch-abdominal', nombre: 'Crunch abdominal', entornos: ['gimnasio', 'casa'], grupo: 'core', nivel: 1, compuesto: false },
  { id: 'elevaciones-piernas-colgado', nombre: 'Elevaciones de piernas colgado', entornos: ['gimnasio', 'calistenia'], grupo: 'core', nivel: 2, compuesto: false },
  { id: 'escaladores', nombre: 'Escaladores (mountain climbers)', entornos: ['casa', 'calistenia'], grupo: 'core', nivel: 1, compuesto: false },
  { id: 'rueda-abdominal', nombre: 'Rueda abdominal', entornos: ['gimnasio', 'casa'], grupo: 'core', nivel: 3, compuesto: false },
  { id: 'l-sit', nombre: 'L-sit', entornos: ['calistenia'], grupo: 'core', nivel: 3, compuesto: false },
]
