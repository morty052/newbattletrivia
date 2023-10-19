import {
  View,
  Image,
  Text,
  ImageSourcePropType,
  StyleSheet,
} from "react-native";
import { player } from "../../../types";

type TscreenProps = {
  question: string;
  CurrentPlayer: player | null;
};

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
    <View className=" border border-white py-10 relative mb-20  h-52 rounded-lg">
      <View className="mt-10 px-2 ">
        <Text style={questionStyle}>{question}</Text>
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
      <View className="absolute left-2 top-2 p-2 bg-white rounded-xl w-10 h-10 flex justify-center items-center">
        <Text>{CurrentPlayer?.points}</Text>
      </View>
    </View>
  );
};

export default Screen;
