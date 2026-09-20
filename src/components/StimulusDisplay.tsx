import type { Stimulus } from '../services/stimuliEngine'
import { formatTheme } from '../utils/themeGenerator'

interface StimulusDisplayProps {
  stimulus: Stimulus | null
  emptyLabel?: string
}

export function StimulusDisplay({
  stimulus,
  emptyLabel = 'Listo para postular',
}: StimulusDisplayProps) {
  if (!stimulus) {
    return (
      <div className="stimulus-stage">
        <div className="stimulus-header-tag">[ PLANO CARTESIANO EN ESPERA ]</div>
        <p className="stimulus-theme" style={{ color: 'var(--ink-muted)' }}>
          {emptyLabel}
        </p>
      </div>
    )
  }

  if (stimulus.kind === 'word') {
    return (
      <div className="stimulus-stage">
        <div className="stimulus-header-tag" key={`tag-${stimulus.at}`}>
          [ AXIOMA VERBAL // VARIABLE ACTIVA ]
        </div>
        <p className="stimulus-word" key={stimulus.at}>
          {stimulus.value}
        </p>
      </div>
    )
  }

  if (stimulus.kind === 'theme') {
    const { left, right } = formatTheme(stimulus.value)
    return (
      <div className="stimulus-stage">
        <div className="stimulus-header-tag" key={`tag-${stimulus.at}`}>
          [ ANTINOMIA CONCEPTUAL // DUALIDAD DIALÉCTICA ]
        </div>
        <p className="stimulus-theme" key={stimulus.at}>
          {left} <em>vs</em> {right}
        </p>
      </div>
    )
  }

  return (
    <div className="stimulus-stage">
      <div className="stimulus-header-tag" key={`tag-${stimulus.at}`}>
        [ VECTOR GRÁFICO // GEOMETRÍA DEL ESTÍMULO ]
      </div>
      {stimulus.object ? (
        <img
          key={stimulus.at}
          className="stimulus-image"
          src={stimulus.object.src}
          alt={stimulus.object.label}
        />
      ) : (
        <p className="stimulus-word" key={stimulus.at}>
          {stimulus.value}
        </p>
      )}
    </div>
  )
}
