import type { MenuInviable } from '../../types'
import { NOMBRE_SLOT } from '../../engine/mealPlanner'
import { ALIMENTOS_POR_ID } from '../../data'
import { Boton, Sticker } from '../../components/ui'
import { useProfileStore } from '../../store/profileStore'

/** Se muestra cuando el usuario ha desmarcado tantos alimentos que algún
 *  slot se ha quedado sin platos posibles. */
export function MenuInviableAviso({ menu }: { menu: MenuInviable }) {
  const incluirAlimento = useProfileStore((s) => s.incluirAlimento)
  const slots = menu.slotsBloqueados.map((s) => NOMBRE_SLOT[s].toLowerCase()).join(', ')

  return (
    <Sticker tone="frambuesa" className="p-5">
      <h2 className="font-display text-xl font-extrabold">
        Nos hemos quedado sin platos para: {slots} 😅
      </h2>
      <p className="mt-1 text-sm">
        Has desmarcado demasiados alimentos y no queda ningún plato posible para esas comidas.
        Vuelve a marcar alguno de estos para desbloquear tu menú:
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {menu.sugerencias.map((s) => {
          const alimento = ALIMENTOS_POR_ID.get(s.alimentoId)
          if (!alimento) return null
          return (
            <Boton key={s.alimentoId} variante="secundario" onClick={() => incluirAlimento(s.alimentoId)}>
              + {alimento.nombre}
              <span className="text-xs opacity-60">
                desbloquea {s.platosDesbloqueados} {s.platosDesbloqueados === 1 ? 'plato' : 'platos'}
              </span>
            </Boton>
          )
        })}
      </div>
    </Sticker>
  )
}
