import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Perfil } from '../types'

interface ProfileState {
  perfil: Perfil | null
  /** ids de alimentos que el usuario ha desmarcado (no le gustan / le sientan mal) */
  excluidos: string[]
  semilla: number
  setPerfil: (perfil: Perfil) => void
  toggleAlimento: (id: string) => void
  incluirAlimento: (id: string) => void
  regenerar: () => void
  reiniciar: () => void
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      perfil: null,
      excluidos: [],
      semilla: 1,
      setPerfil: (perfil) => set({ perfil }),
      toggleAlimento: (id) =>
        set((s) => ({
          excluidos: s.excluidos.includes(id)
            ? s.excluidos.filter((x) => x !== id)
            : [...s.excluidos, id],
        })),
      incluirAlimento: (id) =>
        set((s) => ({ excluidos: s.excluidos.filter((x) => x !== id) })),
      regenerar: () => set((s) => ({ semilla: s.semilla + 1 })),
      reiniciar: () => set({ perfil: null, excluidos: [], semilla: 1 }),
    }),
    {
      name: 'fitcoach-perfil',
      version: 2,
      migrate: (estado) => {
        // v1 → v2: se añadieron comidasDia y rutina al perfil
        const s = estado as ProfileState
        if (s?.perfil) {
          s.perfil = {
            ...s.perfil,
            comidasDia: s.perfil.comidasDia ?? 5,
            rutina: s.perfil.rutina ?? 'auto',
          }
        }
        return s
      },
    },
  ),
)
