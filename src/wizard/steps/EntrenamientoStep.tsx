import type { Entorno, Perfil, TipoRutina } from '../../types'
import { OpcionCard } from '../OpcionCard'

interface Props {
  borrador: Perfil
  actualizar: (parcial: Partial<Perfil>) => void
}

const ENTORNOS: { valor: Entorno; emoji: string; titulo: string; descripcion: string }[] = [
  { valor: 'gimnasio', emoji: '🏋️', titulo: 'Gimnasio', descripcion: 'Barras, mancuernas, poleas y máquinas' },
  { valor: 'casa', emoji: '🏠', titulo: 'En casa', descripcion: 'Sin equipamiento: tu peso, una mochila y una toalla' },
  { valor: 'calistenia', emoji: '🤸', titulo: 'Calistenia', descripcion: 'Parque con barras, paralelas y espalderas' },
]

const RUTINAS: { valor: TipoRutina; emoji: string; titulo: string; descripcion: string }[] = [
  { valor: 'auto', emoji: '✨', titulo: 'Recomendada', descripcion: 'Elegimos el split que mejor encaja con tus días' },
  { valor: 'full_body', emoji: '🧍', titulo: 'Full-body', descripcion: 'Todo el cuerpo en cada sesión' },
  { valor: 'torso_pierna', emoji: '🔀', titulo: 'Torso / Pierna', descripcion: 'Alterna tren superior e inferior' },
  { valor: 'ppl', emoji: '🔁', titulo: 'Push / Pull / Legs', descripcion: 'Empuje, tirón y pierna por patrones' },
  { valor: 'grupos', emoji: '🎯', titulo: 'Weider (por grupos)', descripcion: 'Un grupo muscular protagonista por día' },
]

export function EntrenamientoStep({ borrador, actualizar }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 font-display text-lg font-bold">Tu sitio para entrenar</legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {ENTORNOS.map((e) => (
            <OpcionCard
              key={e.valor}
              seleccionada={borrador.entorno === e.valor}
              onClick={() => actualizar({ entorno: e.valor })}
              emoji={e.emoji}
              titulo={e.titulo}
              descripcion={e.descripcion}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 font-display text-lg font-bold">
          ¿Cuántos días puedes entrenar a la semana?
        </legend>
        <div className="flex flex-wrap gap-2">
          {([1, 2, 3, 4, 5, 6] as const).map((d) => (
            <button
              key={d}
              type="button"
              aria-pressed={borrador.diasEntreno === d}
              onClick={() => actualizar({ diasEntreno: d })}
              className={`h-12 w-12 cursor-pointer rounded-xl border-2 border-ink font-display text-lg font-bold transition-all ${
                borrador.diasEntreno === d
                  ? 'bg-mandarina text-white shadow-sticker-sm -rotate-3'
                  : 'bg-white shadow-sticker-sm hover:-translate-y-0.5'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 font-display text-lg font-bold">Tu tipo de rutina</legend>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {RUTINAS.map((r) => (
            <OpcionCard
              key={r.valor}
              compacta
              seleccionada={borrador.rutina === r.valor}
              onClick={() => actualizar({ rutina: r.valor })}
              emoji={r.emoji}
              titulo={r.titulo}
              descripcion={r.descripcion}
            />
          ))}
        </div>
        <p className="text-sm opacity-70">
          {borrador.rutina === 'auto' &&
            (borrador.diasEntreno <= 3
              ? 'Con tus días te montaremos un cuerpo completo: máximo aprovechamiento por sesión.'
              : borrador.diasEntreno === 4
                ? 'Con 4 días te montaremos un torso / pierna: buen equilibrio entre volumen y descanso.'
                : 'Con tus días te montaremos un push / pull / legs: volumen alto repartido por patrones.')}
          {borrador.rutina === 'full_body' && 'Cada sesión trabaja todo el cuerpo alternando énfasis A/B.'}
          {borrador.rutina === 'torso_pierna' && 'Sesiones alternas de tren superior y tren inferior.'}
          {borrador.rutina === 'ppl' && 'El clásico push/pull/legs: empuje, tirón y pierna en ciclo.'}
          {borrador.rutina === 'grupos' &&
            'La rutina Weider de toda la vida: pecho, espalda, pierna, hombros y brazos, cada uno en su día. Brilla con 5 días.'}
        </p>
      </fieldset>
    </div>
  )
}
