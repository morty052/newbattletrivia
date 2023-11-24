import { View, Text, Pressable } from "react-native";
import React from "react";
import { playerClass } from "../../features/setPlayer";

type Props = {
  setInspecting: (value: playerClass) => void;
  inspecting: null | playerClass;
  player: playerClass;
  handleReady: (username: string) => void;
};

export const PlayerBar = ({ setInspecting, handleReady, player }: Props) => {
  const { username, points } = player ?? {};

  return (
    <View className="flex flex-row items-center justify-between border rounded-lg p-2 my-4">
      <View className="flex flex-row flex-1">
        <View className="h-5 w-5 rounded-full border mr-2"></View>
        <Pressable
          onPress={() => setInspecting(player)}
          className="text-white  text-center "
        >
          <Text>Contest</Text>
        </Pressable>
        <Pressable
          onPress={() => handleReady(player.username)}
          className="text-white  text-center ml-4"
        >
          <Text>Ready</Text>
        </Pressable>
      </View>

      <View className="flex flex-row  justify-between  w-2/5">
        <Text className="text-white  text-center ">{username}</Text>
        <Text className="text-white  text-center ">{points}</Text>
      </View>
    </View>
  );
};
