import { View, Text, ActivityIndicator } from "react-native";

type Props = {};

const Loader = (props: Props) => {
  return (
    <View className="flex-1 flex justify-center items-center bg-black">
      <View>
        <ActivityIndicator size="large" color="gold" />
      </View>
    </View>
  );
};

export default Loader;
