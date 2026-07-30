import { NavLink, Outlet } from 'react-router-dom'

export function Layout() {
  return (
    <div className="app-shell">
      <header>
        <nav className="site-nav" aria-label="Principal">
          <NavLink to="/" className="site-nav__brand" end>
            Punch<span>line</span>
          </NavLink>
          <div className="site-nav__links">
            <NavLink to="/entrenar" className={({ isActive }) => (isActive ? 'active' : undefined)}>
              Entrenar
            </NavLink>
            <NavLink to="/estudio" className={({ isActive }) => (isActive ? 'active' : undefined)}>
              Estudio
            </NavLink>
            <NavLink
              to="/resultados"
              className={({ isActive }) => (isActive ? 'active' : undefined)}
            >
              Sesiones
            </NavLink>
          </div>
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
