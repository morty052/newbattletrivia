import { View, Text, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { PlayerBar } from "../playerbar";
import { AnswerBar } from "../answerbar";
import { Button, Loader } from "../../../../components";
import { getPlayer, handleAnswerContest } from "../../features/levelActions";
import { playerClass } from "../../../../types/player";
import { useSocketcontext } from "../../../../hooks/useSocketContext";

type Props = {
  players: playerClass[];
  handleReady: (username: string) => void;
  room_id: string;
  currentPlayer: playerClass;
};

type labelNames = "Name" | "Animal" | "Place" | "Thing";

type fact = {
  description: string;
  isReal: boolean;
};

export const TallyScreen = ({
  players,
  handleReady,
  room_id,
  currentPlayer,
}: Props) => {
  const [inspecting, setInspecting] = useState<null | playerClass>(null);
  const [contesting, setContesting] = useState(false);
  const [facts, setFacts] = useState<null | fact>(null);
  // const [currentPlayer, setCurrentPlayer] = useState<null | playerClass>(null);
  const [tally, setTally] = useState<null | playerClass[]>(null);

  const { socket } = useSocketcontext();

  const { choices, username } = inspecting ?? {};
  const { name, animal, place, thing } = choices ?? {};

  const { description, isReal } = facts ?? {};

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
      console.log("tally", playerTally);
      // const currentPlayer = (await getPlayer(players)) ?? {};
      const currentPlayerTally = playerTally.find(
        (player: any) => player.username === currentPlayer.username
      );
      currentPlayer.populateChoices(currentPlayerTally.choices);
    });
  }

  /*
   * Fetch current player from server
   */
  useEffect(() => {
    handleGetTally();
  }, []);

  useEffect(() => {
    socket?.on("BUSTED_PLAYER", (data) => {
      console.info("busted player", currentPlayer?.username);
      const { updatedTally, username, labelToChange } = data;
      setTally(updatedTally);
      if (username === currentPlayer?.username) {
        console.info("its you buddy", username, labelToChange);
        currentPlayer?.clearSingleChoice(labelToChange);
      }
    });
  }, [socket]);

  if (!tally || !currentPlayer) {
    return <Loader />;
  }

  return (
    <View>
      <View className="space-y-8 px-2 pt-12">
        {!inspecting && (
          <>
            {tally?.map((player: playerClass, index: number) => (
              <PlayerBar
                isCurrentPlayer={player.username === currentPlayer?.username}
                player={player}
                handleReady={() => handleReady(player.username)}
                inspecting={inspecting}
                setInspecting={(player) => setInspecting(player)}
                key={index}
              />
            ))}

            <Button title="Ready" onPress={() => currentPlayer.tallyScore()} />
          </>
        )}

        {inspecting && !contesting && (
          <>
            <AnswerBar
              handleContest={(answer, label) => handleContest(answer, label)}
              answer={name as string}
              label="Name"
            />
            <AnswerBar
              handleContest={(answer, label) => handleContest(answer, label)}
              answer={animal as string}
              label="Animal"
            />
            <AnswerBar
              handleContest={(answer, label) => handleContest(answer, label)}
              answer={place as string}
              label="Place"
            />
            <AnswerBar
              handleContest={(answer, label) => handleContest(answer, label)}
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
  );
};
