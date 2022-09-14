import DeleteIcon from '@mui/icons-material/Delete'
import { Alert, Button, ButtonGroup } from '@mui/material'
import PropTypes from 'prop-types'

function Speech({
  transcript,
  isListening,
  handleListening,
  stopHandle,
  handleReset,
}) {
  return (
    <div className="microphone-wrapper">
      <div className="microphone-container">
        <ButtonGroup disableElevation variant="contained">
          <Button onClick={handleListening}>Listen</Button>
          {isListening && (
            <Button className="microphone-stop btn" onClick={stopHandle}>
              Stop
            </Button>
          )}
        </ButtonGroup>
        <br />
        <br />
        <div className="microphone-status">
          {isListening && (
            <Alert
              style={{ color: '#233143', backgroundColor: '#b8bcc2' }}
              severity="info"
            >
              Listening...
            </Alert>
          )}
        </div>
      </div>

      {transcript && (
        <div className="microphone-result-container">
          <div style={{ color: '#5e6060' }} className="microphone-result-text">
            {transcript}
          </div>
          <br />
          <Button
            className="microphone-reset btn"
            onClick={handleReset}
            variant="outlined"
            startIcon={<DeleteIcon />}
          >
            Reset
          </Button>
        </div>
      )}
    </div>
  )
}

Speech.propTypes = {
  transcript: PropTypes.string,
  isListening: PropTypes.bool,
  handleListening: PropTypes.func,
  stopHandle: PropTypes.func,
  handleReset: PropTypes.func,
}

export default Speech
