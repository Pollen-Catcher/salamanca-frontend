import { Route, Routes } from 'react-router-dom'

import { Projects, Sheets } from './components'
import Graph from './components/Graph'
import { UserProvider } from './contexts/Auth/UserContext'
import { Layout, LoginPage, RegisterPage } from './pages'

export const Router = () => {
  return (
    <UserProvider>
      <Routes>
        <Route
          path="/"
          element={<LoginPage />}
          render={(props) => <LoginPage {...props} />}
        />
        <Route
          path="/register"
          element={<RegisterPage />}
          render={(props) => <RegisterPage {...props} />}
        />
        <Route
          path="/dashboard"
          element={<Layout />}
          render={(props) => <Layout {...props} />}
        >
          <Route index element={<Projects />} />
          <Route path=":sheetId" element={<Sheets />} />
          <Route path=":sheetId/graph" element={<Graph />} />
        </Route>
      </Routes>
    </UserProvider>
  )
}
