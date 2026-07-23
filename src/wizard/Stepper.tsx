export function Stepper({ paso, total }: { paso: number; total: number }) {
  return (
    <div className="flex items-center gap-2" aria-label={`Paso ${paso + 1} de ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`h-3 rounded-full border-2 border-ink transition-all ${
            i === paso ? 'w-8 bg-mandarina' : i < paso ? 'w-3 bg-hoja' : 'w-3 bg-white'
          }`}
        />
      ))}
    </div>
  )
}
