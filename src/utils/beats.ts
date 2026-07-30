import { assetUrl } from './assetUrl'

export type Genre = 'boom-bap' | 'trap' | 'drill' | 'reggaeton'

export interface Beat {
  id: string
  title: string
  genre: Genre
  bpm: number
  src: string
}

export const GENRE_LABELS: Record<Genre, string> = {
  'boom-bap': 'Boom Bap',
  trap: 'Trap',
  drill: 'Drill',
  reggaeton: 'Reggaeton',
}

export const BEATS: Beat[] = [
  {
    id: 'boom-bap-90',
    title: 'Cemento Viejo',
    genre: 'boom-bap',
    bpm: 90,
    src: assetUrl('assets/beats/boom-bap-90.wav'),
  },
  {
    id: 'boom-bap-95',
    title: 'Cinta Marrón',
    genre: 'boom-bap',
    bpm: 95,
    src: assetUrl('assets/beats/boom-bap-95.wav'),
  },
  {
    id: 'trap-140',
    title: 'Neón Bajo',
    genre: 'trap',
    bpm: 140,
    src: assetUrl('assets/beats/trap-140.wav'),
  },
  {
    id: 'trap-150',
    title: 'Humo Digital',
    genre: 'trap',
    bpm: 150,
    src: assetUrl('assets/beats/trap-150.wav'),
  },
  {
    id: 'drill-140',
    title: 'Filo Frío',
    genre: 'drill',
    bpm: 140,
    src: assetUrl('assets/beats/drill-140.wav'),
  },
  {
    id: 'drill-145',
    title: 'Calle Norte',
    genre: 'drill',
    bpm: 145,
    src: assetUrl('assets/beats/drill-145.wav'),
  },
  {
    id: 'reggaeton-95',
    title: 'DemBow Sala',
    genre: 'reggaeton',
    bpm: 95,
    src: assetUrl('assets/beats/reggaeton-95.wav'),
  },
  {
    id: 'reggaeton-100',
    title: 'Patio Tropical',
    genre: 'reggaeton',
    bpm: 100,
    src: assetUrl('assets/beats/reggaeton-100.wav'),
  },
]

export function filterBeats(opts: {
  genre?: Genre | 'all'
  bpmMin?: number
  bpmMax?: number
}): Beat[] {
  return BEATS.filter((b) => {
    if (opts.genre && opts.genre !== 'all' && b.genre !== opts.genre) return false
    if (opts.bpmMin != null && b.bpm < opts.bpmMin) return false
    if (opts.bpmMax != null && b.bpm > opts.bpmMax) return false
    return true
  })
}
