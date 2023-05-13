import { CssBaseline } from '@mui/material'

import { GlobalContext } from './contexts/GlobalContext'
import { Router } from './Router'

export default function App() {
  return (
    <GlobalContext>
      <CssBaseline />
      <Router />
    </GlobalContext>
  )
}
