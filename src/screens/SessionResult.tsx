import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { SessionReplay } from '../components/SessionReplay'
import {
  loadSessions,
  modeLabel,
  pacePerMinute,
  type SessionMetrics,
} from '../utils/metrics'

export function SessionResult() {
  const location = useLocation()
  const lastSession = (location.state as { lastSession?: SessionMetrics } | null)?.lastSession
  const sessions = loadSessions()
  const [selectedId, setSelectedId] = useState<string | null>(lastSession?.id ?? sessions[0]?.id ?? null)
  const focus =
    sessions.find((s) => s.id === selectedId) ?? lastSession ?? sessions[0] ?? null

  return (
    <div className="page">
      <h1 className="page-title">{lastSession ? 'Sesión completa' : 'Historial'}</h1>
      <p className="page-lead">
        Replay local: tu take y las palabras del round se quedan en este dispositivo.
      </p>

      {focus ? (
        <>
          <p className="section-label">
            {lastSession && focus.id === lastSession.id ? 'Última sesión' : 'Sesión'} ·{' '}
            {modeLabel(focus.mode)}
          </p>
          <div className="metrics-grid">
            <div className="metric">
              <strong>{focus.durationSec}s</strong>
              <span>Duración</span>
            </div>
            <div className="metric">
              <strong>{focus.stimuliShown}</strong>
              <span>Estímulos</span>
            </div>
            <div className="metric">
              <strong>{pacePerMinute(focus.stimuliShown, focus.durationSec)}</strong>
              <span>Ritmo / min</span>
            </div>
            {focus.intervalSec != null && (
              <div className="metric">
                <strong>{focus.intervalSec}s</strong>
                <span>Intervalo</span>
              </div>
            )}
            <div className="metric">
              <strong>{focus.hasTake ? 'Sí' : 'No'}</strong>
              <span>Take</span>
            </div>
          </div>
          <SessionReplay session={focus} />
        </>
      ) : (
        <p style={{ color: 'var(--ink-muted)' }}>
          Aún no hay sesiones. Completa un entrenamiento para ver métricas aquí.
        </p>
      )}

      <div className="control-row">
        <Link className="btn btn--primary" to="/entrenar">
          Entrenar de nuevo
        </Link>
        <Link className="btn btn--ghost" to="/estudio">
          Ir al estudio
        </Link>
      </div>

      {sessions.length > 0 && (
        <>
          <p className="section-label" style={{ marginTop: '2rem' }}>
            Historial reciente
          </p>
          <ul className="history-list">
            {sessions.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  className={`history-pick${focus?.id === s.id ? ' history-pick--active' : ''}`}
                  onClick={() => setSelectedId(s.id)}
                >
                  <strong>
                    {modeLabel(s.mode)}
                    {s.hasTake ? ' · take' : ''}
                  </strong>
                  <span>
                    {s.stimuliShown} estímulos · {s.durationSec}s ·{' '}
                    {new Date(s.endedAt).toLocaleString('es')}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
