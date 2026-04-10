import { Navigate, Route, Routes } from 'react-router-dom'
import { Home } from './pages/Home'
import { Result } from './pages/Result'
import { Test } from './pages/Test'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/test" element={<Test />} />
      <Route path="/result" element={<Result />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
