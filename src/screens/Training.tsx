import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { StimulusDisplay } from '../components/StimulusDisplay'
import { Timer } from '../components/Timer'
import { BeatPlayer } from '../components/BeatPlayer'
import { audioEngine } from '../services/audioEngine'
import { recorder } from '../services/recorder'
import { stimuliEngine, type Stimulus } from '../services/stimuliEngine'
import { saveTake } from '../utils/takes'
import {
  createSessionId,
  saveSession,
  type SessionMetrics,
  type StimulusRecord,
  type TrainingMode,
} from '../utils/metrics'

type Difficulty = 'easy' | 'hard' | 'custom'

const INTERVALS: Record<Exclude<Difficulty, 'custom'>, number> = {
  easy: 10,
  hard: 2.5,
}

export function Training() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<TrainingMode>('words')
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [customInterval, setCustomInterval] = useState(5)
  const [recordEnabled, setRecordEnabled] = useState(true)
  const [running, setRunning] = useState(false)
  const [starting, setStarting] = useState(false)
  const [recording, setRecording] = useState(false)
  const [micError, setMicError] = useState<string | null>(null)
  const [stimulus, setStimulus] = useState<Stimulus | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [remaining, setRemaining] = useState(60)
  const [shown, setShown] = useState(0)

  const startedAt = useRef<number | null>(null)
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const finishing = useRef(false)
  const recordedThisSession = useRef(false)
  const stimuliLog = useRef<StimulusRecord[]>([])
  const configRef = useRef({ mode, difficulty, intervalSec: 10 })

  const intervalSec =
    mode === 'free' ? 0 : difficulty === 'custom' ? customInterval : INTERVALS[difficulty]

  configRef.current = { mode, difficulty, intervalSec }

  useEffect(() => {
    return () => {
      stimuliEngine.stop()
      if (tickRef.current) clearInterval(tickRef.current)
      if (recorder.getState() === 'recording') {
        void recorder.stop()
      }
    }
  }, [])

  const clearTimers = () => {
    stimuliEngine.stop()
    if (tickRef.current) {
      clearInterval(tickRef.current)
      tickRef.current = null
    }
  }

  const completeSession = async () => {
    clearTimers()
    setRunning(false)
    setRecording(false)
    audioEngine.pause()

    let blob: Blob | null = null
    if (recordedThisSession.current) {
      blob = await recorder.stop()
    }

    const { mode: m, difficulty: d, intervalSec: interval } = configRef.current
    const end = Date.now()
    const start = startedAt.current ?? end
    const durationSec = Math.max(1, Math.round((end - start) / 1000))
    const id = createSessionId()
    const stimuli = stimuliLog.current
    let hasTake = Boolean(blob && blob.size > 0)
    if (hasTake && blob) {
      try {
        await saveTake(id, blob)
      } catch {
        hasTake = false
      }
    }
    const metrics: SessionMetrics = {
      id,
      mode: m,
      startedAt: new Date(start).toISOString(),
      endedAt: new Date(end).toISOString(),
      durationSec,
      stimuliShown: m === 'free' ? 0 : stimuli.length || stimuliEngine.getShownCount(),
      intervalSec: m === 'free' ? undefined : interval,
      difficulty: m === 'free' ? undefined : d,
      stimuli,
      hasTake,
    }
    saveSession(metrics)
    navigate('/resultados', { state: { lastSession: metrics } })
  }

  const finishSession = () => {
    if (finishing.current) return
    finishing.current = true
    void completeSession()
  }

  const beginTimers = () => {
    startedAt.current = Date.now()
    setRunning(true)

    tickRef.current = setInterval(() => {
      const startMs = startedAt.current ?? Date.now()
      const secs = Math.floor((Date.now() - startMs) / 1000)
      setElapsed(secs)
      if (configRef.current.mode === 'free') {
        const left = Math.max(0, 60 - secs)
        setRemaining(left)
        if (left === 0) finishSession()
      }
    }, 250)

    if (configRef.current.mode !== 'free') {
      const kind =
        configRef.current.mode === 'words'
          ? 'word'
          : configRef.current.mode === 'themes'
            ? 'theme'
            : 'object'
      stimuliEngine.start({
        kind,
        intervalMs: configRef.current.intervalSec * 1000,
        onStimulus: (s) => {
          const offsetMs = Date.now() - (startedAt.current ?? Date.now())
          stimuliLog.current.push({
            kind: s.kind,
            value: s.value,
            offsetMs,
            objectSrc: s.object?.src,
            objectLabel: s.object?.label,
          })
          setStimulus(s)
          setShown(stimuliLog.current.length)
        },
      })
    }
  }

  const start = async () => {
    clearTimers()
    finishing.current = false
    recordedThisSession.current = false
    stimuliLog.current = []
    setStimulus(null)
    setElapsed(0)
    setRemaining(60)
    setShown(0)
    setMicError(null)
    setRecording(false)

    if (recordEnabled) {
      setStarting(true)
      try {
        await recorder.start()
        recordedThisSession.current = true
        setRecording(true)
      } catch {
        setMicError('No se pudo acceder al micrófono. La sesión sigue sin grabar.')
      }
      setStarting(false)
    }

    beginTimers()
  }

  const stop = () => {
    if (!running) return
    finishSession()
  }

  return (
    <div className="page">
      <h1 className="page-title">Entrenamiento</h1>
      <p className="page-lead">
        Elige un estímulo en vivo. Entrena agilidad, narrativa o respuesta bajo presión.
      </p>

      <p className="section-label">Modo</p>
      <div className="control-row">
        {(
          [
            ['words', 'Palabras'],
            ['themes', 'Temáticas'],
            ['objects', 'Objetos'],
            ['free', 'Minuto libre'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`chip${mode === id ? ' chip--active' : ''}`}
            disabled={running || starting}
            onClick={() => setMode(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {mode !== 'free' && (
        <>
          <p className="section-label">Velocidad</p>
          <div className="control-row">
            <button
              type="button"
              className={`chip${difficulty === 'easy' ? ' chip--active' : ''}`}
              disabled={running || starting}
              onClick={() => setDifficulty('easy')}
            >
              Easy · 10s
            </button>
            <button
              type="button"
              className={`chip${difficulty === 'hard' ? ' chip--active' : ''}`}
              disabled={running || starting}
              onClick={() => setDifficulty('hard')}
            >
              Hard · 2.5s
            </button>
            <button
              type="button"
              className={`chip${difficulty === 'custom' ? ' chip--active' : ''}`}
              disabled={running || starting}
              onClick={() => setDifficulty('custom')}
            >
              Custom
            </button>
            {difficulty === 'custom' && (
              <div className="field">
                <label htmlFor="custom-int">Intervalo ({customInterval}s)</label>
                <input
                  id="custom-int"
                  type="range"
                  min={2}
                  max={12}
                  step={0.5}
                  disabled={running || starting}
                  value={customInterval}
                  onChange={(e) => setCustomInterval(Number(e.target.value))}
                />
              </div>
            )}
          </div>
        </>
      )}

      <p className="section-label">Captura</p>
      <div className="control-row">
        <button
          type="button"
          className={`chip${recordEnabled ? ' chip--active' : ''}`}
          disabled={running || starting}
          onClick={() => setRecordEnabled((v) => !v)}
        >
          {recordEnabled ? 'Grabar voz · on' : 'Grabar voz · off'}
        </button>
      </div>

      <div className="control-row">
        {!running ? (
          <button
            type="button"
            className="btn btn--primary"
            disabled={starting}
            onClick={() => void start()}
          >
            {starting ? 'Pidiendo micrófono…' : 'Iniciar'}
          </button>
        ) : (
          <button type="button" className="btn btn--danger" onClick={stop}>
            Terminar sesión
          </button>
        )}
        {running && (
          <span className="rec-status">
            {recording && <span className="rec-dot" aria-hidden="true" />}
            {mode === 'free' ? 'Cronómetro' : `Estímulos: ${shown}`} · {elapsed}s
            {recording ? ' · grabando' : ''}
          </span>
        )}
      </div>
      {micError && <p style={{ color: 'var(--accent-hot)' }}>{micError}</p>}

      {mode === 'free' ? (
        <div className="stimulus-stage">
          <Timer seconds={remaining} />
        </div>
      ) : (
        <StimulusDisplay stimulus={stimulus} emptyLabel="Pulsa iniciar y suelta" />
      )}

      <div style={{ marginTop: '2rem' }}>
        <p className="section-label">Beat opcional</p>
        <BeatPlayer compact />
      </div>
    </div>
  )
}
