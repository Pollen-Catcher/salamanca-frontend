import { StyledEngineProvider } from '@mui/material/styles'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { BrowserRouter } from 'react-router-dom'
import { UserProvider } from './UserContext'

const GlobalContext = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
        <UserProvider>
          <StyledEngineProvider injectFirst>{children}</StyledEngineProvider>
        </UserProvider>
      </LocalizationProvider>
    </BrowserRouter>
  )
}

export { GlobalContext }
