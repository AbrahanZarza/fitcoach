import type { Perfil } from '../../types'
import { OpcionCard } from '../OpcionCard'

interface Props {
  borrador: Perfil
  actualizar: (parcial: Partial<Perfil>) => void
}

function Campo({
  etiqueta,
  sufijo,
  valor,
  min,
  max,
  onChange,
}: {
  etiqueta: string
  sufijo: string
  valor: number
  min: number
  max: number
  onChange: (n: number) => void
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-bold">{etiqueta}</span>
      <div className="flex items-center gap-2 rounded-xl border-2 border-ink bg-white px-3 py-2 shadow-sticker-sm focus-within:shadow-none focus-within:translate-x-0.5 focus-within:translate-y-0.5 transition-all">
        <input
          type="number"
          value={Number.isNaN(valor) ? '' : valor}
          min={min}
          max={max}
          onChange={(e) => onChange(e.target.valueAsNumber)}
          className="w-full bg-transparent font-display text-lg font-bold outline-none"
        />
        <span className="text-sm opacity-60">{sufijo}</span>
      </div>
    </label>
  )
}

export function DatosBasicosStep({ borrador, actualizar }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <label className="flex flex-col gap-1">
        <span className="text-sm font-bold">¿Cómo te llamamos?</span>
        <input
          type="text"
          value={borrador.nombre}
          placeholder="Tu nombre (opcional)"
          onChange={(e) => actualizar({ nombre: e.target.value })}
          className="rounded-xl border-2 border-ink bg-white px-3 py-2 font-display text-lg font-bold shadow-sticker-sm outline-none transition-all focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-none"
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <OpcionCard
          compacta
          seleccionada={borrador.sexo === 'hombre'}
          onClick={() => actualizar({ sexo: 'hombre' })}
          emoji="👨"
          titulo="Hombre"
        />
        <OpcionCard
          compacta
          seleccionada={borrador.sexo === 'mujer'}
          onClick={() => actualizar({ sexo: 'mujer' })}
          emoji="👩"
          titulo="Mujer"
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Campo
          etiqueta="Edad"
          sufijo="años"
          valor={borrador.edad}
          min={14}
          max={99}
          onChange={(n) => actualizar({ edad: n })}
        />
        <Campo
          etiqueta="Altura"
          sufijo="cm"
          valor={borrador.alturaCm}
          min={120}
          max={230}
          onChange={(n) => actualizar({ alturaCm: n })}
        />
        <Campo
          etiqueta="Peso"
          sufijo="kg"
          valor={borrador.pesoKg}
          min={35}
          max={250}
          onChange={(n) => actualizar({ pesoKg: n })}
        />
      </div>

      <p className="text-sm opacity-70">
        Estos datos solo se usan para calcular tu gasto energético. Se guardan en tu navegador y no
        salen de ahí.
      </p>
    </div>
  )
}
