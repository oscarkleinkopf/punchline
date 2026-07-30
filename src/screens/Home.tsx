import { Link } from 'react-router-dom'
import { assetUrl } from '../utils/assetUrl'
import '../styles/home.css'

export function Home() {
  const heroBg = {
    ['--hero-bg-image' as string]: `url('${assetUrl('assets/images/hero-stage.svg')}')`,
  }

  return (
    <section className="hero">
      <div className="hero__bg" aria-hidden="true" style={heroBg} />
      <nav className="hero__nav" aria-label="Accesos">
        <Link to="/entrenar">Entrenar</Link>
        <Link to="/estudio">Estudio</Link>
        <Link to="/resultados">Sesiones</Link>
      </nav>
      <div className="hero__content">
        <h1 className="hero__brand">
          Punch<span>line</span>
        </h1>
        <p className="hero__headline">El gimnasio mental del freestyle.</p>
        <p className="hero__support">
          Estímulos en vivo, beats adaptativos y grabación lista para soltar bars bajo presión.
        </p>
        <div className="hero__cta">
          <Link className="btn btn--primary" to="/entrenar">
            Empezar entrenamiento
          </Link>
          <Link className="btn btn--ghost" to="/estudio">
            Abrir estudio
          </Link>
        </div>
      </div>
    </section>
  )
}
