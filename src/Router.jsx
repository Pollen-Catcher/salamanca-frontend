import React from 'react'
import { Route, Routes } from 'react-router-dom'

import { Projects, Sheets } from './components'
import { UserProvider } from './contexts/Auth/UserContext'
import { Layout, LoginPage } from './pages'

export const Router = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <UserProvider>
            <LoginPage />
          </UserProvider>
        }
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
            <UserProvider>
              <Projects />
            </UserProvider>
          }
        />
        <Route
          path="/home/:sheetId"
          element={
            <UserProvider>
              <Sheets />
            </UserProvider>
          }
        />
      </Route>
    </Routes>
  )
}
