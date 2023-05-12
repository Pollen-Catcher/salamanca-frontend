import { CssBaseline } from '@mui/material'

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
