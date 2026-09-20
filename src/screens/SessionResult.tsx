import { Link, useLocation } from 'react-router-dom'
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
  const focus = lastSession ?? sessions[0] ?? null

  return (
    <div className="page">
      <h1 className="page-title">
        {lastSession ? 'Q.E.D. · Demostración Concluida' : 'Registro de Demostraciones'}
      </h1>
      <p className="page-lead">
        Cálculo de métricas líricas y rendimiento analítico. Todos los vectores de tus sesiones se preservan en este dispositivo.
      </p>

      {focus ? (
        <>
          <p className="section-label">
            Análisis de la Demostración · {modeLabel(focus.mode)}
          </p>
          <div className="metrics-grid">
            <div className="metric">
              <strong>{focus.durationSec}s</strong>
              <span>Δt Duración Total</span>
            </div>
            <div className="metric">
              <strong>{focus.stimuliShown}</strong>
              <span>∑ Postulados Vistos</span>
            </div>
            <div className="metric">
              <strong>{pacePerMinute(focus.stimuliShown, focus.durationSec)}</strong>
              <span>Cadencia / Minuto</span>
            </div>
            {focus.intervalSec != null && (
              <div className="metric">
                <strong>{focus.intervalSec}s</strong>
                <span>Intervalo Base</span>
              </div>
            )}
          </div>
        </>
      ) : (
        <p style={{ color: 'var(--ink-muted)', fontStyle: 'italic' }}>
          No se registran demostraciones previas. Completa una ronda para calcular tus métricas aquí.
        </p>
      )}

      <div className="control-row">
        <Link className="btn btn--primary" to="/entrenar">
          Iniciar Nueva Demostración
        </Link>
        <Link className="btn btn--ghost" to="/estudio">
          Ir al Laboratorio de Estudio
        </Link>
      </div>

      {sessions.length > 0 && (
        <>
          <p className="section-label" style={{ marginTop: '2.5rem' }}>
            Historial de Demostraciones Concluidas
          </p>
          <ul className="history-list">
            {sessions.map((s) => (
              <li key={s.id}>
                <strong>{modeLabel(s.mode)}</strong>
                <span>
                  ∑ {s.stimuliShown} postulados · Δt: {s.durationSec}s ·{' '}
                  {new Date(s.endedAt).toLocaleString('es')}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
