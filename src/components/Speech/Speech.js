import { useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button, Alert, ButtonGroup } from "@mui/material";
import propose from "propose";
import { doc, updateDoc, increment } from "firebase/firestore";
import wordsToNumbers from "words-to-numbers";
import db from "../../config/firebase";
import PropTypes from "prop-types";
import { pollensList, commandsList } from "../../data/arrays";

function Speech({ pollens }) {
  const [interval, setInterval] = useState("intervals._0h");
  const [currentCommand, setCurrentCommand] = useState("add");

  const commands = [
    {
      command: ["reset", "clear"],
      callback: () => {
        handleReset();
      },
    },
    {
      command: ["use command *", "use *"],
      callback: (commandType, { resetTranscript }) => {
        const proposedCommand = propose(commandType, commandsList, {
          ignoreCase: true,
          threshold: 0.4,
        });

        if (!proposedCommand) {
          console.log("Command not found");
          resetTranscript();
          return;
        }

        setCurrentCommand(proposedCommand);
        resetTranscript();
      },
    },
    {
      command: ["assign *", "pin *"],
      callback: (hour, { resetTranscript }) => {
        setInterval("intervals._" + hour + "h");
        resetTranscript();
      },
    },
    {
      command: ["do * *"],
      callback: async (pollenType, amount, { resetTranscript }) => {
        if (interval.length == 0) {
          console.log("ERROR - Undefined interval");
        }

        const proposedPollen = propose(pollenType, pollensList, {
          ignoreCase: true,
          threshold: 0.2,
        });


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

        if (isNaN(intAmount)) {
          console.log("Invalid amount");
          resetTranscript();
          return;
        }

        const pollen = pollens.find((p) => p.name === proposedPollen);
        if (!pollen.id) { // adicionar o pollen ao banco de dados
          console.log("No pollen found");
          resetTranscript();
          return;
        }

        console.log(pollen);

        const ref = doc(
          db,
          "sheets",
          "qcMt55cB912kjwRfxoVQ",
          "pollens",
          pollen.id
        );

        console.log(interval);

        switch (currentCommand) {
          case "add":
            await updateDoc(ref, {
              [interval]: increment(intAmount),
            });
            break;
          case "delete":
            await updateDoc(ref, {
              [interval]: increment(-intAmount),
            });
            break;
        }

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
  pollens: PropTypes.array,
};

export default Speech;
