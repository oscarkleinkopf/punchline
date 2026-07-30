import { assetUrl } from './assetUrl'

export interface ObjectStimulus {
  id: string
  label: string
  src: string
}

export const OBJECTS: ObjectStimulus[] = [
  { id: 'mic', label: 'Micrófono', src: assetUrl('assets/images/mic.svg') },
  { id: 'crown', label: 'Corona', src: assetUrl('assets/images/crown.svg') },
  { id: 'chain', label: 'Cadena', src: assetUrl('assets/images/chain.svg') },
  { id: 'mirror', label: 'Espejo', src: assetUrl('assets/images/mirror.svg') },
  { id: 'clock', label: 'Reloj', src: assetUrl('assets/images/clock.svg') },
  { id: 'fire', label: 'Fuego', src: assetUrl('assets/images/fire.svg') },
  { id: 'mask', label: 'Máscara', src: assetUrl('assets/images/mask.svg') },
  { id: 'street', label: 'Calle', src: assetUrl('assets/images/street.svg') },
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
