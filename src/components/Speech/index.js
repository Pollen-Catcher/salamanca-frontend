import { useContext, useState } from "react";
import propose from "propose";
import { commandsList, pollensList } from "../../data/arrays";
import {
  addDoc,
  collection,
  doc,
  increment,
  updateDoc,
} from "firebase/firestore";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Pollen, pollenConverter } from "../../models/Pollen";
import { FirebaseContext } from "../../contexts/firebaseContext";
import Speech from "./Speech";

export default ({ pollens, sheetId }) => {
  const { db } = useContext(FirebaseContext);
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
      command: ["use command :commandType", "use :commandType"],
      callback: (commandType, { resetTranscript }) => {
        const proposedCommand = propose(commandType, commandsList, {
          ignoreCase: true,
          threshold: 0.2,
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
      command: ["assign :hour", "pin :hour"],
      callback: (hour, { resetTranscript }) => {
        console.log("assign", hour);

        if (!isNaN(hour) && hour >= 0 && hour <= 23) {
          setInterval(`intervals._${hour}h`);
        } else {
          console.log("Invalid hour");
        }

        resetTranscript();
      },
    },
    {
      command: ["do :pollenType :amount"],
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

        if (isNaN(amount)) {
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
              [interval]: increment(amount),
            }).then(() => {
              console.log("Added");
            });
            break;
          case "delete":
            await updateDoc(ref, {
              [interval]: increment(-amount),
            });
            break;
        }

        resetTranscript();
      },
    },
  ];

  const { resetTranscript, transcript } = useSpeechRecognition({
    commands,
  });
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
