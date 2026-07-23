import type { ResultadoMenu } from '../../types'
import { DIAS_SEMANA, NOMBRE_SLOT } from '../../engine/mealPlanner'
import { PLATOS_POR_ID, ALIMENTOS_POR_ID } from '../../data'
import { Sticker } from '../../components/ui'
import { ItemImg } from '../../components/ItemImg'
import { EMOJI_SLOT } from '../../components/emoji'
import { MenuInviableAviso } from '../foods/MenuInviableAviso'

export function MenuSemanalView({ menu }: { menu: ResultadoMenu }) {
  if (menu.inviable) return <MenuInviableAviso menu={menu} />

  return (
    <section className="flex flex-col gap-4" aria-label="Menú semanal">
      {menu.avisos.length > 0 && (
        <Sticker tone="miel" className="p-4">
          <p className="font-display font-bold">Avisos de tu nutricionista 📋</p>
          <ul className="mt-1 list-disc pl-5 text-sm">
            {menu.avisos.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </Sticker>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {menu.dias.map((dia, i) => (
          <Sticker key={DIAS_SEMANA[i]} className="flex flex-col overflow-hidden">
            <div className="flex items-baseline justify-between border-b-2 border-ink bg-hoja-suave px-4 py-2">
              <h2 className="font-display text-lg font-extrabold">{DIAS_SEMANA[i]}</h2>
              <p className="text-sm font-bold">
                {dia.totales.kcal} kcal · {Math.round(dia.totales.proteinaG)} g prot
              </p>
            </div>
            <ul className="flex flex-col divide-y-2 divide-dashed divide-ink/15">
              {menu.slots.map((slot) => {
                const comida = dia.comidas[slot]!
                const plato = PLATOS_POR_ID.get(comida.platoId)!
                return (
                  <li key={slot} className="flex items-center gap-3 px-4 py-2.5">
                    <ItemImg
                      tipo="dishes"
                      id={plato.id}
                      alt={plato.nombre}
                      emoji={EMOJI_SLOT[slot]}
                      className="h-14 w-14 shrink-0 rounded-xl border-2 border-ink"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-hoja uppercase">{NOMBRE_SLOT[slot]}</p>
                      <p className="truncate font-display font-bold leading-tight" title={plato.nombre}>
                        {plato.nombre}
                      </p>
                      <p className="text-xs opacity-70">
                        {comida.macros.kcal} kcal · {Math.round(comida.macros.proteinaG)} g prot
                        {comida.racion !== 1 && ` · ración ×${comida.racion}`}
                      </p>
                      <p className="mt-0.5 line-clamp-2 text-xs opacity-60">
                        {plato.ingredientes
                          .map((ing) => {
                            const alimento = ALIMENTOS_POR_ID.get(ing.alimentoId)!
                            return `${Math.round((ing.gramos * comida.racion) / 5) * 5} g ${alimento.nombre.toLowerCase()}`
                          })
                          .join(', ')}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </Sticker>
        ))}
      </div>
    </section>
  )
}
