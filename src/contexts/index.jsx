import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles'
import PropTypes from 'prop-types'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { theme } from '../theme'
export const GlobalContext = ({ children }) => {
  return (
    <BrowserRouter>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </StyledEngineProvider>
    </BrowserRouter>
  )
}
GlobalContext.propTypes = {
  children: PropTypes.node,
}
