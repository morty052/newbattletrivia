import { View, Text, Pressable } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Animated, {
  useSharedValue,
  FadeInLeft,
  FadeOutLeft,
} from "react-native-reanimated";
import { useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
const stack = createNativeStackNavigator();

type Props = {};

const EventStack = () => {
  return (
    <stack.Navigator>
      <stack.Screen
        options={{ headerShown: false }}
        name="AllEvents"
        component={AllEvents}
      />
    </stack.Navigator>
  );
};

const MiniHeader = () => {
  const [open, setopen] = useState(false);
  const navigation = useNavigation();
  return (
    <>
      <View className="flex-row justify-between px-4 items-center">
        <Pressable
          className="h-10 w-10 rounded-full bg-blue-400 p-2 flex justify-center items-center"
          onPress={() => setopen(!open)}
        >
          <View>
            <Entypo name="info-with-circle" size={24} color="white" />
          </View>
        </Pressable>

        <Pressable
          onPress={() => navigation.goBack()}
          className="h-10 w-10 rounded-full bg-red-600 p-2 flex justify-center items-center"
        >
          <AntDesign name="closecircle" size={24} color="white" />
        </Pressable>
      </View>
      {open && (
        <Animated.View
          className={
            "flex flex-1 absolute top-0 bottom-0 right-0 left-0 flex-row items-center bg-yellow-500 z-10 "
          }
          entering={FadeInLeft}
          exiting={FadeOutLeft}
        >
          {/* close button */}
          <Pressable
            onPress={() => setopen(false)}
            className="absolute top-4 right-1 bg-white p-2 rounded-full"
          >
            <AntDesign name="closecircle" size={24} color="white" />
          </Pressable>
          <Text>i am the opened thing</Text>
        </Animated.View>
      )}
    </>
  );
};

const EventItem = (props: Props) => {
  return (
    <View className="flex-row justify-between p-4 bg-purple-200 rounded-lg ">
      <Text className="text-2xl font-semibold">Event Item</Text>
    </View>
  );
};

const AllEvents = (props: Props) => {
  return (
    <View className="flex-1 py-10 px-2">
      <MiniHeader />
      <View className="pt-4">
        <Text>All Events</Text>
        <View className="pt-4">
          <EventItem />
        </View>
      </View>
    </View>
  );
};

const Events = (props: Props) => {
  return <EventStack />;
};

export default Events;
