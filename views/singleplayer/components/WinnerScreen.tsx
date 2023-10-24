import { View, Text, Button, Pressable } from "react-native";
import { player } from "../../../types";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

type Props = {
  scoreBoard: player[];
  username: string | null | undefined;
};

const WinnerScreen = () => {
  const navigation = useNavigation();

  return (
    <View className={`flex-1 h-screen bg-blue-400 py-16 px-2`}>
      {/* <Button title="Go Back" onPress={() => navigation.goBack()} /> */}
      <View className="my-2 flex flex-row items-center justify-center border px-2 py-4 bg-white rounded-lg">
        <View className="flex flex-row items-center  space-x-4">
          <FontAwesome5 name="crown" size={24} color="gold" />
          <Text className="text-xl font-bold">You Win!</Text>
        </View>
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
