import { CssBaseline, ThemeProvider } from '@mui/material'

import { GlobalContext } from './contexts/GlobalContext'
import Router from './Router'
import theme from './theme'

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalContext>
        <CssBaseline />
        <Router />
      </GlobalContext>
    </ThemeProvider>
  )
}
