import { View, Text, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { PlayerBar } from "../playerbar";
import { AnswerBar } from "../answerbar";
import { playerClass } from "../../features/setPlayer";
import { Button, Loader } from "../../../../components";
import { Screen } from "../../../../components";
import { getPlayer, handleAnswerContest } from "../../features/levelActions";

type Props = {
  players: playerClass[];
  handleReady: (username: string) => void;
};

type labelNames = "Name" | "Animal" | "Place" | "Thing";

type fact = {
  description: string;
  isReal: boolean;
};

export const TallyScreen = ({ players, handleReady }: Props) => {
  const [inspecting, setInspecting] = useState<null | playerClass>(null);
  const [contesting, setContesting] = useState(false);
  const [facts, setFacts] = useState<null | fact>(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);

  const { choices } = inspecting ?? {};
  const { name, animal, place, thing } = choices ?? {};

  const { description, isReal } = facts ?? {};

  async function handleContest(answer: string, label: labelNames) {
    handleAnswerContest(answer, label, {
      setContesting,
      setFacts,
    });
  }

  useEffect(() => {
    async function fetchCurrentPlayer() {
      const currentPlayer = (await getPlayer(players)) ?? {};
      setCurrentPlayer(currentPlayer);
    }

    fetchCurrentPlayer();
  }, []);

  if (!currentPlayer) {
    return <Loader />;
  }

  return (
    <View>
      <View className="space-y-8 px-2 pt-12">
        {!inspecting && (
          <>
            {players?.map((player: playerClass, index: number) => (
              <PlayerBar
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
                    title="Next"
                    onPress={() => {
                      setFacts(null);
                      setContesting(false);
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
