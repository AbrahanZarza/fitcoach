import { useState } from 'react'
import type { ListaCompra } from '../../types'
import { formatearCantidad, formatearUnidades, NOMBRE_PASILLO } from '../../engine/shoppingList'
import { ALIMENTOS_POR_ID } from '../../data'
import { Sticker } from '../../components/ui'
import { ItemImg } from '../../components/ItemImg'
import { EMOJI_CATEGORIA } from '../../components/emoji'

const EMOJI_PASILLO: Record<string, string> = {
  fruteria_verduleria: '🥬',
  carniceria: '🥩',
  pescaderia: '🐟',
  lacteos_huevos: '🥚',
  despensa: '🫙',
  panaderia: '🥖',
  congelados: '🧊',
}

export function ListaCompraView({ compra, inviable }: { compra: ListaCompra; inviable: boolean }) {
  // Marcado efímero: se pierde al recargar, como una lista de papel.
  const [marcados, setMarcados] = useState<Set<string>>(new Set())

  if (inviable) {
    return (
      <Sticker tone="miel" className="p-5">
        <p className="font-display font-bold">
          La lista de la compra saldrá de tu menú semanal. Desbloquea primero el menú en la pestaña
          «Mis alimentos». 🛒
        </p>
      </Sticker>
    )
  }

  const total = compra.reduce((s, seccion) => s + seccion.items.length, 0)

  const toggle = (id: string) =>
    setMarcados((prev) => {
      const siguiente = new Set(prev)
      if (siguiente.has(id)) siguiente.delete(id)
      else siguiente.add(id)
      return siguiente
    })

  return (
    <section className="flex flex-col gap-4" aria-label="Lista de la compra">
      <p className="text-sm opacity-80">
        Todo lo que necesitas para la semana completa ({total} productos), ordenado como un paseo
        por el súper. Marca lo que ya tengas en casa.
      </p>

      <div className="columns-1 gap-4 md:columns-2 xl:columns-3 [&>*]:mb-4 [&>*]:break-inside-avoid">
        {compra.map((seccion) => (
          <Sticker key={seccion.pasillo} className="overflow-hidden">
            <div className="border-b-2 border-ink bg-miel-suave px-4 py-2">
              <h2 className="font-display text-lg font-extrabold">
                <span aria-hidden>{EMOJI_PASILLO[seccion.pasillo]}</span>{' '}
                {NOMBRE_PASILLO[seccion.pasillo]}
              </h2>
            </div>
            <ul className="flex flex-col divide-y-2 divide-dashed divide-ink/15">
              {seccion.items.map((item) => {
                const alimento = ALIMENTOS_POR_ID.get(item.alimentoId)!
                const marcado = marcados.has(item.alimentoId)
                const unidades = formatearUnidades(alimento, item.gramosTotales)
                return (
                  <li key={item.alimentoId}>
                    <label
                      className={`flex cursor-pointer items-center gap-3 px-4 py-2 transition-opacity ${
                        marcado ? 'opacity-40' : ''
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={marcado}
                        onChange={() => toggle(item.alimentoId)}
                        className="h-5 w-5 shrink-0 accent-[#3e9b4f]"
                      />
                      <ItemImg
                        tipo="foods"
                        id={alimento.id}
                        alt=""
                        emoji={EMOJI_CATEGORIA[alimento.categoria]}
                        className="h-10 w-10 shrink-0 rounded-lg border-2 border-ink"
                      />
                      <span className={`flex-1 font-bold ${marcado ? 'line-through' : ''}`}>
                        {alimento.nombre}
                      </span>
                      <span className="text-right text-sm leading-tight">
                        <span className="block font-bold">
                          {unidades ?? formatearCantidad(item.gramosTotales)}
                        </span>
                        {unidades && (
                          <span className="block text-xs opacity-60">
                            {formatearCantidad(item.gramosTotales)}
                          </span>
                        )}
                      </span>
                    </label>
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
