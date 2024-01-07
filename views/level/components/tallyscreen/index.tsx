import { View, Text, ActivityIndicator, Image } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { PlayerBar } from "../playerbar";
import { AnswerBar } from "../answerbar";
import { Button, Loader } from "../../../../components";
import { getPlayer, handleAnswerContest } from "../../features/levelActions";
import { playerClass } from "../../../../types/player";
import { useSocketcontext } from "../../../../hooks/useSocketContext";
import { chain } from "lodash";
import { checkForKey } from "../../../../lib/secure-store";

function FinalTallyScreen({ currentPlayer }: { currentPlayer: playerClass }) {
  const [fetching, setFetching] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const score = currentPlayer.tallyScore();
    setScore(score);
    console.info("player scored", score);
  }, []);

  return (
    <View className="flex-1 h-3/5 bg-white mt-10 rounded-lg mx-2  flex justify-center items-center">
      {score > 100 ? (
        <Image
          className="w-48 h-48 rounded-full my-4"
          source={{
            uri: "https://img.freepik.com/free-psd/realistic-3d-emoji-with-excited-smile_125540-2698.jpg?w=900&t=st=1701105551~exp=1701106151~hmac=0de3f2b36ea0e22291697f093d352867cb349a6c590b78a8a4d8f920f6769d1e",
          }}
        />
      ) : (
        <Image
          className="w-48 h-48 rounded-full my-4"
          source={{
            uri: "https://img.freepik.com/free-psd/realistic-3d-crying-emoji_125540-2827.jpg?w=900&t=st=1701105710~exp=1701106310~hmac=10c1856a7d587959315c108ec9b6b6775640ef45b95bff2ee67b8ceba6921571",
          }}
        />
      )}
      <Text className="text-green-500 text-3xl">You Scored</Text>
      <Text className="text-green-400 font-semibold text-5xl mt-2">
        {score} points!
      </Text>
    </View>
  );
}

type Props = {
  // players: playerClass[];
  handleFinishTally: (scores: any) => void;
  // handleReady: (username: string) => void;
  room_id: string;
  currentPlayer: playerClass;
};

type labelNames = "Name" | "Animal" | "Place" | "Thing";

type fact = {
  description: string;
  isReal: boolean;
};

export const TallyScreen = ({
  handleFinishTally,
  // handleReady,
  room_id,
  currentPlayer,
}: Props) => {
  const [inspecting, setInspecting] = useState<null | playerClass>(null);
  const [contesting, setContesting] = useState(false);
  const [facts, setFacts] = useState<null | fact>(null);
  // const [currentPlayer, setCurrentPlayer] = useState<null | playerClass>(null);
  const [tally, setTally] = useState<null | playerClass[]>(null);
  const [viewingFinalTally, setViewingFinalTally] = useState(false);
  const [finalTally, setFinalTally] = useState(0);

  const finalTallyRef = useRef(0);

  const { socket } = useSocketcontext();

  const { choices, username } = inspecting ?? {};
  const { name, animal, place, thing } = choices ?? {};

  const { description, isReal } = facts ?? {};

  // CHECK FOR UNIQUE CHOICES
  // CHECK FOR EMPTY CHOICES
  // CHECK FOR BUSTED CHOICES
  // TALLY SCORE
  // CLOSE TALLY SCREEN
  // OPEN FINAL TALLY SCREEN
  const handleFinalTally = async (
    playerTally: {
      username: string;
      choices: any;
    }[]
  ) => {
    // TURN ALL CHOICES INTO ARRAY
    const choices = playerTally
      .map((player) => Object.values(player.choices))
      .flat()
      .filter((c) => c !== "" || "BUSTED");

    // MAKE NEW ARRAY TO CHECK IF EACH PLAYERS CHOICE APPEARS IN CHOICES ARRAY MORE THAN ONCE
    const p = playerTally.map((player) => {
      // GET PLAYER CHOICES
      const playerChoices = Object.values(player.choices);
      // FILTER OUT USELESS CHOICES
      const validChoices = playerChoices.filter((c) => c !== "" || "BUSTED");

      // CHECK IF CHOICE APPEARS IN CHOICES ARRAY MORE THAN ONCE
      const uniqueChoices = validChoices
        .map((c) => {
          if (choices.filter((choice) => choice === c).length > 1) {
            return "Duplicate";
          }
          return c;
        })
        .filter((c) => c != "Duplicate");

      return {
        username: player.username,
        choices: player.choices,
        uniqueChoices,
      };
    });

    // const { username } = (await checkForKey()) ?? {};

    // GET THE CURRENT PLAYER WITH UNIQUE CHOICE FIELD ADDED POPULATED WITH UNIQUE CHOICES
    const currentPlayerTally = p.find(
      (player) => player.username == currentPlayer.username
    );

    // HANDLE SCORING

    currentPlayer.checkNonUniqueChoices(currentPlayerTally?.uniqueChoices);
    currentPlayer.tallyScore();
    // handleReady(username);
    return p;
  };

  const handleBust = (username: string, label: any) => {
    const updatedTally = tally?.map((player) => {
      if (player.username === username) {
        return {
          ...player,
          choices: {
            ...player.choices,
            [label.toLowerCase()]: "BUSTED",
          },
        };
      }

      return player;
    });

    const labelToChange = label.toLowerCase();

    socket?.emit("BUSTED_PLAYER", {
      room_id,
      username,
      updatedTally,
      labelToChange,
    });
  };

  async function handleContest(answer: string, label: labelNames) {
    const isReal = await handleAnswerContest(answer, label, {
      setContesting,
      setFacts,
    });

    if (isReal) {
      console.log("Correct check came back as", isReal);
    }

    if (!isReal) {
      handleBust(username as string, label);
    }
  }

  async function handleGetTally() {
    socket?.emit("GET_TALLY", { room_id }, async (res: any) => {
      const { playerTally } = res;
      setTally(playerTally);
      const currentPlayerTally = playerTally.find(
        (player: any) => player.username === currentPlayer.username
      );
      currentPlayer.populateChoices(currentPlayerTally.choices);
    });
  }

  const handleReady = (username: string) => {
    handleFinalTally(tally);
    setTimeout(() => {
      socket?.emit("READY_PLAYER", { username, room_id }, (res) => {
        console.info(res);
      });
    }, 1000);
  };

  /*
   * Fetch current player from server
   */
  useEffect(() => {
    handleGetTally();
  }, []);

  // LISTEN FOR EVENTS AND HANDLE THEM
  useEffect(() => {
    //* LISTEN FOR CONTEST EVENTS
    socket?.on("BUSTED_PLAYER", (data) => {
      console.info("busted player", currentPlayer?.username);
      const { updatedTally, username, labelToChange } = data;
      setTally(updatedTally);
      if (username === currentPlayer?.username) {
        console.info("its you buddy", username, labelToChange);
        currentPlayer?.clearSingleChoice(labelToChange);
      }
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

    // TODO: CHANGE ALL USER STATUS TO NOT READY
    socket?.on("ALL_PLAYERS_READY", (data: any) => {
      setViewingFinalTally(true);
      setTimeout(() => {
        handleFinishTally(finalTallyRef);
        currentPlayer.clearChoices();
        setViewingFinalTally(false);
      }, 3000);
    });
  }, [socket]);

  if (!tally || !currentPlayer) {
    return <Loader />;
  }

  return (
    <>
      {!viewingFinalTally ? (
        <View className="">
          <View className="space-y-8 px-2 pt-12">
            {!inspecting && (
              <>
                {tally?.map((player: playerClass, index: number) => (
                  <PlayerBar
                    isCurrentPlayer={
                      player.username === currentPlayer?.username
                    }
                    player={player}
                    handleReady={() => handleReady(player.username)}
                    inspecting={inspecting}
                    setInspecting={(player) => setInspecting(player)}
                    key={index}
                  />
                ))}

                {/* <Button
                  title="Tally"
                  // onPress={() => handleReady(currentPlayer.username)}
                  onPress={() => handleFinalTally(tally)}
                /> */}
                <Button
                  title="Ready"
                  onPress={() => handleReady(currentPlayer.username)}
                  // onPress={() => handleFinalTally(tally)}
                />
              </>
            )}

            {inspecting && !contesting && (
              <>
                <AnswerBar
                  handleContest={(answer, label) =>
                    handleContest(answer, label)
                  }
                  answer={name as string}
                  label="Name"
                />
                <AnswerBar
                  handleContest={(answer, label) =>
                    handleContest(answer, label)
                  }
                  answer={animal as string}
                  label="Animal"
                />
                <AnswerBar
                  handleContest={(answer, label) =>
                    handleContest(answer, label)
                  }
                  answer={place as string}
                  label="Place"
                />
                <AnswerBar
                  handleContest={(answer, label) =>
                    handleContest(answer, label)
                  }
                  answer={thing as string}
                  label="Thing"
                />

                <View className="mt-6">
                  <Button title="Accept" onPress={() => setInspecting(null)} />
                </View>
              </>
            )}

            {contesting && (
              <View>
                {description ? (
                  <View className="space-y-4 pt-8">
                    <Text className="text-white text-5xl font-semibold">
                      {isReal ? "Correct" : "Not Real!"}
                    </Text>
                    <Text className="text-white text-2xl font-medium">
                      {description}
                    </Text>

                    <View className="mt-4">
                      <Button
                        title="Accept"
                        onPress={() => {
                          setFacts(null);
                          setContesting(false);
                          setInspecting(null);
                        }}
                      />
                    </View>
                  </View>
                ) : (
                  <View className="flex-1 h-screen pt-20 flex justify-center items-center">
                    <Text className="text-white text-3xl">Fact Checking</Text>
                    <ActivityIndicator size={"large"} color={"white"} />
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      ) : (
        <FinalTallyScreen currentPlayer={currentPlayer} />
      )}
    </>
  );
};
