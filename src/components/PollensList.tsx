import { Yard } from '@mui/icons-material'
import {
  Box,
  Fab,
  List,
  ListItem,
  Paper,
  Typography,
} from '@mui/material'
import { useState } from 'react'

import { pollensList } from '../data/arrays'

export default function PollensList() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {open && (
        <Paper
          elevation={3}
          sx={{
            width: { xs: '100%', sm: 300 },
            maxWidth: '100%',
            position: 'relative',
            minHeight: 0,
          }}
        >
          <Box
            sx={{
              px: 2,
              py: 1.5,
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <Typography
              variant="h6"
              component="h2"
              sx={{ fontWeight: 600, color: 'primary.main', fontSize: '1.1rem' }}
            >
              Pólens registrados ({pollensList.length})
            </Typography>
          </Box>
          <List
            dense
            sx={{
              overflowY: 'auto',
              py: 0.5,
              height: { xs: 400, lg: 'auto' },
              position: { lg: 'absolute' },
              top: { lg: '3.4rem' },
              bottom: { lg: 0 },
              left: { lg: 0 },
              right: { lg: 0 },
            }}
          >
            {pollensList.map((pollen) => (
              <ListItem key={pollen} sx={{ px: 2 }}>
                <Typography sx={{ fontSize: '1.1rem' }}>{pollen}</Typography>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
      <Fab
        color="secondary"
        aria-label={open ? 'Fechar lista de pólens' : 'Abrir lista de pólens'}
        onClick={() => setOpen((prev) => !prev)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: (theme) => theme.zIndex.appBar - 1,
          boxShadow: 4,
        }}
      >
        <Yard />
      </Fab>
    </>
  )
}