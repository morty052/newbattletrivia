import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  AnswerView,
  HUD,
  LetterPicker,
  OptionPicker,
  WaitScreen,
} from "./components";
import { SocketContextProvider } from "./contexts/SocketContext";
import { ClerkProvider } from "@clerk/clerk-expo";
import { NavigationContainer } from "@react-navigation/native";
import { View, Button } from "react-native";
import { AppStack } from "./routes/Appstack";

type Props = {};

const App = () => {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [activeLetter, setActiveLetter] = useState("B");
  const [selectingLetter, setSelectingLetter] = useState(false);
  const [turnId, setTurnId] = useState(0);

  const handleFinish = (letter: string) => {
    console.log("user picked", letter);
    setActiveLetter(letter);
    setSelectingLetter(false);
    setFinished(false);
  };

  const userId = 0;

  useEffect(() => {
    if (!finished) {
      return;
    }

    if (finished) {
      setSelectingLetter(true);
      // setTurnId((prev) => prev + 1);
    }
  }, [finished]);

  const indexColor: any = {
    0: "bg-sky-400",
    1: "bg-green-400",
    2: "bg-blue-400",
    3: "bg-purple-400",
  };

  return (
    <>
      <ClerkProvider
        publishableKey={
          "pk_test_YWRhcHRlZC1jYW1lbC02Ny5jbGVyay5hY2NvdW50cy5kZXYk"
        }
      >
        <NavigationContainer>
          <SocketContextProvider>
            {/* <View
              className={`flex-1 flex   pt-8 px-2 relative transition-all duration-200 ease-in  ${indexColor[index]}`}
            >
              <HUD turnId={turnId} activeLetter={activeLetter} />
              <AnswerView
                finished={finished}
                setFinished={setFinished}
                index={index}
                setIndex={setIndex}
              />
              <WaitScreen
                handleFinish={(letter) => handleFinish(letter)}
                setFinished={setFinished}
                userId={userId}
                turnId={turnId}
                selectingLetter={selectingLetter}
              />
              <OptionPicker setIndex={setIndex} open={open} setOpen={setOpen} />
              <LetterPicker open={open} setOpen={setOpen} />
            </View> */}
            <AppStack />
            <StatusBar />
          </SocketContextProvider>
        </NavigationContainer>
      </ClerkProvider>
    </>
  );
};

export default App;
