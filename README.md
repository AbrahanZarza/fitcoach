# FitCoach 💪🥗

Tu nutricionista y entrenador personal en el navegador. Cuéntale a FitCoach cómo eres y qué
quieres conseguir con tu cuerpo, y te preparará:

- **Una rutina de entrenamiento semanal** adaptada a tu entorno: gimnasio con equipamiento,
  casa sin material, o calistenia en parque. Puedes elegir el tipo de rutina — full-body,
  torso/pierna, push/pull/legs o Weider por grupos musculares — o dejar que FitCoach elija
  el split que mejor encaja con tus días. Las series y repeticiones se ajustan a tu objetivo.
- **Un menú semanal** (7 días × 4 o 5 comidas: desayuno, comida, merienda opcional, cena y
  snack) que converge a tu objetivo de calorías y proteína, con cantidades en gramos por
  ingrediente.
- **La lista de la compra** de toda la semana, agregada y ordenada por pasillos de
  supermercado, en unidades naturales ("12 huevos", "5 tomates", "2 botes") además de gramos.

En la pestaña **Mis alimentos** todos los alimentos vienen marcados de serie: desmarca los que
no te gusten o no te sienten bien y el menú se replanifica al instante. Si te pasas desmarcando,
FitCoach te sugiere qué alimentos re-marcar para desbloquear más platos.

## Cómo funciona

100% frontend, sin backend ni APIs: todo se calcula en local con un motor determinista.

- **Gasto energético**: BMR con Mifflin-St Jeor → TDEE por nivel de actividad → ajuste según
  objetivo (déficit/superávit acotado, con suelo de seguridad) → reparto de macros
  (proteína por g/kg, grasas, carbohidratos).
- **Menús**: selección greedy con puntuación (error calórico y proteico, penalización por
  repetición) sobre una base de ~40 platos compuestos de ~60 alimentos españoles con macros
  reales; las raciones se escalan (×0.75–×1.75) y cada día se repara para quedar dentro de
  ±10% del objetivo. Generación con semilla: **🎲 Regenerar** produce una variación nueva y
  reproducible.
- **Persistencia**: tu perfil, tu selección de alimentos y la semilla se guardan en
  `localStorage`. Nada sale de tu navegador.
- **Ilustraciones**: ~150 imágenes flat/vectoriales generadas con
  [Magnific](https://www.magnific.com) (Recraft V4.1), optimizadas a WebP (~5 KB cada una).

## Desarrollo

Con Docker (recomendado, no necesitas node en tu máquina):

```bash
make dev          # arranca el entorno de desarrollo en http://localhost:5173
make down         # para el entorno
make install      # instala las dependencias de node en el contenedor
make build-pro    # construye los assets de producción en ./dist
```

O en local, sin Docker:

```bash
npm install
npm run dev       # servidor de desarrollo
npm run test      # tests del motor (vitest)
npm run lint      # oxlint
npm run build     # producción (tsc + vite)
```

Stack: Vite 8 · React 19 · TypeScript 6 · Tailwind CSS 4 · Zustand 5.

La lógica vive en `src/engine/` (funciones puras, sin React) y los datos curados en
`src/data/`. Los tests de integridad (`dataIntegrity.test.ts`) garantizan que la base de
datos de alimentos, platos y ejercicios se mantiene coherente al editarla.
