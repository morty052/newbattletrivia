import { View, Text } from "react-native";
import { StopWatch } from "../../../../components";

export function HUD({
  turnId,
  activeLetter,
  time,
}: {
  time: number;
  turnId: number;
  activeLetter: string;
}) {
  return (
    <View className="absolute top-10 inset-x-0 border border-white flex flex-row justify-between px-2">
      <Text className="text-white text-2xl ">{turnId}</Text>
      <Text className="text-white text-2xl ">{time}</Text>
      <Text className="text-white text-2xl ">{activeLetter}</Text>
    </View>
  );
}
