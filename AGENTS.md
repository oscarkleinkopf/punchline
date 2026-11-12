# punchline

El gimnasio de entrenamiento y estudio interactivo para freestylers.

## Cursor Cloud specific instructions

- Current repository state: this repo currently contains only `README.md` (a product
  description) and this file. There is **no application code, no `package.json`, no
  build config, and no tests yet**. As a result there is nothing to lint, build, run,
  or test until the application is scaffolded.
- Tooling available on the VM: Node.js v22 and npm v10 are installed. The Netlify CLI
  is available via `npx netlify` (this project is intended to deploy on Netlify — see
  the Netlify platform skills for functions, edge functions, database, blobs, etc.).
- Update script: the startup update script is guarded so it only runs `npm install`
  once a `package.json` exists. It is a safe no-op while the repo has no code, so it
  will not fail on the current empty state.
- Once code is added (e.g. a Vite/React or other Netlify-supported framework):
  - install deps with the package manager matching the lockfile (`npm`/`pnpm`/`yarn`),
  - run the dev server with `npx netlify dev` (preferred for Netlify projects, since it
    also serves Functions/Edge Functions), or the framework's own dev command
    (e.g. `npm run dev`),
  - refer to `package.json` scripts and `netlify.toml` for the canonical
    lint/test/build/run commands rather than hardcoding them here.
