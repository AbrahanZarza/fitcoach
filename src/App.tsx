import { useProfileStore } from './store/profileStore'
import { Wizard } from './wizard/Wizard'
import { Dashboard } from './dashboard/Dashboard'

export default function App() {
  const perfil = useProfileStore((s) => s.perfil)
  return perfil ? <Dashboard perfil={perfil} /> : <Wizard />
}
