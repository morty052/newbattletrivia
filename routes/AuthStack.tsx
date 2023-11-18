import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SignIn, SignUp } from "../views";

const Stack = createNativeStackNavigator();

type Props = {};

export const AuthStack = (props: Props) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="Register"
        component={SignUp}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Login"
        component={SignIn}
      />
    </Stack.Navigator>
  );
};
