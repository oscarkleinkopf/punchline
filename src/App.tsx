import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './screens/Home'
import { Training } from './screens/Training'
import { Studio } from './screens/Studio'
import { SessionResult } from './screens/SessionResult'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<Layout />}>
          <Route path="/entrenar" element={<Training />} />
          <Route path="/estudio" element={<Studio />} />
          <Route path="/resultados" element={<SessionResult />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
