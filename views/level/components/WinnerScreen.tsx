import { View, Text, Button, Pressable } from "react-native";
import { player } from "../../../types";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

type Props = {
  scoreBoard: player[];
  username: string | null | undefined;
};

const WinnerScreen = ({ scoreBoard, username }: Props) => {
  const navigation = useNavigation();

  const numbers = Array.from(scoreBoard, (player) => player.points);

  const highestNumber = Math.max(...numbers);

  const winner = scoreBoard.filter((player) => player.points == highestNumber);

  const { points: winningPoints, username: winnerName } = winner[0];

  console.log(winner); // Output: 15

  return (
    <View
      className={`flex-1 h-screen bg-blue-400 py-16 px-2 ${
        winnerName != username ? "bg-black" : ""
      }`}
    >
      {/* <Button title="Go Back" onPress={() => navigation.goBack()} /> */}
      {winnerName != username && (
        <Text className="text-5xl font-bold text-red-600 text-center">
          You lose!
        </Text>
      )}
      {winnerName === username && (
        <Text className="text-5xl font-bold text-yellow-400 text-center">
          You Win!
        </Text>
      )}
      <View className="my-2 flex flex-row items-center justify-between border px-2 py-4 bg-white rounded-lg">
        <View className="flex flex-row items-center space-x-4">
          <FontAwesome5 name="crown" size={24} color="gold" />
          <Text className="text-xl font-bold">{winnerName}</Text>
        </View>
        <Text className="text-xl font-bold">{winningPoints}</Text>
      </View>
      <View className="bg-white py-4 my-8 rounded-md px-2 flex space-y-4">
        {scoreBoard.map((player: player) => (
          <View
            className="border py-2 flex flex-row items-center justify-between rounded-lg  px-2"
            key={player.username}
          >
            <View className="flex-1 flex flex-row items-center">
              {player.username == username && (
                <View className="mr-2">
                  <Entypo name="user" size={24} color="black" />
                </View>
              )}
              <Text className="text-lg">{player.username}</Text>
            </View>
            <Text className="text-lg">{player.points}</Text>
          </View>
        ))}
      </View>

      <Pressable className="my-2" onPress={() => navigation.goBack()}>
        <Text className="text-yellow-400 font-bold text-2xl text-center">
          Play Again
        </Text>
      </Pressable>
    </View>
  );
};

export default WinnerScreen;
