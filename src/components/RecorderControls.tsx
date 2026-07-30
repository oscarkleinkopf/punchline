import { useEffect, useState } from 'react'
import { recorder } from '../services/recorder'
import { audioEngine } from '../services/audioEngine'

export function RecorderControls() {
  const [, tick] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const offRec = recorder.subscribe(() => tick((n) => n + 1))
    const offAudio = audioEngine.subscribe(() => tick((n) => n + 1))
    return () => {
      offRec()
      offAudio()
    }
  }, [])

  const state = recorder.getState()

  const start = async () => {
    setError(null)
    try {
      if (!audioEngine.isPlaying()) {
        audioEngine.play()
      }
      await recorder.start()
    } catch {
      setError('No se pudo acceder al micrófono. Revisa los permisos del navegador.')
    }
  }

  return (
    <div>
      <p className="section-label">Grabación</p>
      <p style={{ color: 'var(--ink-muted)', marginTop: 0 }}>
        Graba tu voz sobre el beat. Ajusta volúmenes por pista y exporta el take.
      </p>

      <div className="control-row">
        <div className="field">
          <label htmlFor="mic-vol">Volumen voz</label>
          <input
            id="mic-vol"
            type="range"
            min={0}
            max={100}
            value={Math.round(recorder.getMicVolume() * 100)}
            onChange={(e) => recorder.setMicVolume(Number(e.target.value) / 100)}
          />
        </div>
        <div className="field">
          <label htmlFor="beat-vol-rec">Volumen beat</label>
          <input
            id="beat-vol-rec"
            type="range"
            min={0}
            max={100}
            value={Math.round(audioEngine.getVolume() * 100)}
            onChange={(e) => audioEngine.setVolume(Number(e.target.value) / 100)}
          />
        </div>
      </div>

      <div className="control-row">
        {state !== 'recording' ? (
          <button type="button" className="btn btn--hot" onClick={() => void start()}>
            Grabar
          </button>
        ) : (
          <button type="button" className="btn btn--danger" onClick={() => recorder.stop()}>
            Detener
          </button>
        )}
        {state === 'ready' && (
          <>
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => recorder.download()}
            >
              Descargar
            </button>
            <button type="button" className="btn btn--ghost" onClick={() => recorder.clear()}>
              Descartar
            </button>
          </>
        )}
      </div>

      {state === 'recording' && (
        <p style={{ color: 'var(--accent-hot)', fontWeight: 700 }}>● Grabando…</p>
      )}
      {error && <p style={{ color: 'var(--accent-hot)' }}>{error}</p>}

      {recorder.getUrl() && (
        <audio controls src={recorder.getUrl()!} style={{ width: '100%', marginTop: '0.75rem' }} />
      )}
    </div>
  )
}
