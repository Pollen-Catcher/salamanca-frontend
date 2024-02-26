import { Box, Typography } from '@mui/material'

export default function Copyright() {
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        bottom: 0,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        p: 2,
      }}
      component="footer"
    >
      <Typography variant="body2" color="#b6b5b5" align="center">
        Copyright © Pollen Catcher {new Date().getFullYear()}
      </Typography>
    </Box>
  )
}
