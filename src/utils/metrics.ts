export type TrainingMode = 'words' | 'themes' | 'objects' | 'free'

export interface SessionMetrics {
  id: string
  mode: TrainingMode
  startedAt: string
  endedAt: string
  durationSec: number
  stimuliShown: number
  intervalSec?: number
  difficulty?: 'easy' | 'hard' | 'custom'
  notes?: string
}

const STORAGE_KEY = 'punchline.sessions'
const MAX_SESSIONS = 20

export function saveSession(session: SessionMetrics): void {
  const all = loadSessions()
  all.unshift(session)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all.slice(0, MAX_SESSIONS)))
}

export function loadSessions(): SessionMetrics[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as SessionMetrics[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function createSessionId(): string {
  return `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`
}

export function modeLabel(mode: TrainingMode): string {
  switch (mode) {
    case 'words':
      return 'Palabras'
    case 'themes':
      return 'Temáticas'
    case 'objects':
      return 'Objetos'
    case 'free':
      return 'Minuto libre'
  }
}

export function pacePerMinute(stimuliShown: number, durationSec: number): number {
  if (durationSec <= 0) return 0
  return Math.round((stimuliShown / durationSec) * 60)
}
