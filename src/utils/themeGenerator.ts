const ABSTRACT = [
  'Axioma vs Paradoja',
  'Infinito vs Cero',
  'Geometría vs Azar',
  'Consciencia vs Materia',
  'Entropía vs Equilibrio',
  'Dimensión vs Vacío',
  'Determinismo vs Libertad',
  'Cine vs Literatura',
  'Pasado vs Futuro',
  'Amor vs Odio',
  'Sueño vs Realidad',
  'Caos vs Orden',
  'Luz vs Sombra',
  'Calle vs Academia',
  'Fuego vs Hielo',
  'Silencio vs Ruido',
  'Libertad vs Destino',
  'Tiempo vs Memoria',
  'Verdad vs Mentira',
  'Razón vs Instinto',
  'Causa vs Efecto',
]

const CHARACTERS = [
  'Filósofo vs Tirano',
  'Arquitecto vs Demoledor',
  'Alquimista vs Astrónomo',
  'Oráculo vs Hereje',
  'Héroe vs Villano',
  'Rey vs Bufón',
  'Detective vs Criminal',
  'Ángel vs Demonio',
  'Pirata vs Almirante',
  'Samurái vs Ninja',
  'Robot vs Humano',
  'Poeta vs Guerrero',
  'Fantasma vs Cazador',
  'Juez vs Acusado',
  'Mago vs Científico',
  'Lobo vs Cordero',
]

export type ThemeKind = 'abstract' | 'characters' | 'mixed'

export function pickTheme(kind: ThemeKind = 'mixed'): string {
  const pool =
    kind === 'abstract' ? ABSTRACT : kind === 'characters' ? CHARACTERS : [...ABSTRACT, ...CHARACTERS]
  return pool[Math.floor(Math.random() * pool.length)]
}

export function formatTheme(theme: string): { left: string; right: string } {
  const [left, right] = theme.split(' vs ').map((s) => s.trim())
  return { left: left ?? theme, right: right ?? '' }
}

export { ABSTRACT, CHARACTERS }
