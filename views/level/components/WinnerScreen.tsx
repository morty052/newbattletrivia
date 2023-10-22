import { View, Text, Button } from "react-native";
import { player } from "../../../types";
import { Entypo } from "@expo/vector-icons";
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
    <View className="flex-1 h-screen bg-blue-400 py-16 px-2">
      <Button title="Go Back" onPress={() => navigation.goBack()} />
      <Text className="text-5xl font-bold text-yellow-400 text-center">
        {winnerName === username ? "Winner" : "You lose!"}
      </Text>
      <View className="my-2 flex flex-row items-center justify-between border">
        <Text>{winnerName}</Text>
        <Text>{winningPoints}</Text>
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
    </View>
  );
};

export default WinnerScreen;
