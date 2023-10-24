import {
  View,
  Image,
  Text,
  ImageSourcePropType,
  StyleSheet,
  Pressable,
} from "react-native";
import { player } from "../../../types";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";

type TscreenProps = {
  question: string;
  CurrentPlayer: player | null;
};

// const width = useSharedValue(10);
// const height = useSharedValue(10);

// function startAnimation(params: type) {
//   width.value = withTiming(50);
//   height.value = withTiming(50);
// }

const styles = StyleSheet.create({
  container: {
    height: 250,
    borderWidth: 1,
    borderColor: "white",
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 20,
  },
  questionStyle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
});

const { container, questionStyle } = styles;

const Screen = ({ CurrentPlayer, question }: TscreenProps) => {
  return (
    <View className=" border border-white py-10 relative mb-20 h-56   rounded-lg">
      <View className="mt-10 px-2 ">
        <Text className="text-center text-lg font-bold text-white">
          {question}
        </Text>
      </View>
      <View className="absolute right-2 top-2">
        <Image
          className="rounded-full"
          style={{ width: 50, height: 50 }}
          source={
            {
              uri: `${CurrentPlayer?.characterAvatar}`,
            } as ImageSourcePropType
          }
        />
      </View>
      <View className="absolute left-2 top-2 p-1 bg-white rounded-xl w-20 h-10 flex justify-center items-center">
        <Text>{CurrentPlayer?.points}</Text>
      </View>
    </View>
  );
};

export default Screen;
