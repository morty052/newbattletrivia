/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */

import { useEffect, useReducer, useState } from "react";
// import { FaStar } from "react-icons/fa";
import { useSocketcontext } from "../../../hooks/useSocketContext";
// import { useParams } from "react-router-dom";
import { max } from "lodash";
import { StandardView, GameOverScreen, WinnerScreen } from "../components";
import { setSinglePlayer } from "../features";
import singlePlayerLevelreducer, {
  singlePlayerLevelState,
} from "../../../reducers/singlePlayerReducer";
import { player } from "../../../types";
import { character } from "../../../types";
import { useUser } from "@clerk/clerk-react";
import { TstatusTypes } from "../../level/components/ChoiceList";
import {
  Button,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { layout } from "../../../styles/primary";
import { useNavigation } from "@react-navigation/native";
import { Loader } from "../../../components";

const SinglePlayerLevel = ({ route }: any) => {
  // @ts-expect-error
  const [GameState, GameDispatch] = useReducer(
    singlePlayerLevelreducer,
    singlePlayerLevelState
  );
  const [confused, setconfused] = useState(false);
  const [loading, setloading] = useState(false);
  const [statusEffects, setStatusEffects] = useState<TstatusTypes>();

  const { socket } = useSocketcontext();

  const { category, isGuest } = route.params;

  const navigation = useNavigation();

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

  const { question, correct_answer, incorrect_answers } =
    questions && questions.length > 1 && level != questions.length
      ? questions[level]
      : [];

  //* destructure and rename username and points variable from winner object from state.

  const { points: winningPoints, username: winnerName } = winner ? winner : [];

  const { lives } = CurrentPlayer as player;

  // * HANDLE PLAYER DAMAGE AND DEATH
  const decreaseLives = () => {
    const { lives } = CurrentPlayer;

    if (lives == 1) {
      console.log("player about to die now");
      socket?.emit("PLAYER_DEATH", {
        username: CurrentPlayer.username,
      });
    }

    CurrentPlayer.takeDamage();
  };

  const increasePoints = () => {
    CurrentPlayer.increasePoints();
    // const newscores = scoreBoard.map((player: player) => {
    //   const { points } = player;

    //   if (player.username == username) {
    //     return {
    //       ...player,
    //       //  @ts-ignore
    //       points: points + 10,
    //     };
    //   }

    //   return player;
    // });

    // return newscores;
  };

  // * HANDLE PLAYER DEATH AND RESPONSE
  // * HANDLE EVENT FIRED AFTER USER PICKS AN ANSWER
  useEffect(() => {
    socket?.on("RESPONSE_RECEIVED", (res) => {
      // @ts-expect-error
      GameDispatch({
        type: "PROGRESS_LEVEL",
      });

      setloading(false);
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
  }, [socket]);

  // * SET QUESTIONS AND PLAYER OBJECTS
  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    socket?.emit(
      "SET_SINGLE_PLAYER",
      { isGuest, category, username },
      (res: { questions: any; CurrentPlayer: player }) => {
        const { questions, CurrentPlayer } = res;

        const { player } = setSinglePlayer(CurrentPlayer);

        GameDispatch({
          type: "START_GAME",
          payload: { questions, CurrentPlayer: player },
        });
      }
    );
  }, []);

  // * HANDLE QUESTIONS END
  useEffect(() => {
    if (level == 20) {
      console.log("ending  game", level);
      socket?.emit(
        "TALLY_SINGLE_PLAYER_GAME",
        { points: CurrentPlayer.points, username },
        (res: any) => {
          // @ts-expect-error
          GameDispatch({
            type: "END_GAME",
          });

          console.log("this is final tally", res);
        }
      );
    }
  }, [level]);

  // * HANDLE LAST PLAYER STANDING
  useEffect(() => {
    // if (allPlayers.length == 1) {
    //   socket?.emit("TALLY_GAME", { room_id }, (res: any) => {
    //     const points = Array.from(scoreBoard, (p: player) => p.points);
    //     const highest = points.reduce((acc, curr) => Math.max(acc, curr), 0);
    //     // const winner = scoreBoard.find((p: player) => p.points == highest);
    //     // TODO IMPLEMEMT WINNER
    //     const winner = {
    //       points: 12,
    //       username: "winner",
    //     };
    //     // @ts-expect-error
    //     GameDispatch({
    //       type: "END_GAME",
    //       payload: {
    //         scores: res,
    //         winner,
    //       },
    //     });
    //   });
    // }
  }, [socket]);

  if (!questions || !CurrentPlayer || !isLoaded) {
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
      return socket?.emit("SELECTED_OPTION_SINGLE", {
        choice: choice,
        level,
        username,
        CurrentPlayer,
        correct: false,
      });
    }

    // * ONLY INCREASE POINTS IF USER CHOICE IS CORRECT ANSWER
    if (choice == correct_answer) {
      // *SEND EVENT AND SCORES TO SERVER
      increasePoints();
      return socket?.emit("SELECTED_OPTION_SINGLE", {
        choice: choice,
        level,
        username,
        CurrentPlayer,
        correct: true,
      });
    }
  };

  // * SHOW  LOADER
  if (loading) {
    return <Loader />;
  }

  return (
    <>
      {/* <View className="py-8">
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View> */}
      {!ended && (
        <View className="h-screen flex-1">
          {lives && lives > 0 ? (
            <View className=" flex-1 h-screen bg-gray-400 px-2 pt-14 ios:pt-20">
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
                level={level}
                scoreBoard={scoreBoard}
              />
            </View>
          ) : (
            <GameOverScreen />
          )}
        </View>
      )}

      {ended && (
        <View className="h-screen flex-1">
          <WinnerScreen />
        </View>
      )}
    </>
  );
};

export default SinglePlayerLevel;
