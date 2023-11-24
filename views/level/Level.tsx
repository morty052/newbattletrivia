import React, { useEffect, useState } from "react";
import {
  AnswerView,
  HUD,
  LetterPicker,
  OptionPicker,
  TallyScreen,
  WaitScreen,
} from "./components";
import { View, Button, Text, Pressable } from "react-native";
import { useSocketcontext } from "../../hooks/useSocketContext";
import { Loader, Screen } from "../../components";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { initLevel } from "./features/initLevel";
import { useNavigation } from "@react-navigation/native";
import { playerClass } from "./features/setPlayer";

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

// TODO: REFACTOR STATES TO SINGLE OBJECT

const Level = ({ route }: any) => {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [activeLetter, setActiveLetter] = useState("B");
  const [selectingLetter, setSelectingLetter] = useState(true);
  const [currentTurn, setCurrentTurn] = useState(1);
  const [players, setPlayers] = useState<[] | playerClass[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<playerClass>([] as any);
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [contesting, setContesting] = useState(false);
  const [tallying, setTallying] = useState(false);

  const { socket } = useSocketcontext();

  const { room_id, public: isPublic } = route.params;
  /**
   ** Handles the finish event and emits an END_ROUND event to the socket.
   * *sends maxTurns boundary to server
   * *maxTurns is used to check if the round is safe to increase or reset if out of bounds on the serverside
   * @param {any} answers - The answers provided by the user.
   */

  const handleFinish = (answers: any) => {
    console.info("these are the answers", answers);
    socket?.emit("END_ROUND", {
      room_id,
      currentTurn,
      maxTurns: players.length,
      answers,
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

  const handleReady = (username: string) => {
    socket?.emit("READY_PLAYER", { username, room_id }, (res) => {
      console.info(res);
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
    const { players, maxTurns, turn_id, currentPlayer } = await initLevel(
      room_id
    );
    setPlayers(players);
    setUserId(turn_id);
    setCurrentPlayer(currentPlayer);
    socket?.emit("PING_ROOM", { room_id });
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

    socket?.on("PLAYER_READY", (data: any) => {
      const { username } = data;
      console.info("player ready", username);
    });
    socket?.on("ALL_PLAYERS_READY", (data: any) => {
      const { message } = data;
      console.info("player ready", message);
      setTallying(false);
      setSelectingLetter(true);
    });

    socket?.on("ROUND_ENDED", (data: any) => {
      const { turn } = data;
      setCurrentTurn(turn);
      setTallying(true);
      // setFinished(true);
      // setSelectingLetter(true);
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
        {!selectingLetter && !tallying && (
          <AnswerView
            currentPlayer={currentPlayer}
            tallying={tallying}
            handleFinish={(answers) => handleFinish(answers)}
            index={index}
            setIndex={setIndex}
          />
        )}

        {tallying && (
          <TallyScreen
            players={players}
            handleReady={(player) => handleReady(player)}
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
