import { View, Text, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { player } from "../../types";

type Props = {};

const tw = {
  layout: " flex-1  flex flex-col bg-white pt-5 px-2  relative ",
  loginButton:
    "bg-white py-4 px-8 rounded-xl flex flex-row justify-center items-center",
  signupButton:
    "bg-blue-400 py-4 px-8 rounded-xl flex flex-row justify-center items-center",
};

const LeaderBoard = (props: Props) => {
  const [ranking, setranking] = useState<null | player[]>();

  async function FetchLeaderboard() {
    const response = await fetch(
      "https://snapdragon-cerulean-pulsar.glitch.me/leaderboard"
    );
    const data = await response.json();
    const { players } = data;
    console.log(data);
    setranking(players);
  }
  useEffect(() => {
    FetchLeaderboard();
  }, []);

  if (!ranking) {
    return (
      <View className="flex-1 flex h-screen justify-center items-center bg-yellow-300">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View className={`${tw.layout}`}>
      <View className="flex flex-row gap-x-2 items-center mx-auto">
        <Text className="text-center text-3xl font-semibold">LeaderBoard</Text>
        <FontAwesome name="trophy" size={30} color="gold" />
      </View>
      <View className="flex flex-col justify-center items-center">
        {ranking?.map((player, index) => {
          return (
            <View
              className="flex flex-row gap-x-2 border py-4 w-full  justify-between px-4 items-center my-2 rounded-md bg-blue-200"
              key={player._id}
            >
              <Text className="text-xl font-medium first-letter:capitalize">
                {index + 1} {player.username}
              </Text>
              <Text className="text-xl font-medium">
                {player.alltimescore ? player.alltimescore : 0}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default LeaderBoard;
