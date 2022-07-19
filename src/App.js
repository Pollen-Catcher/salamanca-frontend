import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import { Projects, Sheets } from './components'
import { Layout, LoginPage } from './pages'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Projects />} />
          <Route path=":sheetId" element={<Sheets />} />
        </Route>
        <Route path="loginPage" element={<LoginPage />} />
      </Routes>
    </Router>
  )
}

export default App
