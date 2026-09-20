const WORDS = [
  'espejo',
  'corona',
  'calle',
  'fuego',
  'silencio',
  'eco',
  'veneno',
  'destino',
  'sombra',
  'trueno',
  'puente',
  'máscara',
  'cadena',
  'reloj',
  'tormenta',
  'raíz',
  'humo',
  'brújula',
  'herida',
  'victoria',
  'laberinto',
  'presión',
  'ritmo',
  'verdad',
  'mirada',
  'sangre',
  'cemento',
  'noche',
  'alma',
  'ruido',
  'templo',
  'navaja',
  'orgullo',
  'fracaso',
  'legado',
  'ciudad',
  'huracán',
  'memoria',
  'fantasía',
  'código',
  'rival',
  'escenario',
  'latido',
  'frío',
  'promesa',
  'abismo',
  'estrella',
  'miedo',
  'poder',
  'libertad',
  'juicio',
  'canto',
  'guerra',
  'paz',
  'lluvia',
  'desierto',
  'océano',
  'montaña',
  'puño',
  'voz',
  'papel',
  'tinta',
  'espejismo',
  'ciclo',
  'frente',
  'espalda',
  'trono',
  'pueblo',
  'imperio',
  'axioma',
  'geometría',
  'infinito',
  'fractal',
  'vértice',
  'espiral',
  'dimensión',
  'paradoja',
  'entropía',
  'prisma',
  'ecuación',
  'teseracto',
  'álgebra',
  'coordenada',
  'dualidad',
  'tangente',
  'vector',
  'horizonte',
  'resonancia',
  'núcleo',
  'caos',
  'orden',
  'abstracción',
]

export function pickWord(exclude?: string): string {
  let word = WORDS[Math.floor(Math.random() * WORDS.length)]
  if (exclude && WORDS.length > 1) {
    let guard = 0
    while (word === exclude && guard < 8) {
      word = WORDS[Math.floor(Math.random() * WORDS.length)]
      guard += 1
    }
  }
  return word
}

export function pickWords(count: number): string[] {
  const pool = [...WORDS]
  const result: string[] = []
  while (result.length < count && pool.length) {
    const i = Math.floor(Math.random() * pool.length)
    result.push(pool.splice(i, 1)[0])
  }
  return result
}

export { WORDS }
