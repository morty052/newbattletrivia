import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppStack } from "./Appstack";
import { AuthStack } from "./AuthStack";

type Props = {};
const Stack = createNativeStackNavigator();

const MainStack = (props: Props) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="Auth"
        component={AuthStack}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Home"
        component={AppStack}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
