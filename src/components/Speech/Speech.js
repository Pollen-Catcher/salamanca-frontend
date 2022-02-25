import { useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import DeleteIcon from "@mui/icons-material/Delete";
import { Alert, Button, ButtonGroup } from "@mui/material";
import propose from "propose";
import { doc, increment, updateDoc } from "firebase/firestore";
import wordsToNumbers from "words-to-numbers";
import PropTypes from "prop-types";
import db from "../../config/firebase";
import { commandsList, pollensList } from "../../data/arrays";

function Speech({ pollens, sheetId }) {
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
        console.log("assign", hour);

        let intAmount;
        if (typeof hour === "string") {
          intAmount = wordsToNumbers(hour);
          console.log("intAmount", intAmount);
        } else {
          intAmount = hour;
        }

        if (!isNaN(intAmount) && intAmount >= 0 && intAmount <= 23) {
          setInterval(`intervals._${intAmount}h`);
        } else {
          console.log("Invalid hour");
        }

        resetTranscript();
      },
    },
    {
      command: ["do * *"],
      callback: async (pollenType, amount, { resetTranscript }) => {
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
        if (!pollen.id) {
          console.log("No pollen found");
          resetTranscript();
          return;
        }

        const ref = doc(db, "sheets", sheetId, "pollens", pollen.id);

        switch (currentCommand) {
          case "add":
            await updateDoc(ref, {
              [interval]: increment(intAmount),
            }).then(() => {
              console.log("Added");
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
