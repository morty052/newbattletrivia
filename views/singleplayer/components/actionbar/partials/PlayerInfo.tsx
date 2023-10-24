import { Pressable, Text } from "react-native";
import { player } from "../../../../../types";

function PlayerInfo({
  player,
  callDebuff,
}: {
  player: player;
  callDebuff: (username: string) => void;
}) {
  return (
    <Pressable
      className="flex flex-row items-center  justify-between  mx-auto w-full my-2 border-y py-2.5"
      onPress={() => callDebuff(player.username)}
    >
      <Text>{player.username}</Text>
      <Text>{player.points}</Text>
    </Pressable>
  );
}

export default PlayerInfo;
