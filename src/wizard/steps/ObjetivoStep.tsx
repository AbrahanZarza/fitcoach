import type { NivelActividad, Objetivo, Perfil } from '../../types'
import { OpcionCard } from '../OpcionCard'

interface Props {
  borrador: Perfil
  actualizar: (parcial: Partial<Perfil>) => void
}

const OBJETIVOS: { valor: Objetivo; emoji: string; titulo: string; descripcion: string }[] = [
  { valor: 'perder_grasa', emoji: '🔥', titulo: 'Perder grasa', descripcion: 'Déficit calórico moderado manteniendo el músculo' },
  { valor: 'ganar_musculo', emoji: '💪', titulo: 'Ganar músculo', descripcion: 'Superávit ligero para construir sin acumular grasa' },
  { valor: 'recomposicion', emoji: '⚖️', titulo: 'Recomposición', descripcion: 'Perder grasa y ganar músculo a la vez, poco a poco' },
  { valor: 'mantenimiento', emoji: '🌿', titulo: 'Mantenerme', descripcion: 'Comer y entrenar para sentirte bien y no perder forma' },
]

const ACTIVIDADES: { valor: NivelActividad; emoji: string; titulo: string; descripcion: string }[] = [
  { valor: 'sedentario', emoji: '🛋️', titulo: 'Sedentario', descripcion: 'Trabajo sentado, poco movimiento' },
  { valor: 'ligero', emoji: '🚶', titulo: 'Ligero', descripcion: 'Paseos y algo de movimiento diario' },
  { valor: 'moderado', emoji: '🚴', titulo: 'Moderado', descripcion: 'Activo varios días por semana' },
  { valor: 'activo', emoji: '🏃', titulo: 'Activo', descripcion: 'Ejercicio o trabajo físico casi a diario' },
  { valor: 'muy_activo', emoji: '⚡', titulo: 'Muy activo', descripcion: 'Trabajo físico duro o doble sesión' },
]

export function ObjetivoStep({ borrador, actualizar }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 font-display text-lg font-bold">Tu objetivo</legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {OBJETIVOS.map((o) => (
            <OpcionCard
              key={o.valor}
              seleccionada={borrador.objetivo === o.valor}
              onClick={() => actualizar({ objetivo: o.valor })}
              emoji={o.emoji}
              titulo={o.titulo}
              descripcion={o.descripcion}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 font-display text-lg font-bold">¿Cuántas comidas al día?</legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <OpcionCard
            seleccionada={borrador.comidasDia === 5}
            onClick={() => actualizar({ comidasDia: 5 })}
            emoji="🥪"
            titulo="5 comidas"
            descripcion="Desayuno, comida, merienda, cena y snack"
          />
          <OpcionCard
            seleccionada={borrador.comidasDia === 4}
            onClick={() => actualizar({ comidasDia: 4 })}
            emoji="🍽️"
            titulo="4 comidas"
            descripcion="Desayuno, comida, cena y snack (sin merienda)"
          />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 font-display text-lg font-bold">
          Tu día a día (sin contar el entrenamiento)
        </legend>
        <div className="grid grid-cols-1 gap-2">
          {ACTIVIDADES.map((a) => (
            <OpcionCard
              key={a.valor}
              compacta
              seleccionada={borrador.actividad === a.valor}
              onClick={() => actualizar({ actividad: a.valor })}
              emoji={a.emoji}
              titulo={a.titulo}
              descripcion={a.descripcion}
            />
          ))}
        </div>
      </fieldset>
    </div>
  )
}
