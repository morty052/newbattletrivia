import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
} from "react-native";
import { SocketContextProvider } from "./contexts/SocketContext";
import { basicText } from "./styles/primary";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SignIn, SignUp, Menu } from "./views";
import { ClerkProvider } from "@clerk/clerk-expo";
import { RootSiblingParent } from "react-native-root-siblings";
import { useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import useSound from "./hooks/useSound";
import water from "./assets/waterdrops.mp3";

const Stack = createNativeStackNavigator();

const tw = {
  layout: " flex-1  flex flex-col bg-black  pt-20 relative ",
  loginButton:
    "bg-white py-4 px-8 rounded-xl flex flex-row justify-center items-center",
  signupButton:
    "bg-yellow-400 py-4 px-8 rounded-xl flex flex-row justify-center items-center",
};

function HomeScreen({ navigation }: any) {
  const { user, isSignedIn, isLoaded } = useUser();

  const play = useSound(water);

  useEffect(() => {
    // return sound
    //   ? () => {
    //       console.log("Unloading Sound");
    //       sound.unloadAsync();
    //     }
    //   : undefined;
    play();
  }, [isLoaded]);

  if (!isLoaded) {
    return (
      <View className={`${tw.layout} justify-center items-center`}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("./assets/aroan.jpeg")}
      className={`${tw.layout}`}
    >
      {/* CONTAINER */}
      <View className="flex-1 z-10 px-2 pt-10 ">
        <View className="">
          <Text className="text-yellow-400 text-5xl font-black">
            Battle Trivia
          </Text>
          <Text className="text-2xl text-gray-50 font-medium">
            Go beyond just trivia with friends on the battleground
          </Text>
          <Pressable onPress={play}>
            <Text>Play sound</Text>
          </Pressable>
        </View>

        {/* BUTTONS */}
        <View className=" absolute bottom-20 px-2  flex gap-y-4 w-full ">
          {!isSignedIn ? (
            <Pressable
              className={`${tw.loginButton}`}
              onPress={() => {
                navigation.navigate("Login");
              }}
            >
              <Text className="text-black text-3xl font-semibold">Login</Text>
            </Pressable>
          ) : (
            <Pressable
              className={`${tw.loginButton}`}
              onPress={() => {
                navigation.navigate("Menu");
              }}
            >
              <Text className="text-black text-3xl font-semibold">Menu</Text>
            </Pressable>
          )}

          {!isSignedIn && (
            <Pressable
              className={`${tw.signupButton}`}
              onPress={() => {
                navigation.navigate("Signup");
              }}
            >
              <Text className="text-black text-3xl font-semibold">Sign Up</Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* OVERLAY */}
      <View className="absolute top-0 bottom-0 right-0 left-0 bg-black/30"></View>
    </ImageBackground>
  );
}

function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={basicText}>Login Screen</Text>
      <StatusBar style="auto" />
    </View>
  );
}

export default function App() {
  return (
    <ClerkProvider
      publishableKey={
        "pk_test_dHJ1c3RpbmctZG9ua2V5LTQyLmNsZXJrLmFjY291bnRzLmRldiQ"
      }
    >
      <NavigationContainer>
        <SocketContextProvider>
          <RootSiblingParent>
            <Stack.Navigator>
              <Stack.Screen
                options={{ headerShown: false }}
                name="Home"
                component={HomeScreen}
              />
              <Stack.Screen name="Login" component={SignIn} />
              <Stack.Screen name="Signup" component={SignUp} />
              <Stack.Screen
                options={{ headerShown: false }}
                name="Menu"
                component={Menu}
              />
            </Stack.Navigator>
          </RootSiblingParent>
          <StatusBar backgroundColor="#000000" style="auto" />
        </SocketContextProvider>
      </NavigationContainer>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
