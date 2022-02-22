import { useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button, Alert, ButtonGroup } from "@mui/material";
import propose from "propose";
import { doc, updateDoc, increment, deleteDoc } from "firebase/firestore";
import wordsToNumbers from "words-to-numbers";
import db from "../../config/firebase";
import PropTypes from "prop-types";
import { pollenList } from "../../data/pollenList";
function Speech({ pollens }) {
  const commands = [
    {
      command: ["reset", "clear"],
      callback: () => {
        handleReset();
      },
    },
    {
      command: ["delete *", "del *"],
      callback: async (pollenType, { resetTranscript }) => {
        console.log(pollenType);

        const proposedPollen = propose(pollenType, pollenList, {
          ignoreCase: true,
          threshold: 0.2,
        });

        if (!proposedPollen) {
          console.log("No pollen found");
          resetTranscript();
          return;
        }

        const pollen = pollens.find((p) => p.nome === proposedPollen);
        if (!pollen.id) {
          console.log("No pollen found");
          resetTranscript();
          return;
        }

        const ref = doc(db, "pollens", pollen.id);
        await deleteDoc(ref);

        resetTranscript();
      },
    },
    {
      command: [
        "increment * *",
        "increase * *",
        "add * *",
        "adds * *",
        "increments * *",
      ],
      callback: async (pollenType, amount, { resetTranscript }) => {
        console.log(pollenType, amount);

        const proposedPollen = propose(pollenType, pollenList, {
          ignoreCase: true,
          threshold: 0.2,
        });

        console.log("Proposed pollen: ", proposedPollen);

        if (!proposedPollen) {
          console.log("No pollen found");
          resetTranscript();
          return;
        }

        let intAmount;
        if (typeof amount === "string") {
          intAmount = wordsToNumbers(amount);
        } else {
          intAmount = amount;
        }

        const pollen = pollens.find((p) => p.nome === proposedPollen);
        if (!pollen.id) {
          console.log("No pollen found");
          resetTranscript();
          return;
        }

        console.log(pollen);
        console.log(proposedPollen, intAmount, pollen.id);

        const ref = doc(db, "pollens", pollen.id);
        await updateDoc(ref, {
          ["intervalo._00h"]: increment(intAmount),
        });

        resetTranscript();
      },
    },
  ];

  const { transcript, resetTranscript } = useSpeechRecognition({ commands });
  const [isListening, setIsListening] = useState(false);

  const handleListing = () => {
    setIsListening(true);
    SpeechRecognition.startListening({
      language: "en-US",
      continuous: true,
    });
  };

  const stopHandle = () => {
    setIsListening(false);
    SpeechRecognition.stopListening();
  };

  const handleReset = () => {
    console.log("reset");
    stopHandle();
    resetTranscript();
  };

  return (
    <div align="center" className="microphone-wrapper">
      <div className="microphone-container">
        <ButtonGroup disableElevation variant="contained">
          <Button onClick={handleListing}>Listen</Button>
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

Speech.propTypes = {
  pollens: PropTypes.array.isRequired,
};

export default Speech;
