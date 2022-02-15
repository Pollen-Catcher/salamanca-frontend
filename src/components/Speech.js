/* eslint-disable no-sparse-arrays */
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button, Alert, ButtonGroup } from "@mui/material";
import propose from "propose";
import db_pollenList from "../data/pollenList";
import { addPolen, updateNumber } from "../pages/Firestore/index";

/*const commands = [
  {
    command: "open *",
    callback: (website) => {
      window.open("http://" + website.split(" ").join(""));
    },
  },
  {
    command: "reset",
    callback: () => {
      handleReset();
    },
  },
  {
    command: "add *",
    callback: (polenType) => {
      speechFunction(polenType);
    },
  },
];*/

function speechFunction(pollenType) {
  console.log(pollenType);
}

function Speech() {
  //const { transcript, resetTranscript } = useSpeechRecognition({ commands });
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [isListening, setIsListening] = useState(false);
  const microphoneRef = useRef(null);

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
    console.log("reset");
    stopHandle();
    resetTranscript();
  };

  const possibleCommands = ["add", "delete"];
  const pollens = ["Acer", "Bosque"];
  const [proposedTranscript, setProposedTranscript] = useState("");

  useEffect(async () => {
    const keywords = transcript.split(" ");

    if (transcript && keywords.length > 3) {
      let action, pollen, end, value;

      //add acer
      const keywords = transcript.split(" ");

      action = propose(keywords[0], possibleCommands, {
        ignoreCase: true,
        threshold: 0.1,
      });

      /*await db_pollenList().then((pollenList) => {
        pollen = propose(keywords[1], pollenList, {
          ignoreCase: true,
          threshold: 0.1,
        });
      });*/

      pollen = propose(keywords[1], pollens, {
        ignoreCase: true,
        threshold: 0.1,
      });

      value = keywords[2]

      end = propose(keywords[3], ["end"], {
        ignoreCase: true,
        threshold: 0.1,
      });

      handleCommands({ action, pollen, value, end});
    }
  }, [transcript]);

  function handleCommands({ action, pollen, value, end }) {
    if (end === "end") {
      handleReset();
      console.log(action, pollen, value, end);

      if (action == "add") {
        console.log("add");
        //add to db
        //addPolen(pollen);
        updateNumber(value);
      }

      if(action == "delete"){
        console.log("delete");
        //id = searchPollen_id(pollen);
        //deletePolen(id);
      }

    }
  }

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
