import { View, Text, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const ProgressBar = () => {
  return (
    <View className=" bg-blue-400/90 rounded-xl shadow-xl py-2   px-2  flex mb-2">
      {/* BOOST ICON AND BUTTON */}
      <View className="flex items-center  justify-between  pb-4 flex-row ">
        <Pressable>
          <Text className="text-xl font-bold text-white">
            Boost your rank now
          </Text>
        </Pressable>
        <MaterialCommunityIcons
          name="chevron-double-up"
          size={35}
          color="gold"
        />
      </View>

      {/* NUMBERS */}
      <View className=" flex flex-row justify-between pr-1.5 ">
        <Text className="text-white font-bold text-xl">Level 1</Text>
        <Text className="text-white font-bold text-xl"> 2</Text>
      </View>

      {/* BAR CONTAINER */}
      <View className="flex flex-row items-center justify-between   pb-2">
        {/* PROGRESS BAR */}
        <View className="h-4 flex-1 flex-shrink-0 bg-gray-700/90 rounded-lg relative  ">
          {/* PROGRESS INDICATOR */}
          <View className="bg-yellow-200 h-4 w-20 rounded-lg absolute top-0 left-0 ">
            <Text className="text-yellow-200">m</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ProgressBar;
