/* eslint-disable no-sparse-arrays */
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button, Alert, ButtonGroup } from "@mui/material";
//import pollenList from "../data/pollenList";
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";
import db from "../config/firebase";
import propose from "propose";
import { collection } from "firebase/firestore";
import db_pollenList from "../data/pollenList";

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

  /*const [pollenList, loading, error] = useCollectionDataOnce(
    collection(db, "pollens"),
    {
      idField: "id",
    }
  );*/

  const [proposedTranscript, setProposedTranscript] = useState("");
  useEffect(() => {
    db_pollenList().then(pollenList => {
      const pollen = propose(transcript, pollenList, {
        ignoreCase: true,
        threshold: 0.3,
      })

      if (pollen == null) {
        setProposedTranscript(transcript);
      } else {
        setProposedTranscript(pollen);
      }
    })    
  }, [transcript]);

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
          {isListening && (
            <Alert
              style={{ color: "#233143", backgroundColor: "#b8bcc2" }}
              severity="info"
            >
              Listening...
            </Alert>
          )}
        </div>
      </div>
      {transcript && (
        <div className="microphone-result-container">
          <div style={{ color: "#5e6060" }} className="microphone-result-text">
            {transcript}
            {":  "}
            {proposedTranscript}
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
  );
}

export default Speech;
