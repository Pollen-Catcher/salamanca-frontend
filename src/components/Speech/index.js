import { useState } from "react";
import propose from "propose";
import { commandsList, pollensList } from "../../data/arrays";
import wordsToNumbers from "words-to-numbers";
import {
  addDoc,
  collection,
  doc,
  increment,
  updateDoc,
} from "firebase/firestore";
import db from "../../config/firebase";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import Speech from "./Speech";
import { Pollen, pollenConverter } from "../../models/Pollen";

export default ({ pollens, sheetId }) => {
  const [interval, setInterval] = useState("intervals._0h");
  const [currentCommand, setCurrentCommand] = useState("add");

  const pollenCollectionRef = collection(
    db,
    "sheets",
    sheetId,
    "pollens"
  ).withConverter(pollenConverter);

  const commands = [
    {
      command: ["reset", "clear"],
      callback: () => {
        handleResetListening();
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
        console.log("proposedPollen", proposedPollen);

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

        let { id } = pollens.find((p) => p.name === proposedPollen) || {};
        if (!id) {
          if (!pollensList.includes(proposedPollen)) {
            console.log("No pollen found");
            resetTranscript();
            return;
          } else {
            const newPollen = new Pollen(proposedPollen);
            const docRef = await addDoc(pollenCollectionRef, newPollen);
            id = docRef.id;
            console.log("newPollen", id);
          }
        }

        const ref = doc(db, "sheets", sheetId, "pollens", id);

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

  const handleListening = () => {
    setIsListening(true);
    SpeechRecognition.startListening({
      language: "en-US",
      continuous: true,
    });
  };

  const stopHandleListening = () => {
    setIsListening(false);
    SpeechRecognition.stopListening();
  };

  const handleResetListening = () => {
    stopHandleListening();
    resetTranscript();
  };

  return (
    <Speech
      transcript={transcript}
      isListening={isListening}
      handleListening={handleListening}
      stopHandle={stopHandleListening}
      handleReset={handleResetListening}
    />
  );
};
