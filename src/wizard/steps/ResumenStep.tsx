import type { Perfil } from '../../types'
import { calcularBMR, calcularObjetivoDiario, calcularTDEE } from '../../engine/nutrition'
import { Sticker } from '../../components/ui'

const NOMBRE_OBJETIVO: Record<Perfil['objetivo'], string> = {
  perder_grasa: 'perder grasa',
  ganar_musculo: 'ganar músculo',
  recomposicion: 'recomposición corporal',
  mantenimiento: 'mantenimiento',
}

export function ResumenStep({ borrador }: { borrador: Perfil }) {
  const bmr = calcularBMR(borrador)
  const tdee = calcularTDEE(borrador)
  const objetivo = calcularObjetivoDiario(borrador)

  return (
    <div className="flex flex-col gap-5">
      <p className="text-lg">
        {borrador.nombre ? `${borrador.nombre}, estos` : 'Estos'} son tus números para{' '}
        <strong>{NOMBRE_OBJETIVO[borrador.objetivo]}</strong>:
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Sticker tone="mandarina" className="p-3 text-center">
          <p className="font-display text-2xl font-extrabold">{objetivo.kcal}</p>
          <p className="text-xs font-bold">kcal / día</p>
        </Sticker>
        <Sticker tone="frambuesa" className="p-3 text-center">
          <p className="font-display text-2xl font-extrabold">{objetivo.proteinaG} g</p>
          <p className="text-xs font-bold">proteína</p>
        </Sticker>
        <Sticker tone="miel" className="p-3 text-center">
          <p className="font-display text-2xl font-extrabold">{objetivo.grasaG} g</p>
          <p className="text-xs font-bold">grasas</p>
        </Sticker>
        <Sticker tone="cielo" className="p-3 text-center">
          <p className="font-display text-2xl font-extrabold">{objetivo.carbosG} g</p>
          <p className="text-xs font-bold">carbohidratos</p>
        </Sticker>
      </div>

      <div className="rounded-xl border-2 border-dashed border-ink/40 p-4 text-sm leading-relaxed opacity-80">
        <p>
          Tu metabolismo basal es de <strong>{bmr} kcal</strong> y, con tu nivel de actividad,
          gastas unas <strong>{tdee} kcal</strong> al día. Para {NOMBRE_OBJETIVO[borrador.objetivo]}{' '}
          te proponemos <strong>{objetivo.kcal} kcal diarias</strong>.
        </p>
      </div>

      <p className="text-sm opacity-70">
        Al continuar generaremos tu rutina de {borrador.diasEntreno}{' '}
        {borrador.diasEntreno === 1 ? 'día' : 'días'}, tu menú semanal y la lista de la compra.
        Podrás desmarcar los alimentos que no te gusten y regenerar el plan tantas veces como
        quieras.
      </p>
    </div>
  )
}
