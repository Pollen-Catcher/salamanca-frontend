import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#edaf1d',
      light: '#e5ce7b',
      dark: '#cb961b',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#25620f',
      light: '#5c9145',
      dark: '#094908',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F4F8F4',
      paper: '#FFFFFF',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
})

export default theme
