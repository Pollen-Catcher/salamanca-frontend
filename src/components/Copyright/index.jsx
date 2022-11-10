import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import { Link } from 'react-router-dom'
const Copyright = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        bottom: 0,
        width: '100%',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        p: 2,
      }}
    >
      <Typography variant="body2" color="#b6b5b5" align="center">
        {'Copyright © '}
        <Link className="text-inherit no-underline" href="LINK AQUI">
          Pollen Catcher
        </Link>{' '}
        {new Date().getFullYear()}.
      </Typography>
    </Box>
  )
}
export { Copyright }
