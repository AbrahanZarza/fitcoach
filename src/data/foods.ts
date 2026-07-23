import type { Alimento, UnidadCompra } from '../types'

// Macros por 100 g. Cereales, pasta y legumbres: peso en seco salvo que se
// indique "cocidos" (legumbres de bote, listas para usar).
const BASE: Alimento[] = [
  // ── Proteínas ──────────────────────────────────────────────────────────────
  { id: 'pechuga-pollo', nombre: 'Pechuga de pollo', categoria: 'proteinas', pasillo: 'carniceria', por100g: { kcal: 165, proteinaG: 31, grasaG: 3.6, carbosG: 0 } },
  { id: 'muslo-pollo', nombre: 'Muslo de pollo (sin piel)', categoria: 'proteinas', pasillo: 'carniceria', por100g: { kcal: 120, proteinaG: 20, grasaG: 4, carbosG: 0 } },
  { id: 'pechuga-pavo', nombre: 'Pechuga de pavo', categoria: 'proteinas', pasillo: 'carniceria', por100g: { kcal: 105, proteinaG: 24, grasaG: 1, carbosG: 0 } },
  { id: 'ternera-magra', nombre: 'Ternera magra', categoria: 'proteinas', pasillo: 'carniceria', por100g: { kcal: 131, proteinaG: 21, grasaG: 5, carbosG: 0 } },
  { id: 'lomo-cerdo', nombre: 'Lomo de cerdo', categoria: 'proteinas', pasillo: 'carniceria', por100g: { kcal: 143, proteinaG: 21, grasaG: 6, carbosG: 0 } },
  { id: 'jamon-serrano', nombre: 'Jamón serrano', categoria: 'proteinas', pasillo: 'carniceria', por100g: { kcal: 241, proteinaG: 31, grasaG: 13, carbosG: 0 } },
  { id: 'merluza', nombre: 'Merluza', categoria: 'proteinas', pasillo: 'pescaderia', por100g: { kcal: 86, proteinaG: 18, grasaG: 1.3, carbosG: 0 } },
  { id: 'salmon', nombre: 'Salmón', categoria: 'proteinas', pasillo: 'pescaderia', por100g: { kcal: 208, proteinaG: 20, grasaG: 13, carbosG: 0 } },
  { id: 'bacalao', nombre: 'Bacalao', categoria: 'proteinas', pasillo: 'pescaderia', por100g: { kcal: 82, proteinaG: 18, grasaG: 0.7, carbosG: 0 } },
  { id: 'gambas', nombre: 'Gambas', categoria: 'proteinas', pasillo: 'pescaderia', por100g: { kcal: 99, proteinaG: 24, grasaG: 0.3, carbosG: 0 } },
  { id: 'atun-lata', nombre: 'Atún en lata (al natural)', categoria: 'proteinas', pasillo: 'despensa', por100g: { kcal: 116, proteinaG: 26, grasaG: 1, carbosG: 0 } },
  { id: 'huevo', nombre: 'Huevos', categoria: 'proteinas', pasillo: 'lacteos_huevos', por100g: { kcal: 143, proteinaG: 13, grasaG: 9.5, carbosG: 1 } },
  { id: 'clara-huevo', nombre: 'Claras de huevo', categoria: 'proteinas', pasillo: 'lacteos_huevos', por100g: { kcal: 52, proteinaG: 11, grasaG: 0.2, carbosG: 0.7 } },
  { id: 'tofu', nombre: 'Tofu', categoria: 'proteinas', pasillo: 'despensa', por100g: { kcal: 76, proteinaG: 8, grasaG: 4.8, carbosG: 1.9 } },

  // ── Lácteos ────────────────────────────────────────────────────────────────
  { id: 'yogur-griego', nombre: 'Yogur griego natural', categoria: 'lacteos', pasillo: 'lacteos_huevos', por100g: { kcal: 97, proteinaG: 9, grasaG: 5, carbosG: 3.8 } },
  { id: 'queso-fresco-batido', nombre: 'Queso fresco batido 0%', categoria: 'lacteos', pasillo: 'lacteos_huevos', por100g: { kcal: 46, proteinaG: 8, grasaG: 0.2, carbosG: 3.5 } },
  { id: 'requeson', nombre: 'Requesón', categoria: 'lacteos', pasillo: 'lacteos_huevos', por100g: { kcal: 98, proteinaG: 11, grasaG: 4, carbosG: 3.5 } },
  { id: 'leche-semidesnatada', nombre: 'Leche semidesnatada', categoria: 'lacteos', pasillo: 'lacteos_huevos', por100g: { kcal: 46, proteinaG: 3.1, grasaG: 1.6, carbosG: 4.7 } },
  { id: 'queso-curado', nombre: 'Queso curado', categoria: 'lacteos', pasillo: 'lacteos_huevos', por100g: { kcal: 390, proteinaG: 26, grasaG: 32, carbosG: 1 } },
  { id: 'mozzarella', nombre: 'Mozzarella fresca', categoria: 'lacteos', pasillo: 'lacteos_huevos', por100g: { kcal: 250, proteinaG: 18, grasaG: 19, carbosG: 2 } },

  // ── Carbohidratos ──────────────────────────────────────────────────────────
  { id: 'arroz-blanco', nombre: 'Arroz blanco', categoria: 'carbohidratos', pasillo: 'despensa', por100g: { kcal: 354, proteinaG: 7, grasaG: 0.9, carbosG: 77 } },
  { id: 'arroz-integral', nombre: 'Arroz integral', categoria: 'carbohidratos', pasillo: 'despensa', por100g: { kcal: 350, proteinaG: 7.5, grasaG: 2.7, carbosG: 72 } },
  { id: 'pasta', nombre: 'Pasta', categoria: 'carbohidratos', pasillo: 'despensa', por100g: { kcal: 371, proteinaG: 13, grasaG: 1.5, carbosG: 74 } },
  { id: 'pan-integral', nombre: 'Pan integral', categoria: 'carbohidratos', pasillo: 'panaderia', por100g: { kcal: 247, proteinaG: 10, grasaG: 3.5, carbosG: 41 } },
  { id: 'avena', nombre: 'Copos de avena', categoria: 'carbohidratos', pasillo: 'despensa', por100g: { kcal: 389, proteinaG: 17, grasaG: 7, carbosG: 66 } },
  { id: 'patata', nombre: 'Patata', categoria: 'carbohidratos', pasillo: 'fruteria_verduleria', por100g: { kcal: 77, proteinaG: 2, grasaG: 0.1, carbosG: 17 } },
  { id: 'boniato', nombre: 'Boniato', categoria: 'carbohidratos', pasillo: 'fruteria_verduleria', por100g: { kcal: 86, proteinaG: 1.6, grasaG: 0.1, carbosG: 20 } },
  { id: 'quinoa', nombre: 'Quinoa', categoria: 'carbohidratos', pasillo: 'despensa', por100g: { kcal: 368, proteinaG: 14, grasaG: 6, carbosG: 64 } },
  { id: 'cuscus', nombre: 'Cuscús', categoria: 'carbohidratos', pasillo: 'despensa', por100g: { kcal: 376, proteinaG: 13, grasaG: 0.6, carbosG: 77 } },
  { id: 'tortitas-arroz', nombre: 'Tortitas de arroz', categoria: 'carbohidratos', pasillo: 'despensa', por100g: { kcal: 387, proteinaG: 8, grasaG: 3, carbosG: 81 } },
  { id: 'miel', nombre: 'Miel', categoria: 'carbohidratos', pasillo: 'despensa', por100g: { kcal: 304, proteinaG: 0.3, grasaG: 0, carbosG: 82 } },

  // ── Legumbres (cocidas, de bote) ───────────────────────────────────────────
  { id: 'garbanzos', nombre: 'Garbanzos (cocidos)', categoria: 'legumbres', pasillo: 'despensa', por100g: { kcal: 132, proteinaG: 7.5, grasaG: 2.2, carbosG: 20 } },
  { id: 'lentejas', nombre: 'Lentejas (cocidas)', categoria: 'legumbres', pasillo: 'despensa', por100g: { kcal: 116, proteinaG: 9, grasaG: 0.4, carbosG: 20 } },
  { id: 'alubias', nombre: 'Alubias blancas (cocidas)', categoria: 'legumbres', pasillo: 'despensa', por100g: { kcal: 127, proteinaG: 8.7, grasaG: 0.5, carbosG: 22 } },

  // ── Grasas saludables ──────────────────────────────────────────────────────
  { id: 'aceite-oliva', nombre: 'Aceite de oliva virgen extra', categoria: 'grasas', pasillo: 'despensa', por100g: { kcal: 884, proteinaG: 0, grasaG: 100, carbosG: 0 } },
  { id: 'aguacate', nombre: 'Aguacate', categoria: 'grasas', pasillo: 'fruteria_verduleria', por100g: { kcal: 160, proteinaG: 2, grasaG: 15, carbosG: 9 } },
  { id: 'almendras', nombre: 'Almendras', categoria: 'grasas', pasillo: 'despensa', por100g: { kcal: 579, proteinaG: 21, grasaG: 50, carbosG: 22 } },
  { id: 'nueces', nombre: 'Nueces', categoria: 'grasas', pasillo: 'despensa', por100g: { kcal: 654, proteinaG: 15, grasaG: 65, carbosG: 14 } },
  { id: 'crema-cacahuete', nombre: 'Crema de cacahuete', categoria: 'grasas', pasillo: 'despensa', por100g: { kcal: 588, proteinaG: 25, grasaG: 50, carbosG: 20 } },
  { id: 'aceitunas', nombre: 'Aceitunas', categoria: 'grasas', pasillo: 'despensa', por100g: { kcal: 115, proteinaG: 0.8, grasaG: 11, carbosG: 6 } },
  { id: 'chocolate-negro', nombre: 'Chocolate negro 85%', categoria: 'grasas', pasillo: 'despensa', por100g: { kcal: 546, proteinaG: 7.8, grasaG: 31, carbosG: 46 } },

  // ── Verduras ───────────────────────────────────────────────────────────────
  { id: 'tomate', nombre: 'Tomate', categoria: 'verduras', pasillo: 'fruteria_verduleria', por100g: { kcal: 18, proteinaG: 0.9, grasaG: 0.2, carbosG: 3.9 } },
  { id: 'lechuga', nombre: 'Lechuga', categoria: 'verduras', pasillo: 'fruteria_verduleria', por100g: { kcal: 15, proteinaG: 1.4, grasaG: 0.2, carbosG: 2.9 } },
  { id: 'cebolla', nombre: 'Cebolla', categoria: 'verduras', pasillo: 'fruteria_verduleria', por100g: { kcal: 40, proteinaG: 1.1, grasaG: 0.1, carbosG: 9 } },
  { id: 'pimiento', nombre: 'Pimiento', categoria: 'verduras', pasillo: 'fruteria_verduleria', por100g: { kcal: 31, proteinaG: 1, grasaG: 0.3, carbosG: 6 } },
  { id: 'calabacin', nombre: 'Calabacín', categoria: 'verduras', pasillo: 'fruteria_verduleria', por100g: { kcal: 17, proteinaG: 1.2, grasaG: 0.3, carbosG: 3.1 } },
  { id: 'brocoli', nombre: 'Brócoli', categoria: 'verduras', pasillo: 'fruteria_verduleria', por100g: { kcal: 34, proteinaG: 2.8, grasaG: 0.4, carbosG: 7 } },
  { id: 'espinacas', nombre: 'Espinacas', categoria: 'verduras', pasillo: 'fruteria_verduleria', por100g: { kcal: 23, proteinaG: 2.9, grasaG: 0.4, carbosG: 3.6 } },
  { id: 'zanahoria', nombre: 'Zanahoria', categoria: 'verduras', pasillo: 'fruteria_verduleria', por100g: { kcal: 41, proteinaG: 0.9, grasaG: 0.2, carbosG: 10 } },
  { id: 'champinones', nombre: 'Champiñones', categoria: 'verduras', pasillo: 'fruteria_verduleria', por100g: { kcal: 22, proteinaG: 3.1, grasaG: 0.3, carbosG: 3.3 } },
  { id: 'judias-verdes', nombre: 'Judías verdes', categoria: 'verduras', pasillo: 'fruteria_verduleria', por100g: { kcal: 31, proteinaG: 1.8, grasaG: 0.2, carbosG: 7 } },
  { id: 'pepino', nombre: 'Pepino', categoria: 'verduras', pasillo: 'fruteria_verduleria', por100g: { kcal: 15, proteinaG: 0.7, grasaG: 0.1, carbosG: 3.6 } },
  { id: 'berenjena', nombre: 'Berenjena', categoria: 'verduras', pasillo: 'fruteria_verduleria', por100g: { kcal: 25, proteinaG: 1, grasaG: 0.2, carbosG: 6 } },
  { id: 'esparragos', nombre: 'Espárragos', categoria: 'verduras', pasillo: 'fruteria_verduleria', por100g: { kcal: 20, proteinaG: 2.2, grasaG: 0.1, carbosG: 3.9 } },

  // ── Frutas ─────────────────────────────────────────────────────────────────
  { id: 'platano', nombre: 'Plátano', categoria: 'frutas', pasillo: 'fruteria_verduleria', por100g: { kcal: 89, proteinaG: 1.1, grasaG: 0.3, carbosG: 23 } },
  { id: 'manzana', nombre: 'Manzana', categoria: 'frutas', pasillo: 'fruteria_verduleria', por100g: { kcal: 52, proteinaG: 0.3, grasaG: 0.2, carbosG: 14 } },
  { id: 'naranja', nombre: 'Naranja', categoria: 'frutas', pasillo: 'fruteria_verduleria', por100g: { kcal: 47, proteinaG: 0.9, grasaG: 0.1, carbosG: 12 } },
  { id: 'fresas', nombre: 'Fresas', categoria: 'frutas', pasillo: 'fruteria_verduleria', por100g: { kcal: 32, proteinaG: 0.7, grasaG: 0.3, carbosG: 7.7 } },
  { id: 'arandanos', nombre: 'Arándanos', categoria: 'frutas', pasillo: 'fruteria_verduleria', por100g: { kcal: 57, proteinaG: 0.7, grasaG: 0.3, carbosG: 14 } },
  { id: 'kiwi', nombre: 'Kiwi', categoria: 'frutas', pasillo: 'fruteria_verduleria', por100g: { kcal: 61, proteinaG: 1.1, grasaG: 0.5, carbosG: 15 } },
  { id: 'limon', nombre: 'Limón', categoria: 'frutas', pasillo: 'fruteria_verduleria', por100g: { kcal: 29, proteinaG: 1.1, grasaG: 0.3, carbosG: 9 } },
]

// Unidad natural de compra (gramos aproximados por unidad). Los alimentos que
// no aparecen aquí se compran a peso.
const UNIDADES: Record<string, UnidadCompra> = {
  'pechuga-pollo': { singular: 'filete', plural: 'filetes', gramos: 150 },
  'muslo-pollo': { singular: 'muslo', plural: 'muslos', gramos: 110 },
  'pechuga-pavo': { singular: 'filete', plural: 'filetes', gramos: 120 },
  'ternera-magra': { singular: 'filete', plural: 'filetes', gramos: 150 },
  'lomo-cerdo': { singular: 'filete', plural: 'filetes', gramos: 130 },
  merluza: { singular: 'lomo', plural: 'lomos', gramos: 150 },
  salmon: { singular: 'lomo', plural: 'lomos', gramos: 150 },
  bacalao: { singular: 'lomo', plural: 'lomos', gramos: 150 },
  'atun-lata': { singular: 'lata', plural: 'latas', gramos: 60 },
  huevo: { singular: 'huevo', plural: 'huevos', gramos: 55 },
  'clara-huevo': { singular: 'clara', plural: 'claras', gramos: 33 },
  tofu: { singular: 'bloque', plural: 'bloques', gramos: 250 },
  'yogur-griego': { singular: 'yogur', plural: 'yogures', gramos: 125 },
  'queso-fresco-batido': { singular: 'tarrina', plural: 'tarrinas', gramos: 500 },
  requeson: { singular: 'tarrina', plural: 'tarrinas', gramos: 250 },
  'leche-semidesnatada': { singular: 'brik', plural: 'briks', gramos: 1000 },
  'queso-curado': { singular: 'cuña', plural: 'cuñas', gramos: 250 },
  mozzarella: { singular: 'bola', plural: 'bolas', gramos: 125 },
  'pan-integral': { singular: 'barra', plural: 'barras', gramos: 250 },
  patata: { singular: 'patata', plural: 'patatas', gramos: 180 },
  boniato: { singular: 'boniato', plural: 'boniatos', gramos: 250 },
  'tortitas-arroz': { singular: 'tortita', plural: 'tortitas', gramos: 8 },
  garbanzos: { singular: 'bote', plural: 'botes', gramos: 400 },
  lentejas: { singular: 'bote', plural: 'botes', gramos: 400 },
  alubias: { singular: 'bote', plural: 'botes', gramos: 400 },
  aguacate: { singular: 'aguacate', plural: 'aguacates', gramos: 130 },
  tomate: { singular: 'tomate', plural: 'tomates', gramos: 150 },
  lechuga: { singular: 'lechuga', plural: 'lechugas', gramos: 350 },
  cebolla: { singular: 'cebolla', plural: 'cebollas', gramos: 150 },
  pimiento: { singular: 'pimiento', plural: 'pimientos', gramos: 180 },
  calabacin: { singular: 'calabacín', plural: 'calabacines', gramos: 250 },
  brocoli: { singular: 'brócoli', plural: 'brócolis', gramos: 350 },
  zanahoria: { singular: 'zanahoria', plural: 'zanahorias', gramos: 80 },
  champinones: { singular: 'bandeja', plural: 'bandejas', gramos: 250 },
  pepino: { singular: 'pepino', plural: 'pepinos', gramos: 250 },
  berenjena: { singular: 'berenjena', plural: 'berenjenas', gramos: 300 },
  esparragos: { singular: 'manojo', plural: 'manojos', gramos: 200 },
  platano: { singular: 'plátano', plural: 'plátanos', gramos: 120 },
  manzana: { singular: 'manzana', plural: 'manzanas', gramos: 150 },
  naranja: { singular: 'naranja', plural: 'naranjas', gramos: 180 },
  fresas: { singular: 'tarrina', plural: 'tarrinas', gramos: 250 },
  arandanos: { singular: 'tarrina', plural: 'tarrinas', gramos: 125 },
  kiwi: { singular: 'kiwi', plural: 'kiwis', gramos: 90 },
  limon: { singular: 'limón', plural: 'limones', gramos: 100 },
  'chocolate-negro': { singular: 'tableta', plural: 'tabletas', gramos: 100 },
}

export const ALIMENTOS: Alimento[] = BASE.map((a) =>
  UNIDADES[a.id] ? { ...a, unidad: UNIDADES[a.id] } : a,
)
