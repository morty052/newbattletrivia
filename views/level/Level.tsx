/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */

import { useEffect, useReducer, useState } from "react";
// import { FaStar } from "react-icons/fa";
import { useSocketcontext } from "../../hooks/useSocketContext";
// import { useParams } from "react-router-dom";
import { max } from "lodash";
import { StandardView, GameOverScreen } from "./components";
import { SetPlayers } from "./features";
import Levelreducer, { LevelState } from "../../reducers/LevelReducer";
import { player } from "../../types";
import { character } from "../../types";
import { useUser } from "@clerk/clerk-react";
import { TstatusTypes } from "./components/ChoiceList";
import {
  Button,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { layout } from "../../styles/primary";
import { useNavigation } from "@react-navigation/native";

const Level = ({ route }) => {
  const [GameState, GameDispatch] = useReducer(Levelreducer, LevelState);
  const [confused, setconfused] = useState(false);
  const [statusEffects, setStatusEffects] = useState<TstatusTypes>();

  const { socket } = useSocketcontext();

  const {
    room_id,
    category,
    public: isPublic,
    seeker_id,
    match_id,
  } = route.params;
  const { width, height } = useWindowDimensions();

  const navigation = useNavigation();

  // TODO:CHANGE LOCATION OF USERNAME
  // const username = localStorage.getItem("username");
  const { user, isLoaded } = useUser();

  const username = user?.username;

  const {
    ended,
    questions,
    level,
    CurrentPlayer,
    OtherPlayers,
    allPlayers,
    scoreBoard,
    winner,
  } = GameState;

  // !ORIGINAL FUNCTION
  const { question, correct_answer, incorrect_answers } =
    questions.length > 1 ? questions[level] : [];

  // ?TESTING NEW OBJECT DESTRUCTURING
  // const { question, correct_answer, incorrect_answers } =
  //   questions.length > 1 ? CurrentPlayer.questions[level] : [];

  //* destructure and rename username and points variable from winner object from state.

  const { points: winningPoints, username: winnerName } = winner;
  // const { username: winnerName } = winningController ? winningController : [];

  const { lives } = CurrentPlayer as player;

  // * HANDLE PLAYER DAMAGE AND DEATH
  const decreaseLives = () => {
    const { lives } = CurrentPlayer;

    if (lives == 1) {
      console.log("player about to die now");
      socket?.emit("PLAYER_DEATH", {
        username: CurrentPlayer.username,
        room_id,
      });
    }

    CurrentPlayer.takeDamage();
  };

  const increasePoints = () => {
    CurrentPlayer.increasePoints();
  };

  // const handleDebuff = (res) => {
  //   CurrentPlayer.Debuff(res);
  // };

  // * HANDLE PLAYER DEATH AND RESPONSE
  // * HANDLE EVENT FIRED AFTER USER PICKS AN ANSWER
  useEffect(() => {
    if (!CurrentPlayer) {
      return;
    }

    socket?.on("RESPONSE_RECEIVED", (res) => {
      // @ts-expect-error
      GameDispatch({
        type: "PROGRESS_LEVEL",
        payload: {
          tally: res,
        },
      });
    });

    socket?.on("PLAYER_DEATH", (res) => {
      console.log("Player Died");
      // @ts-expect-error
      GameDispatch({ type: "PLAYER_DEATH", payload: { name: res } });
      console.log("reduced players");
    });

    socket?.on("POWER_USED", (res: character) => {
      console.log("power used");
      const { name } = res;

      // switch (name) {
      //   case "Arhuanran":
      //     CurrentPlayer.Debuff("crushed");
      //     break;
      //   case "Athena":
      //     CurrentPlayer.Debuff();
      //     break;
      //   case "Da Vinci":
      //     CurrentPlayer.Debuff();
      //     break;
      //   case "Ife":
      //     CurrentPlayer.Debuff("confused");
      //     break;
      //   case "Washington":
      //     CurrentPlayer.Debuff();
      //     break;
      //   case "Confucious":
      //     CurrentPlayer.Debuff();
      //     break;

      //   default:
      //     break;
      // }
    });

    socket?.on("DEBUFF_USED", (res) => {
      // handleDebuff(res);
      // CurrentPlayer.Debuff(res);
      console.log("debuff used");
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, CurrentPlayer]);

  // * SET QUESTIONS AND PLAYER OBJECTS
  useEffect(() => {
    // fetchQuestions()

    if (!username) {
      return;
    }

    socket?.emit(
      "SET_ROOM",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { room_id, username, category, isPublic, seeker_id, match_id },
      (res: {
        CurrentPlayer: player;
        OtherPlayers: character[];
        questions: string[];
      }) => {
        const { CurrentPlayer, OtherPlayers, questions } = res;

        const { player, enemies } = SetPlayers(
          CurrentPlayer,
          // @ts-expect-error
          OtherPlayers as player[]
        );

        console.log("this is current player", player.username);
        console.log("this is other player", enemies[0].username);

        // @ts-expect-error

        GameDispatch({
          type: "START_GAME",
          payload: { CurrentPlayer: player, OtherPlayers: enemies, questions },
        });
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  // * HANDLE QUESTIONS END
  useEffect(() => {
    if (level == 19) {
      socket?.emit("TALLY_GAME", { room_id }, (res: any) => {
        // @ts-expect-error
        const points = Array.from(res, (p) => p.points);
        const highest = max(points);

        // @ts-expect-error
        const winner = res.find((p) => p.points == highest);

        // @ts-expect-error
        GameDispatch({
          type: "END_GAME",
          payload: {
            scores: res,
            winner,
          },
        });
      });
    }
  }, [level]);

  // * HANDLE LAST PLAYER STANDING
  useEffect(() => {
    if (allPlayers.length == 1) {
      socket?.emit("TALLY_GAME", { room_id }, (res: any) => {
        const points = Array.from(scoreBoard, (p: player) => p.points);
        const highest = points.reduce((acc, curr) => Math.max(acc, curr), 0);

        // const winner = scoreBoard.find((p: player) => p.points == highest);
        // TODO IMPLEMEMT WINNER
        const winner = {
          points: 12,
          username: "winner",
        };

        // @ts-expect-error
        GameDispatch({
          type: "END_GAME",
          payload: {
            scores: res,
            winner,
          },
        });
      });
    }
  }, [socket, allPlayers]);

  if (questions.length < 1 || !CurrentPlayer || !isLoaded) {
    return (
      <View style={layout}>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
        <Text>....loading</Text>
      </View>
    );
  }

  // * SEND ANSWERS TO SERVER REALTIME
  const handleAnswer = (choice: string) => {
    if (choice != correct_answer) {
      decreaseLives();
      return socket?.emit("SELECTED_OPTION", {
        choice: choice,
        room_id,
        level,
        username,
        CurrentPlayer,
        correct: false,
      });
    }

    // * ONLY INCREASE POINTS IF USER CHOICE IS CORRECT ANSWER
    if (choice == correct_answer) {
      increasePoints();

      // *SEND EVENT TO SERVER
      return socket?.emit("SELECTED_OPTION", {
        choice: choice,
        room_id,
        level,
        username,
        CurrentPlayer,
        correct: true,
      });
    }

    // socket?.emit("SELECTED_OPTION", {
    //   choice: choice,
    //   room_id,
    //   level,
    //   username,
    //   CurrentPlayer,
    // });
  };

  // ?TESTING POWER
  function callPower(i: string) {
    socket?.emit("USE_POWER", { power: i, room_id }, (res: string) => {});
  }

  const { correct_answer: nextQuestion } =
    level < 18 ? questions[level + 1] : [];
  const { correct_answer: thirdQuestion } =
    level < 17 ? questions[level + 2] : [];

  const PowerParams = {
    answer: correct_answer,
    nextQuestion,
    thirdQuestion,
    socket,
    roomID: room_id,
    // @ts-expect-error
    func: (f) => console.log(f),
  };

  return (
    <>
      {lives && lives > 0 ? (
        <View className=" flex-1 h-screen bg-gray-400 px-2 pt-14 ios:pt-20">
          {/* <Button title="Go Back" onPress={() => navigation.goBack()} /> */}
          <StandardView
            CurrentPlayer={CurrentPlayer}
            OtherPlayers={OtherPlayers}
            choices={incorrect_answers}
            question={question}
            correct_answer={correct_answer}
            handleAnswer={handleAnswer}
            confused={confused}
            setconfused={setconfused}
            setStatusEffects={setStatusEffects}
            statusEffects={statusEffects}
            PowerParams={PowerParams}
            room_id={room_id as string}
            level={level}
            scoreBoard={scoreBoard}
          />
        </View>
      ) : (
        <GameOverScreen />
      )}

      {/* {lives && lives < 0 && (
        <View style={layout}>
          <Text>Game over</Text>
        </View>
      )} */}
    </>
  );
};

export default Level;
