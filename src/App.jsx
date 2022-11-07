import { CssBaseline } from '@mui/material'
import React from 'react'

import { GlobalContext } from './contexts'
import { Router } from './Router'

function App() {
  return (
    <GlobalContext>
      <CssBaseline />
      <Router />
    </GlobalContext>
  )
}
export default App
