import { Pressable, Text, View } from "react-native";
import { player } from "../../../../../types";
import { Entypo } from "@expo/vector-icons";

function PlayerInfo({
  player,
  callDebuff,
  CurrentPlayer,
}: {
  player: player;
  callDebuff: (username: string) => void;
  CurrentPlayer: boolean;
}) {
  return (
    <Pressable
      className="flex flex-row items-center  justify-between my-2  mx-auto w-full  border-b py-2.5"
      onPress={() => callDebuff(player.username)}
    >
      <View className="flex flex-row items-center">
        {CurrentPlayer ? (
          <Entypo
            style={{ marginRight: 5 }}
            name="user"
            size={20}
            color="black"
          />
        ) : (
          <Entypo
            style={{ marginRight: 5 }}
            name="circle"
            size={20}
            color="black"
          />
        )}
        <Text className={`text-lg font-medium ml-2  `}>{player.username}</Text>
      </View>
      <Text>{player.points}</Text>
    </Pressable>
  );
}

export default PlayerInfo;
