import { useEffect, useRef, useState } from 'react'
import { StimulusDisplay } from './StimulusDisplay'
import { loadTake } from '../utils/takes'
import { formatOffset, type SessionMetrics, type StimulusRecord } from '../utils/metrics'
import type { Stimulus } from '../services/stimuliEngine'

interface SessionReplayProps {
  session: SessionMetrics
}

function toStimulus(record: StimulusRecord): Stimulus {
  return {
    kind: record.kind,
    value: record.value,
    at: record.offsetMs,
    object: record.objectSrc
      ? {
          id: record.value,
          label: record.objectLabel ?? record.value,
          src: record.objectSrc,
        }
      : undefined,
  }
}

export function SessionReplay({ session }: SessionReplayProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [url, setUrl] = useState<string | null>(null)
  const [currentMs, setCurrentMs] = useState(0)
  const [missingTake, setMissingTake] = useState(false)

  useEffect(() => {
    let objectUrl: string | null = null
    let cancelled = false
    setUrl(null)
    setMissingTake(false)
    setCurrentMs(0)

    if (!session.hasTake) return undefined

    void loadTake(session.id).then((blob) => {
      if (cancelled) return
      if (!blob) {
        setMissingTake(true)
        return
      }
      objectUrl = URL.createObjectURL(blob)
      setUrl(objectUrl)
    })

    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [session.id, session.hasTake])

  const stimuli = session.stimuli ?? []
  let activeIndex = -1
  for (let i = 0; i < stimuli.length; i += 1) {
    if (stimuli[i].offsetMs <= currentMs) activeIndex = i
  }
  const activeStimulus = activeIndex >= 0 ? toStimulus(stimuli[activeIndex]) : null

  const seekTo = (ms: number) => {
    const el = audioRef.current
    if (el) el.currentTime = ms / 1000
    setCurrentMs(ms)
  }

  if (!session.hasTake && stimuli.length === 0) return null

  return (
    <div className="replay">
      <p className="section-label">Replay</p>

      {url ? (
        <audio
          ref={audioRef}
          controls
          src={url}
          className="replay__audio"
          onTimeUpdate={(e) => setCurrentMs(e.currentTarget.currentTime * 1000)}
          onSeeked={(e) => setCurrentMs(e.currentTarget.currentTime * 1000)}
        />
      ) : session.hasTake && !missingTake ? (
        <p style={{ color: 'var(--ink-muted)' }}>Cargando take…</p>
      ) : missingTake ? (
        <p style={{ color: 'var(--ink-muted)' }}>El take de esta sesión ya no está en este dispositivo.</p>
      ) : (
        <p style={{ color: 'var(--ink-muted)' }}>Esta sesión no tiene audio. El timeline de estímulos sí se guardó.</p>
      )}

      {stimuli.length > 0 && (
        <>
          <StimulusDisplay
            stimulus={activeStimulus}
            emptyLabel="Dale play y sigue las palabras"
          />
          <ol className="replay-timeline">
            {stimuli.map((cue, i) => (
              <li key={`${cue.offsetMs}-${cue.value}-${i}`}>
                <button
                  type="button"
                  className={`replay-cue${i === activeIndex ? ' replay-cue--active' : ''}`}
                  onClick={() => seekTo(cue.offsetMs)}
                >
                  <span className="replay-cue__time">{formatOffset(cue.offsetMs)}</span>
                  <span>{cue.value}</span>
                </button>
              </li>
            ))}
          </ol>
        </>
      )}
    </div>
  )
}
