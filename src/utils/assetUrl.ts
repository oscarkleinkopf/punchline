/** Prefix a public asset path with Vite's base (e.g. `/punchline/` on GitHub Pages). */
export function assetUrl(path: string): string {
  const base = import.meta.env.BASE_URL
  return `${base}${path.replace(/^\//, '')}`
}
