import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import PropTypes from 'prop-types'

import { Speech, Table } from '../../components'
function Sheets({ setName, pollens, sheetId, addPollen }) {
  return (
    <>
      <Box className="flex" justifyContent="space-around" content="center">
        <Box
          sx={{
            p: 2,
            width: '30%',
            backgroundColor: '#e8e8e8',
            border: '1px solid #e8e8e8',
            borderRadius: '5px',
            marginLeft: '5%',
          }}
        >
          <Typography
            noWrap
            align="center"
            component="div"
            style={{ color: '#081627' }}
            sx={{ display: { xs: '5', sm: 'block' } }}
          >
            Add a New Name
          </Typography>
          <br />

          <Stack
            direction={'row'}
            spacing={2}
            justifyContent="space-around"
            content="center"
          >
            <TextField
              id="standard-basic"
              label="Name"
              variant="standard"
              onChange={(e) => setName(e.target.value)}
            />
            <Box>
              <Button
                color={'primary'}
                variant={'contained'}
                onClick={addPollen}
                className="bg-black"
              >
                {' '}
                Add
              </Button>
            </Box>
          </Stack>
        </Box>
        <Box
          flex
          sx={{
            p: 2,
            width: '30%',
            backgroundColor: '#e8e8e8',
            border: '1px solid #e8e8e8',
            borderRadius: '5px',
            marginLeft: '5%',
          }}
        >
          <Typography
            noWrap
            component="div"
            style={{ color: '#081627' }}
            sx={{ display: { xs: 'none', sm: 'block' } }}
            align="center"
            justify-content="center"
          >
            Click to Start Listening
          </Typography>
          <br />
          <Speech pollens={pollens} sheetId={sheetId} />
        </Box>
      </Box>
      <br />
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }} />
      <div style={{ width: '100%' }}>
        <Box className="flex content-center justify-center py-4">
          <br />
          <Typography
            className="flex content-center justify-center py-4"
            noWrap
            variant="h6"
            component="div"
            style={{ color: '#b6b5b5' }}
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            View and Edit
          </Typography>
          <br />
        </Box>
      </div>
      <Box className="container box-border flex flex-col content-center justify-center py-4">
        {pollens && (
          <Table
            pollens={pollens}
            className="flex flex-col content-center justify-center"
          />
        )}
      </Box>
    </>
  )
}

Sheets.propTypes = {
  setName: PropTypes.func.isRequired,
  pollens: PropTypes.array.isRequired,
  sheetId: PropTypes.string.isRequired,
  addPollen: PropTypes.func.isRequired,
  selectedRowIndex: PropTypes.number.isRequired,
  setSelectedRowIndex: PropTypes.func.isRequired,
}

export default Sheets
