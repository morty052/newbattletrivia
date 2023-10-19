import { View, Text } from "react-native";
import React from "react";

type Props = {};

const Store = (props: Props) => {
  return (
    <View className="flex-1 bg-gray-400 pt-4 px-2">
      <Text className=" text-center text-3xl">Welcome to the Store</Text>
    </View>
  );
};

export default Store;
