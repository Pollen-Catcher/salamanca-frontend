import { Box, Button, TextField, Typography } from '@mui/material'
import { addDoc, collection, doc } from 'firebase/firestore'
import { useContext, useEffect, useState } from 'react'
import {
  useCollectionData,
  useDocumentData,
} from 'react-firebase-hooks/firestore'
import { useNavigate, useParams } from 'react-router-dom'

import { Speech, Table } from '../../components'
import { FirebaseContext } from '../../contexts/Auth/firebaseContext'
import { UserContext } from '../../contexts/Auth/UserContext'

export default () => {
  const { sheetId } = useParams()
  const { db } = useContext(FirebaseContext)
  const { user } = useContext(UserContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true })
    }
  }, [])

  const [name, setName] = useState('')
  const [date, setDate] = useState(
    new Date().toLocaleDateString('en-US').replace(/\//g, '-')
  )

  const pollenDocumentRef = doc(
    db,
    'users',
    user.uid,
    'stations',
    sheetId,
    'days',
    date
  )
  const [pollens] = useDocumentData(pollenDocumentRef)

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
                onClick={() => { }}
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
        defaultValue="2022-01-01"
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
