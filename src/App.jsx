import PropTypes from 'prop-types'
import { useContext } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import { Navigate } from 'react-router-dom'

import { Projects, Sheets } from './components'
import { FirebaseContext } from './contexts/firebaseContext'
import { Layout, LoginPage } from './pages'

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage />}
          render={(props) => <LoginPage {...props} />}
        />
        <Route
          path="/"
          element={<Layout />}
          render={(props) => <Layout {...props} />}
        >
          <Route
            index
            element={
              <RequireAuth>
                <Projects />
              </RequireAuth>
            }
          />
          <Route
            path="/home/:sheetId"
            element={
              <RequireAuth>
                <Sheets />
              </RequireAuth>
            }
          />
        </Route>
      </Routes>
    </Router>
  )
}

function RequireAuth({ children }) {
  const { auth } = useContext(FirebaseContext)
  const [user, loading] = useAuthState(auth)
  const location = useLocation()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

RequireAuth.propTypes = {
  children: PropTypes.node,
}

export default App
