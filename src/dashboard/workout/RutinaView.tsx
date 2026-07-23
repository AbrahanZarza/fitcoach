import type { Perfil, RutinaSemanal } from '../../types'
import { EJERCICIOS_POR_ID } from '../../data'
import { Etiqueta, Sticker } from '../../components/ui'
import { ItemImg } from '../../components/ItemImg'
import { EMOJI_GRUPO, NOMBRE_GRUPO } from '../../components/emoji'

const NOMBRE_ENTORNO: Record<Perfil['entorno'], string> = {
  gimnasio: 'en el gimnasio',
  casa: 'en casa sin equipamiento',
  calistenia: 'de calistenia',
}

export function RutinaView({ rutina, perfil }: { rutina: RutinaSemanal; perfil: Perfil }) {
  return (
    <section className="flex flex-col gap-4" aria-label="Plan de entrenamiento">
      <p className="text-sm opacity-80">
        Rutina <strong>{rutina.split}</strong> de {rutina.dias.length}{' '}
        {rutina.dias.length === 1 ? 'día' : 'días'} {NOMBRE_ENTORNO[perfil.entorno]}. Descansa al
        menos un día entre sesiones que repitan grupos musculares.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {rutina.dias.map((dia) => (
          <Sticker key={dia.titulo} className="overflow-hidden">
            <div className="border-b-2 border-ink bg-cielo-suave px-4 py-2">
              <h2 className="font-display text-lg font-extrabold">{dia.titulo}</h2>
            </div>
            <ul className="flex flex-col divide-y-2 divide-dashed divide-ink/15">
              {dia.ejercicios.map((ep, i) => {
                const ejercicio = EJERCICIOS_POR_ID.get(ep.ejercicioId)!
                return (
                  <li key={`${ep.ejercicioId}-${i}`} className="flex items-center gap-3 px-4 py-2.5">
                    <ItemImg
                      tipo="exercises"
                      id={ejercicio.id}
                      alt={ejercicio.nombre}
                      emoji={EMOJI_GRUPO[ejercicio.grupo]}
                      className="h-14 w-14 shrink-0 rounded-xl border-2 border-ink"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-display font-bold leading-tight">{ejercicio.nombre}</p>
                      <p className="text-xs opacity-70">
                        {ep.series} series × {ep.repeticiones} reps · descanso{' '}
                        {Math.round(ep.descansoSeg / 60) >= 1
                          ? `${Math.round((ep.descansoSeg / 60) * 10) / 10} min`
                          : `${ep.descansoSeg} s`}
                      </p>
                    </div>
                    <Etiqueta className="hidden shrink-0 bg-white sm:inline-block">
                      {NOMBRE_GRUPO[ejercicio.grupo]}
                    </Etiqueta>
                  </li>
                )
              })}
            </ul>
          </Sticker>
        ))}
      </div>

      <Sticker tone="hoja" className="p-4 text-sm">
        <p className="font-display font-bold">Consejo del entrenador 🧢</p>
        <p className="mt-1">
          {perfil.objetivo === 'perder_grasa' &&
            'Añade 20-30 minutos de cardio suave (caminar rápido, bici) los días que no entrenes: acelera el déficit sin robarte energía.'}
          {perfil.objetivo === 'ganar_musculo' &&
            'Apunta tus pesos y sube la carga o las repeticiones cada semana: la progresión es lo que construye músculo.'}
          {perfil.objetivo === 'recomposicion' &&
            'Prioriza dormir 7-8 horas: la recomposición ocurre cuando entrenas duro y recuperas mejor.'}
          {perfil.objetivo === 'mantenimiento' &&
            'La constancia gana a la intensidad: mejor 3 sesiones que disfrutes que 6 que abandones en febrero.'}
        </p>
      </Sticker>
    </section>
  )
}
