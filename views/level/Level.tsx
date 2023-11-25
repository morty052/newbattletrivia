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
import { initLevel } from "./features/initLevel";
import { playerClass } from "../../types/player";
import { useStopWatch } from "../../components";

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
  const [activeLetter, setActiveLetter] = useState("A");
  const [selectingLetter, setSelectingLetter] = useState(true);
  const [currentTurn, setCurrentTurn] = useState(1);
  const [players, setPlayers] = useState<[] | playerClass[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<playerClass>([] as any);
  const [userId, setUserId] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  // const [timeUp, setTimeUp] = useState(false);
  const [tallying, setTallying] = useState(false);

  const { socket } = useSocketcontext();
  const { time, timeUp, setTimeUp } = useStopWatch(playing);
  const { room_id, public: isPublic } = route.params;

  const state = {
    index,
    activeLetter,
    selectingLetter,
    currentTurn,
    // players,
    // currentPlayer,
    userId,
    playing,
    timeUp,
    tallying,
  };

  const stateView = JSON.stringify(state, null, 2);

  /**
   ** Handles the finish event and emits an END_ROUND event to the socket.
   * *sends maxTurns boundary to server
   * *maxTurns is used to check if the round is safe to increase or reset if out of bounds on the serverside
   * @param {any} answers - The answers provided by the user.
   */

  // const handleFinish = (answers: any) => {
  //   console.info("these are the answers", answers);

  //   socket?.emit(
  //     "END_ROUND",
  //     {
  //       room_id,
  //       currentTurn,
  //       maxTurns: players.length,
  //       answers,
  //       player: currentPlayer,
  //     },
  //     (res) => {
  //       setPlaying(false);
  //       setTallying(true);
  //     }
  //   );
  // };

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
    // setPlaying(true);
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
      setSelectingLetter(true);
    });

    /*
     * handles letter switch event from server
     * sets the active letter to the letter provided
     * sets the playing state to true
     */
    socket?.on("SWITCH_LETTER", (data: any) => {
      const { letter } = data;
      setActiveLetter(letter);
      setSelectingLetter(false);
      setTallying(false);
      setPlaying(true);
    });

    /*
     * handles single player ready event from server
     */
    socket?.on("PLAYER_READY", (data: any) => {
      const { username } = data;
      console.info("player ready", username);
    });

    /*
     * handles all players ready event from server
     */
    socket?.on("ALL_PLAYERS_READY", (data: any) => {
      setTallying(false);
      setSelectingLetter(true);
    });

    /*
     * handles round ended event from server
     * sets the current turn to the next player
     * sets the playing state to false
     * sets the tallying state to true
     */

    socket?.on("ROUND_ENDED", (data: any) => {
      const { turn } = data;
      setCurrentTurn(turn);
      setPlaying(false);
      setTallying(true);
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
        <HUD time={time} turnId={currentTurn} activeLetter={activeLetter} />
        {playing && (
          <AnswerView
            room_id={room_id}
            timeUp={timeUp}
            currentPlayer={currentPlayer}
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
        <Text>{stateView}</Text>
        <OptionPicker setIndex={setIndex} open={open} setOpen={setOpen} />
        <LetterPicker open={open} setOpen={setOpen} />
      </View>
    </>
  );
};

export default Level;
