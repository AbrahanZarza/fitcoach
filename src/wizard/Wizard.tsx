import { useState } from 'react'
import type { Perfil } from '../types'
import { useProfileStore } from '../store/profileStore'
import { Stepper } from './Stepper'
import { Boton, Sticker } from '../components/ui'
import { DatosBasicosStep } from './steps/DatosBasicosStep'
import { ObjetivoStep } from './steps/ObjetivoStep'
import { EntrenamientoStep } from './steps/EntrenamientoStep'
import { ResumenStep } from './steps/ResumenStep'

const TOTAL_PASOS = 4

export function Wizard() {
  const setPerfil = useProfileStore((s) => s.setPerfil)
  const [paso, setPaso] = useState(0)
  const [borrador, setBorrador] = useState<Perfil>({
    nombre: '',
    edad: 30,
    sexo: 'hombre',
    alturaCm: 175,
    pesoKg: 75,
    actividad: 'moderado',
    objetivo: 'perder_grasa',
    entorno: 'gimnasio',
    diasEntreno: 4,
    comidasDia: 5,
    rutina: 'auto',
  })

  const actualizar = (parcial: Partial<Perfil>) => setBorrador((b) => ({ ...b, ...parcial }))

  const datosValidos =
    borrador.edad >= 14 &&
    borrador.edad <= 99 &&
    borrador.alturaCm >= 120 &&
    borrador.alturaCm <= 230 &&
    borrador.pesoKg >= 35 &&
    borrador.pesoKg <= 250

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 px-4 py-10">
      <header className="flex items-end justify-between">
        <div>
          <p className="font-display text-sm font-bold tracking-wide text-hoja uppercase">
            FitCoach
          </p>
          <h1 className="font-display text-3xl font-extrabold sm:text-4xl">
            {paso === 0 && 'Cuéntanos sobre ti'}
            {paso === 1 && '¿Qué quieres conseguir?'}
            {paso === 2 && '¿Dónde vas a entrenar?'}
            {paso === 3 && 'Tu plan, listo para el horno'}
          </h1>
        </div>
        <span className="text-4xl" aria-hidden>
          {['📝', '🎯', '🏋️', '🚀'][paso]}
        </span>
      </header>

      <Stepper paso={paso} total={TOTAL_PASOS} />

      <Sticker className="p-5 sm:p-7">
        {paso === 0 && <DatosBasicosStep borrador={borrador} actualizar={actualizar} />}
        {paso === 1 && <ObjetivoStep borrador={borrador} actualizar={actualizar} />}
        {paso === 2 && <EntrenamientoStep borrador={borrador} actualizar={actualizar} />}
        {paso === 3 && <ResumenStep borrador={borrador} />}
      </Sticker>

      <div className="flex items-center justify-between">
        {paso > 0 ? (
          <Boton variante="secundario" onClick={() => setPaso(paso - 1)}>
            ← Atrás
          </Boton>
        ) : (
          <span />
        )}
        {paso < TOTAL_PASOS - 1 ? (
          <Boton onClick={() => setPaso(paso + 1)} disabled={paso === 0 && !datosValidos}>
            Siguiente →
          </Boton>
        ) : (
          <Boton onClick={() => setPerfil(borrador)}>Crear mi plan 🚀</Boton>
        )}
      </div>
    </main>
  )
}
