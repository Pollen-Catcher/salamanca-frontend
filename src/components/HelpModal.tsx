import { useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'

export function HelpModal() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button type="button" variant="outlined" onClick={() => setOpen(true)}>
        Ajuda
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="command-help-title"
      >
        <DialogTitle id="command-help-title">Como usar os comandos</DialogTitle>
        <DialogContent dividers>
          <Typography paragraph>
            Digite um dos formatos abaixo no campo de comando:
          </Typography>
          <Typography paragraph>
            <strong>[pólen] [número]</strong> — soma à quantidade atual. Exemplo:
            <code> pinus 5</code>.
          </Typography>
          <Typography paragraph>
            <strong>set [pólen] [número]</strong> — define o valor exato.
            Exemplo: <code>set pinus 15</code>.
          </Typography>
          <Typography>
            <strong>read [pólen]</strong> — lê o valor atual da célula na hora
            selecionada. Exemplo: <code>read pinus</code>.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
