# Punchline

Gimnasio mental y estudio interactivo para freestylers. Entrena agilidad, narrativa y flow con estímulos en vivo, beats adaptativos y grabación sobre instrumental.

## Stack

- **Vite + React + TypeScript**
- **React Router** (SPA)
- **Web Audio API** + **MediaRecorder**
- **Netlify** (`@netlify/vite-plugin`, SPA redirect)

## Desarrollo

```bash
npm install
npm run dev
```

Abre la URL local de Vite. El plugin de Netlify deja disponibles primitivas de la plataforma en local.

```bash
npm run build
npm run preview
```

## Funciones del MVP

| Área | Qué incluye |
|------|-------------|
| **Entrenar** | Palabras incrementales, temáticas/personajes, objetos/imágenes, minuto libre |
| **Estudio** | Biblioteca multigénero (Boom Bap, Trap, Drill, Reggaeton), filtro BPM, tempo en vivo |
| **Grabación** | Voz sobre beat, volumen por pista, descarga WebM |
| **Sesiones** | Métricas e historial en `localStorage` |

## Estructura

```text
punchline/
├── public/assets/
│   ├── beats/          # Instrumentales placeholder (WAV sintéticos)
│   └── images/         # Estímulos visuales
├── src/
│   ├── components/
│   ├── screens/
│   ├── services/       # audioEngine, stimuliEngine, recorder
│   ├── styles/
│   └── utils/
├── netlify.toml
└── package.json
```

## Notas

- Los beats incluidos son loops sintéticos de placeholder; sustituye los WAV en `public/assets/beats/` y actualiza `src/utils/beats.ts`.
- Micrófono y grabación requieren HTTPS en producción (o `localhost` en desarrollo).
- Fuera del MVP: STT / análisis de rimas, export a Reels/TikTok, cuentas de usuario.

## Deploy (Netlify)

Build: `npm run build` · Publish: `dist` · Redirect SPA configurado en `netlify.toml`.
