export interface ObjectStimulus {
  id: string
  label: string
  src: string
}

export const OBJECTS: ObjectStimulus[] = [
  { id: 'mic', label: 'Micrófono', src: '/assets/images/mic.svg' },
  { id: 'crown', label: 'Corona', src: '/assets/images/crown.svg' },
  { id: 'chain', label: 'Cadena', src: '/assets/images/chain.svg' },
  { id: 'mirror', label: 'Espejo', src: '/assets/images/mirror.svg' },
  { id: 'clock', label: 'Reloj', src: '/assets/images/clock.svg' },
  { id: 'fire', label: 'Fuego', src: '/assets/images/fire.svg' },
  { id: 'mask', label: 'Máscara', src: '/assets/images/mask.svg' },
  { id: 'street', label: 'Calle', src: '/assets/images/street.svg' },
]

export function pickObject(excludeId?: string): ObjectStimulus {
  let item = OBJECTS[Math.floor(Math.random() * OBJECTS.length)]
  if (excludeId && OBJECTS.length > 1) {
    let guard = 0
    while (item.id === excludeId && guard < 8) {
      item = OBJECTS[Math.floor(Math.random() * OBJECTS.length)]
      guard += 1
    }
  }
  return item
}
