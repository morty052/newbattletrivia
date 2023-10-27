import { View, Text } from "react-native";
import React from "react";
import { FontAwesome5 } from "@expo/vector-icons";

type Props = {};

function Objective(props: Props) {
  return (
    <View className="bg-white  rounded-xl items-center   flex flex-row ">
      <View className="p-4 mr-4 ">
        <FontAwesome5 name="trophy" size={44} color="gold" />
      </View>
      <View className="flex-1 flex space-y-4 rounded-r-xl bg-purple-100 p-4">
        <Text className="text-lg  ">Answer 20 questions from any category</Text>
        <Text className="text-lg  ">0/5</Text>
      </View>
    </View>
  );
}

const Roadmap = (props: Props) => {
  return (
    <View className="flex-1 bg-blue-400 py-10 px-2">
      <Text className="text-center">Journey</Text>

      <Objective />
    </View>
  );
};

export default Roadmap;
