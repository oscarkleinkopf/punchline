import { BeatPlayer } from '../components/BeatPlayer'
import { RecorderControls } from '../components/RecorderControls'

export function Studio() {
  return (
    <div className="page">
      <h1 className="page-title">Estudio Acústico & Grabación</h1>
      <p className="page-lead">
        Calibra frecuencias instrumentales, modula el BPM en tiempo real y registra tu toma vocal sobre el plano rítmico.
      </p>

      <div className="studio-panel">
        <BeatPlayer />
        <RecorderControls />
      </div>
    </div>
  )
}
