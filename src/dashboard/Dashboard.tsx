import { useMemo } from 'react'
import type { Perfil } from '../types'
import { useProfileStore } from '../store/profileStore'
import { useUiStore, type Tab } from '../store/uiStore'
import { calcularObjetivoDiario } from '../engine/nutrition'
import { generarMenuSemanal } from '../engine/mealPlanner'
import { generarRutina } from '../engine/workoutPlanner'
import { generarListaCompra } from '../engine/shoppingList'
import { Boton, Sticker } from '../components/ui'
import { MenuSemanalView } from './menu/MenuSemanalView'
import { RutinaView } from './workout/RutinaView'
import { ListaCompraView } from './shopping/ListaCompraView'
import { SeleccionAlimentosView } from './foods/SeleccionAlimentosView'

const TABS: { id: Tab; emoji: string; titulo: string }[] = [
  { id: 'menu', emoji: '🍽️', titulo: 'Menú semanal' },
  { id: 'entrenamiento', emoji: '🏋️', titulo: 'Entrenamiento' },
  { id: 'compra', emoji: '🛒', titulo: 'Lista de la compra' },
  { id: 'alimentos', emoji: '🥦', titulo: 'Mis alimentos' },
]

export function Dashboard({ perfil }: { perfil: Perfil }) {
  const excluidos = useProfileStore((s) => s.excluidos)
  const semilla = useProfileStore((s) => s.semilla)
  const regenerar = useProfileStore((s) => s.regenerar)
  const reiniciar = useProfileStore((s) => s.reiniciar)
  const tab = useUiStore((s) => s.tab)
  const setTab = useUiStore((s) => s.setTab)

  const objetivo = useMemo(() => calcularObjetivoDiario(perfil), [perfil])
  const setExcluidos = useMemo(() => new Set(excluidos), [excluidos])
  const menu = useMemo(
    () => generarMenuSemanal(objetivo, setExcluidos, semilla, perfil.comidasDia),
    [objetivo, setExcluidos, semilla, perfil.comidasDia],
  )
  const rutina = useMemo(() => generarRutina(perfil, semilla), [perfil, semilla])
  const compra = useMemo(() => (menu.inviable ? [] : generarListaCompra(menu)), [menu])

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-4 py-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-display text-sm font-bold tracking-wide text-hoja uppercase">
            FitCoach
          </p>
          <h1 className="font-display text-3xl font-extrabold sm:text-4xl">
            {perfil.nombre ? `¡A por ello, ${perfil.nombre}!` : '¡A por ello!'}
          </h1>
        </div>
        <div className="flex gap-2">
          <Boton variante="secundario" onClick={regenerar} title="Genera una variación nueva del plan">
            🎲 Regenerar plan
          </Boton>
          <Boton
            variante="fantasma"
            onClick={() => {
              if (confirm('¿Empezar de nuevo? Se borrará tu perfil y tu selección de alimentos.')) {
                reiniciar()
              }
            }}
          >
            Empezar de nuevo
          </Boton>
        </div>
      </header>

      <section aria-label="Objetivo nutricional diario" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Sticker tone="mandarina" className="p-3 text-center -rotate-1">
          <p className="font-display text-2xl font-extrabold">{objetivo.kcal}</p>
          <p className="text-xs font-bold">kcal / día</p>
        </Sticker>
        <Sticker tone="frambuesa" className="p-3 text-center rotate-1">
          <p className="font-display text-2xl font-extrabold">{objetivo.proteinaG} g</p>
          <p className="text-xs font-bold">proteína</p>
        </Sticker>
        <Sticker tone="miel" className="p-3 text-center -rotate-1">
          <p className="font-display text-2xl font-extrabold">{objetivo.grasaG} g</p>
          <p className="text-xs font-bold">grasas</p>
        </Sticker>
        <Sticker tone="cielo" className="p-3 text-center rotate-1">
          <p className="font-display text-2xl font-extrabold">{objetivo.carbosG} g</p>
          <p className="text-xs font-bold">carbohidratos</p>
        </Sticker>
      </section>

      <nav className="flex flex-wrap gap-2" aria-label="Secciones">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            aria-current={tab === t.id ? 'page' : undefined}
            className={`cursor-pointer rounded-full border-2 border-ink px-4 py-2 font-display font-bold transition-all ${
              tab === t.id
                ? 'bg-ink text-white shadow-sticker-sm'
                : 'bg-white hover:-translate-y-0.5'
            }`}
          >
            <span aria-hidden>{t.emoji}</span> {t.titulo}
          </button>
        ))}
      </nav>

      {tab === 'menu' && <MenuSemanalView menu={menu} />}
      {tab === 'entrenamiento' && <RutinaView rutina={rutina} perfil={perfil} />}
      {tab === 'compra' && <ListaCompraView compra={compra} inviable={menu.inviable} />}
      {tab === 'alimentos' && <SeleccionAlimentosView menu={menu} />}
    </main>
  )
}
