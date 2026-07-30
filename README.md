# Punchline

Gimnasio mental y estudio interactivo para freestylers. Entrena agilidad, narrativa y flow con estímulos en vivo, beats adaptativos y grabación sobre instrumental.

**Live:** [https://oscarkleinkopf.github.io/punchline/](https://oscarkleinkopf.github.io/punchline/)

> Si la app no carga, en el repo ve a **Settings → Pages** y elige Branch **`gh-pages`** / root (o Source: **GitHub Actions**).

## Stack

- **Vite + React + TypeScript**
- **React Router** (SPA)
- **Web Audio API** + **MediaRecorder**
- **GitHub Pages** (hosting)
- **Netlify** plugin retained for optional local Netlify primitives

## Desarrollo

```bash
npm install
npm run dev
```

Abre la URL local de Vite (`base` de producción es `/punchline/` para GitHub Pages).

```bash
npm run build
npm run preview
```

`postbuild` copia `dist/index.html` → `dist/404.html` para el fallback SPA en Pages.

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
├── .github/workflows/deploy-pages.yml
├── netlify.toml
└── package.json
```

## Deploy (GitHub Pages)

Cada push a `main` ejecuta el workflow **Deploy GitHub Pages**.

1. En el repo: **Settings → Pages → Source: GitHub Actions**
2. Tras el primer deploy: [https://oscarkleinkopf.github.io/punchline/](https://oscarkleinkopf.github.io/punchline/)

Micrófono y grabación requieren HTTPS (GitHub Pages ya lo ofrece) o `localhost` en desarrollo.

## Notas

- Los beats incluidos son loops sintéticos de placeholder; sustituye los WAV en `public/assets/beats/` y actualiza `src/utils/beats.ts`.
- Fuera del MVP: STT / análisis de rimas, export a Reels/TikTok, cuentas de usuario.
