import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import PropTypes from 'prop-types'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { theme } from '../theme'
const GlobalContext = ({ children }) => {
  return (
    <BrowserRouter>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </StyledEngineProvider>
      </LocalizationProvider>
    </BrowserRouter>
  )
}
GlobalContext.propTypes = {
  children: PropTypes.node,
}
export { GlobalContext }
