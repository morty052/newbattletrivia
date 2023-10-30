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
    <View>
      <View className=" border bg-white border-black py-5 relative mb-20 h-56 z-10    rounded-lg">
        {/* QUESTION */}
        <View className="mt-10 px-2 ">
          <Text className="text-center text-lg font-bold text-gray-800">
            {question}
          </Text>
        </View>

        {/* IMAGE */}
        <View className="absolute right-2 top-2">
          <Image
            className="rounded-full"
            style={{ width: 40, height: 40 }}
            source={
              {
                uri: `${CurrentPlayer?.characterAvatar}`,
              } as ImageSourcePropType
            }
          />
        </View>

        {/* POINTS */}
        <View className="absolute left-2 top-2 p-1 bg-blue-400 rounded-xl w-20 h-10 flex justify-center items-center">
          <Text className="text-sm font-medium">{CurrentPlayer?.points}</Text>
        </View>
      </View>
      <View className="absolute border top-0 left-0 right-0 bottom-0 h-56 bg-white     rotate-[5deg] rounded-lg "></View>
      <View className="absolute border top-0 left-0 right-0 bottom-0 h-56 bg-white     rotate-[-5deg] rounded-lg "></View>
    </View>
  );
};

export default Screen;
