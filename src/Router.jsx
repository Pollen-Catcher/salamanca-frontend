import React from 'react'
import { Route, Routes } from 'react-router-dom'

import { Projects, Sheets } from './components'
import { UserProvider } from './contexts/Auth/UserContext'
import { Layout, LoginPage } from './pages'

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
          path="/dashboard"
          element={<Layout />}
          render={(props) => <Layout {...props} />}
        >
          <Route index element={<Projects />} />
          <Route path=":sheetId" element={<Sheets />} />
        </Route>
      </Routes>
    </UserProvider>
  )
}
