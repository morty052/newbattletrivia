import React, { useEffect, useState } from "react";
import {
  AnswerView,
  HUD,
  LetterPicker,
  OptionPicker,
  WaitScreen,
} from "./components";
import { View, Button, Text, Pressable } from "react-native";
import { useSocketcontext } from "../../hooks/useSocketContext";
import { Loader, Screen } from "../../components";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { initLevel } from "./features/initLevel";
import { useNavigation } from "@react-navigation/native";

type Props = {};

async function checkAnimal(animal: string) {
  try {
    const url = `https://near-goat-82.deno.dev/ai/checkanimal?animal=${animal}`;
    // "http://localhost:3000/ai/checkanimal?animal=vampire squid";
    const res = await fetch(url, {
      method: "GET",
    });
    const data = await res.json();
    console.log(data);
    return res;
  } catch (error) {
    console.log(error);
  }
}

function RecordingScreen() {
  const [speaking, setSpeaking] = useState(false);
  const [recording, setRecording] = useState<null | Audio.Recording>(null);
  const [sound, setSound] = useState(null);

  const { socket } = useSocketcontext();

  async function uploadSoundToServer(soundFile) {
    const formData = new FormData();

    try {
      const response = await FileSystem.uploadAsync(
        `http://192.168.100.16:3000/ai/speechtotext`,
        soundFile,
        {
          fieldName: "file",
          httpMethod: "POST",
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          headers: {
            Accept: "application/json",
          },
        }
      );
      console.log(JSON.stringify(response, null, 4));
    } catch (error) {
      console.log(error);
    }
  }

  async function startRecording() {
    try {
      console.log("Requesting permissions..");
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    console.log("Stopping recording..");
    const uri = recording?.getURI();
    await recording?.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });

    console.log("Recording stopped and stored at", uri);
    setRecording(uri);
    await uploadSoundToServer(uri);
  }

  async function playSound() {
    console.log("Loading Sound", recording);
    const { sound } = await Audio.Sound.createAsync({ uri: recording });
    setSound(sound);
    console.log("Playing Sound");
    await sound.playAsync();
  }

  useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  async function handleStartRecording() {
    console.info("starting recording");
    setSpeaking(true);
    await startRecording();
  }

  async function handleEndRecording() {
    console.info("ending recording");
    setSpeaking(false);
    await stopRecording();
  }

  return (
    <>
      <Screen>
        <View className="flex space-y-8 ">
          <Text>Recording Screen</Text>

          <Pressable
            onPress={playSound}
            className={`p-4 border ${
              !speaking ? "border-white" : " border-red-500"
            }`}
          >
            <Text>Play</Text>
          </Pressable>
          <Pressable
            onPressOut={handleEndRecording}
            onPressIn={handleStartRecording}
            className={`p-4 border ${
              !speaking ? "border-white" : " border-red-500"
            }`}
          >
            <Text>Press Me</Text>
          </Pressable>
        </View>
      </Screen>
    </>
  );
}

const Level = ({ route }) => {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [activeLetter, setActiveLetter] = useState("B");
  const [selectingLetter, setSelectingLetter] = useState(true);
  const [currentTurn, setCurrentTurn] = useState(1);
  const [players, setPlayers] = useState([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [contesting, setContesting] = useState(false);

  const { socket } = useSocketcontext();

  const { room_id, public: isPublic } = route.params;
  const handleFinish = () => {
    socket?.emit("END_ROUND", {
      room_id,
      currentTurn,
      maxTurns: players.length,
    });
  };

  /**
   * handles the selection of a letter.
   * sends the letter to the server
   * @param {string} letter - The letter to be selected.
   */

  const handleLetterSelect = (letter: string) => {
    socket?.emit("SET_LETTER", { letter, room_id }, (letter: string) => {
      console.log("Sent LETTER > ", letter);
    });
  };

  const handleTurn = (turn: number) => {
    if (turn > 2) {
      setCurrentTurn(1);
      return;
    }
    setCurrentTurn(turn);
  };

  /**
   * Initializes the level by fetching players, max turns, and the current turn ID from the server.
   *
   * @param {string} room_id - The ID of the room.
   * @return {Promise<void>} A promise that resolves when the initialization is complete.
   */
  const handleInit = async () => {
    const { players, maxTurns, turn_id } = await initLevel(room_id);
    setPlayers(players);
    setUserId(turn_id);
  };

  /*
   * useEffect hook that initializes the level when the component mounts.
   */
  useEffect(() => {
    handleInit();
  }, []);

  useEffect(() => {
    socket?.on("SWITCH_TURN", (data: any) => {
      const { turn } = data;
      handleTurn(turn);
      setFinished(false);
      setSelectingLetter(true);
    });

    socket?.on("SWITCH_LETTER", (data: any) => {
      const { letter } = data;
      setActiveLetter(letter);
      setFinished(false);
      setSelectingLetter(false);
    });

    socket?.on("ROUND_ENDED", (data: any) => {
      const { turn } = data;
      setCurrentTurn(turn);
      setFinished(true);
      setSelectingLetter(true);
    });
  }, [socket]);

  const indexColor: any = {
    0: "bg-sky-400",
    1: "bg-green-400",
    2: "bg-blue-400",
    3: "bg-purple-400",
  };

  if (players.length < 1) {
    return <Loader />;
  }

  // const navigation = useNavigation();

  return (
    <>
      <View
        className={`flex-1 flex   pt-8 px-2 relative transition-all duration-200 ease-in  ${indexColor[index]}`}
      >
        <HUD turnId={currentTurn} activeLetter={activeLetter} />
        {/* <View className="pt-12">
          <Button
            title="socket"
            onPress={() => checkAnimal("tarantula")}
          ></Button>
        </View> */}
        {!selectingLetter && !finished && (
          <AnswerView
            handleFinish={handleFinish}
            index={index}
            setIndex={setIndex}
          />
        )}
        <WaitScreen
          handleLetterSelect={(letter: string) => handleLetterSelect(letter)}
          userId={userId}
          turnId={currentTurn}
          selectingLetter={selectingLetter}
        />
        <OptionPicker setIndex={setIndex} open={open} setOpen={setOpen} />
        <LetterPicker open={open} setOpen={setOpen} />
      </View>
    </>
  );
};

export default Level;
