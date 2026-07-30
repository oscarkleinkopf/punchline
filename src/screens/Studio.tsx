import { BeatPlayer } from '../components/BeatPlayer'
import { RecorderControls } from '../components/RecorderControls'

export function Studio() {
  return (
    <div className="page">
      <h1 className="page-title">Estudio</h1>
      <p className="page-lead">
        Elige un instrumental, ajusta el tempo en tiempo real y graba tu flow sobre el beat.
      </p>

      <div className="studio-panel">
        <BeatPlayer />
        <RecorderControls />
      </div>
    </div>
  )
}
