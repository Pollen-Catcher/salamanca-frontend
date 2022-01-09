/* eslint-disable no-sparse-arrays */
import { useRef, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import * as React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import ButtonGroup from "@mui/material/ButtonGroup";

function Speech() {
  const commands = [
    {
      command: "open *",
      callback: (website) => {
        window.open("http://" + website.split(" ").join(""));
      },
    },
    {
      command: "change background colour to *",
      callback: (color) => {
        document.body.style.background = color;
      },
    },
    {
      command: "reset",
      callback: () => {
        handleReset();
      },
    },
    ,
    {
      command: "reset background colour",
      callback: () => {
        document.body.style.background = `rgba(0, 0, 0, 0.8)`;
      },
    },
  ];
  const { transcript, resetTranscript } = useSpeechRecognition({ commands });
  const [isListening, setIsListening] = useState(false);
  const microphoneRef = useRef(null);
  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return (
      <div className="microphone-container">
        Browser is not Support Speech Recognition.
      </div>
    );
  }
  const handleListing = () => {
    setIsListening(true);
    microphoneRef.current.classList.add("listening");
    SpeechRecognition.startListening({
      continuous: true,
    });
  };
  const stopHandle = () => {
    setIsListening(false);
    microphoneRef.current.classList.remove("listening");
    SpeechRecognition.stopListening();
  };
  const handleReset = () => {
    stopHandle();
    resetTranscript();
  };
  return (
    <div align="center" className="microphone-wrapper">
      <div className="microphone-container">
        <ButtonGroup disableElevation variant="contained">
          <Button ref={microphoneRef} onClick={handleListing}>
            Listen
          </Button>
          {isListening && (
            <Button className="microphone-stop btn" onClick={stopHandle}>
              Stop
            </Button>
          )}
        </ButtonGroup>
        <br />
        <br />
        <div className="microphone-status">
          {isListening && <Alert style={{ color: '#233143', backgroundColor: '#b8bcc2' }} severity="info">Listening...</Alert>}
        </div>
      </div>
      {transcript && (
        <div className="microphone-result-container">
          <div style={{ color: '#5e6060' }} className="microphone-result-text">{transcript}</div>
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
  );
}
export default Speech;
