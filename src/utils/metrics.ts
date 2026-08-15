import { pruneTakes } from './takes'

export type TrainingMode = 'words' | 'themes' | 'objects' | 'free'

export interface StimulusRecord {
  kind: 'word' | 'theme' | 'object'
  value: string
  offsetMs: number
  objectSrc?: string
  objectLabel?: string
}

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
  stimuli?: StimulusRecord[]
  hasTake?: boolean
}

const STORAGE_KEY = 'punchline.sessions'
const MAX_SESSIONS = 20

export function saveSession(session: SessionMetrics): void {
  const all = loadSessions()
  all.unshift(session)
  const kept = all.slice(0, MAX_SESSIONS)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(kept))
  void pruneTakes(kept.filter((s) => s.hasTake).map((s) => s.id))
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

export function getSession(id: string): SessionMetrics | null {
  return loadSessions().find((s) => s.id === id) ?? null
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

export function formatOffset(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000))
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}
