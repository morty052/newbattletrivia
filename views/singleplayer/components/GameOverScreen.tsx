import { View, Text, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

type Props = {};

const GameOverScreen = (props: Props) => {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => navigation.goBack()}
      className="flex-1 h-screen bg-black justify-center items-center"
    >
      <Text className="text-red-600 font-bold text-4xl">Game over</Text>
    </Pressable>
  );
};

export default GameOverScreen;
