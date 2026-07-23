import type { CategoriaAlimento, ResultadoMenu } from '../../types'
import { ALIMENTOS } from '../../data'
import { useProfileStore } from '../../store/profileStore'
import { Sticker } from '../../components/ui'
import { ItemImg } from '../../components/ItemImg'
import { EMOJI_CATEGORIA, NOMBRE_CATEGORIA } from '../../components/emoji'
import { MenuInviableAviso } from './MenuInviableAviso'

const ORDEN_CATEGORIAS: CategoriaAlimento[] = [
  'proteinas',
  'lacteos',
  'carbohidratos',
  'legumbres',
  'grasas',
  'verduras',
  'frutas',
]

export function SeleccionAlimentosView({ menu }: { menu: ResultadoMenu }) {
  const excluidos = useProfileStore((s) => s.excluidos)
  const toggleAlimento = useProfileStore((s) => s.toggleAlimento)
  const setExcluidos = new Set(excluidos)

  return (
    <section className="flex flex-col gap-4" aria-label="Selección de alimentos">
      <p className="text-sm opacity-80">
        Todos los alimentos están marcados de serie. Desmarca los que no te gusten o no te sienten
        bien y tu menú semanal se replanificará al momento usando solo lo que sí quieres comer.
      </p>

      {menu.inviable && <MenuInviableAviso menu={menu} />}

      {ORDEN_CATEGORIAS.map((categoria) => {
        const alimentos = ALIMENTOS.filter((a) => a.categoria === categoria)
        if (alimentos.length === 0) return null
        return (
          <div key={categoria}>
            <h2 className="mb-2 font-display text-lg font-extrabold">
              <span aria-hidden>{EMOJI_CATEGORIA[categoria]}</span> {NOMBRE_CATEGORIA[categoria]}
            </h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {alimentos.map((alimento) => {
                const activo = !setExcluidos.has(alimento.id)
                return (
                  <button
                    key={alimento.id}
                    type="button"
                    role="switch"
                    aria-checked={activo}
                    onClick={() => toggleAlimento(alimento.id)}
                    className={`flex cursor-pointer items-center gap-2 rounded-xl border-2 border-ink px-2.5 py-2 text-left transition-all ${
                      activo
                        ? 'bg-white shadow-sticker-sm hover:-translate-y-0.5'
                        : 'bg-ink/5 opacity-50 grayscale hover:opacity-75'
                    }`}
                  >
                    <ItemImg
                      tipo="foods"
                      id={alimento.id}
                      alt=""
                      emoji={EMOJI_CATEGORIA[alimento.categoria]}
                      className="h-10 w-10 shrink-0 rounded-lg border-2 border-ink"
                    />
                    <span className="min-w-0 flex-1 text-sm leading-tight font-bold">
                      {alimento.nombre}
                    </span>
                    <span aria-hidden className="shrink-0 text-lg">
                      {activo ? '✅' : '🚫'}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}

      {!menu.inviable && menu.avisos.length > 0 && (
        <Sticker tone="miel" className="p-4 text-sm">
          <p className="font-display font-bold">Con tu selección actual 📋</p>
          <ul className="mt-1 list-disc pl-5">
            {menu.avisos.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </Sticker>
      )}
    </section>
  )
}
