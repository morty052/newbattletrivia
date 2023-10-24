import { View, Text, Pressable } from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import { useSocketcontext } from "../../hooks/useSocketContext";
import { useUser } from "@clerk/clerk-expo";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { All_Categories } from "../../constants";
import { useNavigation } from "@react-navigation/native";
import { Loader } from "../../components";
import CharacterSelect from "../characterselect/CharacterSelect";
import SinglePlayerLevel from "./components/SinglplayerLevel";

const Stack = createNativeStackNavigator();

function CategorySelect() {
  const navigation = useNavigation();

  function handleCategorySelect(category: string) {
    // @ts-expect-error
    navigation.navigate("SinglePlayerLobby", {
      category,
    });
  }

  return (
    <View className="flex flex-1 bg-blue-400 py-10 px-2">
      <Text>Select a Category</Text>

      <View>
        {All_Categories.map((category, index) => {
          return (
            <Pressable
              className="m-2 p-2 border border-white rounded-xl"
              key={index}
              onPress={() => handleCategorySelect(category.id)}
            >
              <Text>{category.name}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function SinglePlayerLobby({ route }: any) {
  const { category } = route.params;

  const { user, isLoaded, isSignedIn } = useUser();
  const username = user?.username;

  const navigation = useNavigation();

  if (!isLoaded) {
    return <Loader />;
  }

  const { socket } = useSocketcontext();

  return (
    <View className="flex flex-1 bg-blue-400 py-10 px-2">
      <Text>Single Player</Text>
      <Text>Category:{category}</Text>

      <View className="my-10 space-y-6 ">
        <Pressable
          onPress={() =>
            // @ts-expect-error
            navigation.navigate("SinglePlayerLevel", {
              category,
              // * handle if player is signed in or not
              isGuest: isSignedIn ? false : true,
            })
          }
          className="p-2 rounded bg-white"
        >
          <Text>Start Game</Text>
        </Pressable>
        <Pressable
          // @ts-expect-error
          onPress={() => navigation.navigate("characterSelect")}
          className="p-2 rounded bg-white"
        >
          <Text>Select Character</Text>
        </Pressable>
        <Pressable
          // @ts-expect-error
          onPress={() => navigation.navigate("CategorySelect")}
          className="p-2 rounded bg-white"
        >
          <Text>Change Category</Text>
        </Pressable>
      </View>
    </View>
  );
}

const SinglePlayer = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CategorySelect" component={CategorySelect} />
      <Stack.Screen name="SinglePlayerLobby" component={SinglePlayerLobby} />
      <Stack.Screen
        options={{ headerShown: false }}
        name="characterSelect"
        component={CharacterSelect}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="SinglePlayerLevel"
        component={SinglePlayerLevel}
      />
    </Stack.Navigator>
  );
};

export default SinglePlayer;
