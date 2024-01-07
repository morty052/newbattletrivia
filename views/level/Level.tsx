import React, { useEffect, useMemo, useReducer, useState } from "react";
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
import alphabets from "../../constants/alphabets";
import { Game } from "../../classes/Game";
import { levelReducer, levelState as state } from "./reducer/levelReducer";

type Props = {};

function WaitingScreen(params: type) {
  return (
    <View className="flex-1 bg-fuchsia-500 flex justify-center items-center">
      <Text className="text-white text-5xl">Waiting for other players</Text>
    </View>
  );
}

// TODO: REFACTOR STATES TO SINGLE OBJECT

const Level = ({ route }: any) => {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [setActiveLetter] = useState("A");
  const [setSelectingLetter] = useState(true);
  const [setCurrentTurn] = useState(1);
  const [setPlayers] = useState<[] | playerClass[]>([]);
  const [setCurrentPlayer] = useState<playerClass>([] as any);
  const [setUserId] = useState<number | null>(null);
  const [setPlaying] = useState(false);
  // const [timeUp, setTimeUp] = useState(false);
  const [setTallying] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [availableLetters, setAvailableLetters] = useState<string[]>(alphabets);

  const { socket } = useSocketcontext();

  const { room_id, public: isPublic } = route.params;

  const [levelState, dispatch] = useReducer(levelReducer, state);
  const { game, tallying, playing, activeLetter, selectingLetter } =
    levelState ?? {};
  const {
    currentTurn,
    players,
    currentPlayer,
    // timeUp,
  } = game ?? {};

  const { turn_id: user_turn_id } = currentPlayer ?? {};

  const { time, timeUp, setTimeUp } = useStopWatch(playing);

  // const stateView = JSON.stringify(state, null, 2);

  /**
   ** Handles the finish event and emits an END_ROUND event to the socket.
   * *sends maxTurns boundary to server
   * *maxTurns is used to check if the round is safe to increase or reset if out of bounds on the serverside
   * @param {any} answers - The answers provided by the user.
   */

  const handleFinish = (answers: any) => {
    socket?.emit(
      "END_ROUND",
      {
        room_id,
        currentTurn,
        maxTurns: players.length,
        answers,
        player: currentPlayer,
      },
      (data: any) => {
        const { turn } = data;
        setWaiting(true);
        // STOP PLAY AND SWITCH TURNS
        dispatch({ type: "END_ROUND", payload: turn });
        // setPlaying(false);
        // setCurrentTurn(turn);

        // * GIVE SERVER TIME TO UPLOAD ALL PLAYERS DATA
        setTimeout(() => {
          setWaiting(false);
          // setTallying(true);

          //* dispatch start tally event
          dispatch({ type: "START_TALLY" });
        }, 3000);
      }
    );
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

  /*
   * sets the tallying state to false and sets the selectingLetter state to true
   * sets index to 0
   */

  const handleFinishTally = () => {
    setIndex(0);
    dispatch({ type: "FINISH_TALLY" });
    // setTallying(false);
    // setSelectingLetter(true);
  };

  /**
   * Initializes the level by fetching players, max turns, and the current turn ID from the server.
   *
   * @param {string} room_id - The ID of the room.
   * @return {Promise<void>} A promise that resolves when the initialization is complete.
   */
  const handleInit = async () => {
    const { NewGame } = (await initLevel(room_id)) ?? {};
    // setGame(NewGame);
    dispatch({ type: "INIT", payload: NewGame });
    // setPlayers(players);
    // setUserId(turn_id);
    // setCurrentPlayer(currentPlayer);
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
      dispatch({ type: "SWITCH_TURN", payload: turn });
      // handleTurn(turn);
      // setSelectingLetter(true);
    });

    /*
     * handles letter switch event from server
     * sets the active letter to the letter provided
     * sets the playing state to true
     */
    // TODO: REMOVE SELECTED LETTER FROM AVAILABLE LETTERS
    socket?.on("SWITCH_LETTER", (data: any) => {
      const { letter } = data;
      // setActiveLetter(letter);
      dispatch({ type: "SWITCH_LETTER", payload: letter });
      const newLetters = availableLetters.splice(
        availableLetters.indexOf(letter),
        1
      );
      // setSelectingLetter(false);
      // setTallying(false);
      // setPlaying(true);
    });

    /*
     * handles round ended event from server
     * sets the current turn to the next player
     * sets the playing state to false
     * sets the tallying state to true
     */

    socket?.on("ROUND_ENDED", (data: any) => {
      const { turn } = data;
      dispatch({ type: "ROUND_ENDED", payload: turn });
      // setCurrentTurn(turn);
      // setPlaying(false);
      // setTallying(true);
    });
  }, [socket]);

  const indexColor: any = {
    0: "bg-sky-400",
    1: "bg-green-400",
    2: "bg-blue-400",
    3: "bg-purple-400",
  };

  if (!levelState.players) {
    return <Loader />;
  }

  if (waiting) {
    return <Loader />;
  }

  // const navigation = useNavigation();

  return (
    <>
      <View
        className={`flex-1 flex space-y-4  pt-8 pb-20 px-2 relative  transition-all duration-200 ease-in  ${indexColor[index]}`}
      >
        {playing && (
          <HUD
            time={time}
            points={currentPlayer.points}
            activeLetter={activeLetter}
          />
        )}
        {playing && (
          <AnswerView
            handleFinish={(answers) => handleFinish(answers)}
            room_id={room_id}
            timeUp={timeUp}
            currentPlayer={currentPlayer}
            index={index}
            setIndex={setIndex}
          />
        )}

        {tallying && (
          <TallyScreen
            currentPlayer={currentPlayer}
            room_id={room_id}
            handleFinishTally={handleFinishTally}
          />
        )}

        <WaitScreen
          alphabets={availableLetters}
          handleLetterSelect={(letter: string) => handleLetterSelect(letter)}
          user_turn_id={user_turn_id}
          turn_id={currentTurn}
          selectingLetter={selectingLetter}
        />

        {!tallying && (
          <OptionPicker setIndex={setIndex} open={open} setOpen={setOpen} />
        )}
      </View>
    </>
  );
};

export default Level;
