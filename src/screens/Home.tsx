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
        <div className="hero__tag">[ LABORATORIO DE CÁLCULO LÍRICO // COORDENADAS RÍTMICAS ]</div>
        <h1 className="hero__brand">
          Punch<span>line</span>
        </h1>
        <p className="hero__headline">El postulado del freestyle.</p>
        <p className="hero__support">
          Estímulos en vivo, geometría mental y beats adaptativos. Demuestra tu flow bajo la presión del cálculo analítico.
        </p>
        <div className="hero__cta">
          <Link className="btn btn--primary" to="/entrenar">
            Iniciar Demostración
          </Link>
          <Link className="btn btn--ghost" to="/estudio">
            Abrir Estudio
          </Link>
        </div>
        <div className="hero__specs">
          <span>DIMENSIÓN: <strong>ℝ⁴ LÍRICA</strong></span>
          <span>CONSTANTE: <strong>PROPORCIÓN ÁUREA Φ</strong></span>
          <span>RESOLUCIÓN: <strong>Q.E.D. EN 4/4</strong></span>
        </div>
      </div>
    </section>
  )
}
