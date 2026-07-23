import { create } from 'zustand'

export type Tab = 'menu' | 'entrenamiento' | 'compra' | 'alimentos'

interface UiState {
  tab: Tab
  setTab: (tab: Tab) => void
}

export const useUiStore = create<UiState>()((set) => ({
  tab: 'menu',
  setTab: (tab) => set({ tab }),
}))
