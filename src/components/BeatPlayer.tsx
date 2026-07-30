import { useEffect, useState } from 'react'
import { audioEngine } from '../services/audioEngine'
import { BEATS, filterBeats, GENRE_LABELS, type Beat, type Genre } from '../utils/beats'

interface BeatPlayerProps {
  compact?: boolean
}

export function BeatPlayer({ compact = false }: BeatPlayerProps) {
  const [, tick] = useState(0)
  const [genre, setGenre] = useState<Genre | 'all'>('all')
  const [bpmMax, setBpmMax] = useState(160)
  const [selectedId, setSelectedId] = useState<string | null>(BEATS[0]?.id ?? null)
  const [loading, setLoading] = useState(false)

  useEffect(() => audioEngine.subscribe(() => tick((n) => n + 1)), [])

  useEffect(() => {
    const beat = BEATS.find((b) => b.id === selectedId) ?? BEATS[0]
    if (!beat) return
    let cancelled = false
    setLoading(true)
    void audioEngine.load(beat.src, beat.bpm).finally(() => {
      if (!cancelled) setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [selectedId])

  const beats = filterBeats({ genre, bpmMin: 80, bpmMax })
  const tempoPct = Math.round(audioEngine.getTempoRatio() * 100)

  const selectBeat = (beat: Beat) => {
    setSelectedId(beat.id)
  }

  return (
    <div>
      {!compact && <p className="section-label">Biblioteca de beats</p>}

      <div className="control-row">
        {(['all', 'boom-bap', 'trap', 'drill', 'reggaeton'] as const).map((g) => (
          <button
            key={g}
            type="button"
            className={`chip${genre === g ? ' chip--active' : ''}`}
            onClick={() => setGenre(g)}
          >
            {g === 'all' ? 'Todos' : GENRE_LABELS[g]}
          </button>
        ))}
      </div>

      <div className="control-row">
        <div className="field">
          <label htmlFor="bpm-filter">BPM máx. ({bpmMax})</label>
          <input
            id="bpm-filter"
            type="range"
            min={90}
            max={160}
            step={5}
            value={bpmMax}
            onChange={(e) => setBpmMax(Number(e.target.value))}
          />
        </div>
        <div className="field">
          <label htmlFor="tempo">Tempo ({tempoPct}% → {audioEngine.getEffectiveBpm()} BPM)</label>
          <input
            id="tempo"
            type="range"
            min={70}
            max={150}
            value={tempoPct}
            onChange={(e) => audioEngine.setTempoRatio(Number(e.target.value) / 100)}
          />
        </div>
        <div className="field">
          <label htmlFor="beat-vol">Volumen beat</label>
          <input
            id="beat-vol"
            type="range"
            min={0}
            max={100}
            value={Math.round(audioEngine.getVolume() * 100)}
            onChange={(e) => audioEngine.setVolume(Number(e.target.value) / 100)}
          />
        </div>
      </div>

      <div className="control-row">
        <button
          type="button"
          className="btn btn--primary"
          disabled={loading || !selectedId}
          onClick={() => (audioEngine.isPlaying() ? audioEngine.pause() : audioEngine.play())}
        >
          {audioEngine.isPlaying() ? 'Pausar' : 'Play'}
        </button>
        <button type="button" className="btn btn--ghost" onClick={() => audioEngine.stop()}>
          Stop
        </button>
      </div>

      <div className="beat-list" role="listbox" aria-label="Beats">
        {beats.map((beat) => (
          <button
            key={beat.id}
            type="button"
            role="option"
            aria-selected={selectedId === beat.id}
            className={`beat-row${selectedId === beat.id ? ' beat-row--active' : ''}`}
            onClick={() => selectBeat(beat)}
          >
            <span>{beat.title}</span>
            <span className="beat-row__meta">{GENRE_LABELS[beat.genre]}</span>
            <span className="beat-row__meta">{beat.bpm} BPM</span>
          </button>
        ))}
        {beats.length === 0 && (
          <p style={{ color: 'var(--ink-muted)' }}>No hay beats en este rango.</p>
        )}
      </div>
    </div>
  )
}
