import { View, Text } from "react-native";

export function HUD({
  points,
  activeLetter,
  time,
}: {
  time: number;
  points: number;
  activeLetter: string;
}) {
  return (
    <View className="my-4 border border-white flex flex-row justify-between px-2 py-2 rounded-xl bg-white/30 ">
      <Text className="text-white text-2xl ">{points}</Text>
      <Text className="text-white text-2xl ">{time}</Text>
      <Text className="text-white text-2xl ">{activeLetter}</Text>
    </View>
  );
}
