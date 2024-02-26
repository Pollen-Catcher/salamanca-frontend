import { Route, Routes } from 'react-router-dom'

import { Projects, Sheets } from './components'
import Graph from './components/Graph'
import { Layout, Login, Register } from './pages'

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Layout />}>
        <Route index element={<Projects />} />
        <Route path=":sheetId" element={<Sheets />} />
        <Route path=":sheetId/graph" element={<Graph />} />
      </Route>
    </Routes>
  )
}
