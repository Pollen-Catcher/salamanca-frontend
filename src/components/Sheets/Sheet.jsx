import { Box, Button, TextField, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router'

import { Speech, Table } from '../../components'
import { UserContext } from '../../contexts/Auth/UserContext'

function Sheets({ setName, pollens, sheetId, addPollen, setDate }) {
  const { user } = useContext(UserContext)
  const navigate = useNavigate()
  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true })
    }
  }, [])
  return (
    <>
      <div className="flex min-h-[24rem] flex-col items-center justify-around sm:flex-row sm:flex-wrap">
        <div className="my-2 flex h-[10rem] min-w-[24rem] flex-col items-center justify-evenly rounded-lg shadow-md">
          <Typography
            className=" text-center font-sans text-lg font-medium text-zinc-800"
            component="div"
          >
            Add a New Name
          </Typography>

          <div className="flex w-[70%] flex-row items-center justify-around">
            <TextField
              className="flex w-full items-center justify-center"
              id="standard-basic"
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
          </div>
        </div>
        <div className="my-2 flex min-h-[10rem] min-w-[24rem] flex-col items-center justify-evenly rounded-lg shadow-md">
          <Typography
            className=" text-center font-sans text-lg font-medium text-zinc-800"
            component="div"
          >
            Click to Start Listening
          </Typography>
          <Speech pollens={pollens} sheetId={sheetId} />
        </div>
      </div>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }} />
      <Box className="flex justify-center py-4">
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
      </Box>
      <TextField
        id="date"
        className="flex content-center justify-center py-4"
        label="Sheet Date"
        type="date"
        defaultValue="2017-05-24"
        InputLabelProps={{
          shrink: true,
        }}
        onChange={(e) => setDate(e.target.value)}
      />
      <Box className="flex w-full content-center justify-center py-4">
        {pollens && <Table pollens={pollens} />}
      </Box>
    </>
  )
}

Sheets.propTypes = {
  setName: PropTypes.func.isRequired,
  pollens: PropTypes.array,
  sheetId: PropTypes.string.isRequired,
  addPollen: PropTypes.func.isRequired,
  selectedRowIndex: PropTypes.number,
  setSelectedRowIndex: PropTypes.func,
  setDate: PropTypes.func.isRequired,
}

export default Sheets
