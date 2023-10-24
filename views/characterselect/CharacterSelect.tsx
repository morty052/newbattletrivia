import { useEffect, useReducer, useRef, useState } from "react";
// import characters from "@/constants/characters"
// import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from "../components";
import { useSocketcontext } from "../../hooks/useSocketContext";
// import { FaChevronLeft, FaChevronRight, FaEye, FaHeart } from "react-icons/fa";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Debuffs, characterName } from "../../classes/Player";

import {
  View,
  Text,
  Image,
  Pressable,
  FlatList,
  useWindowDimensions,
  StyleSheet,
  SafeAreaView,
  Platform,
  Button,
} from "react-native/";
import { useUser } from "@clerk/clerk-expo";
import { button, buttonText, layout } from "../../styles/primary";
import { StatusBar } from "expo-status-bar";
import { supabase } from "../../lib";

export type character = {
  name:
    | "Arhuanran"
    | "Athena"
    | "Da Vinci"
    | "Ife"
    | "Washington"
    | "Confucious";
  bio: string;
  avatar?: string;
  traits?: {
    peeks: number;
    peekType: string;
    lives: 2 | 3 | 4 | 6;
    ultimate: "REJUVENATE" | "INVENT" | "CONQUER" | "FORSEE";
    debuff: Debuffs;
  };
};

type Tstate = {
  index: number;
  characters: [] | character[];
  activeCharacter: character | null;
};

type TCharacterActions = "INIT" | "NEXT" | "PREV";

type ACTION = {
  type: TCharacterActions;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
};

export function MiniCharacterSelect({
  func,
}: {
  func: (character: character) => void;
}) {
  const [characters, setcharacters] = useState<null | character[]>(null);
  const { socket } = useSocketcontext();

  // TODO CHANGE LOCATION OF USERNAME
  const username = localStorage.getItem("username");

  async function handleCharacter(character: character) {
    func(character);
    socket?.emit("SET_CHARACTER", { character, username });
  }

  useEffect(() => {
    async function fetchCharacters() {
      await fetch("http://localhost:3000/characters")
        .then((res) => res.json())
        .then((res: { characters: character[] }) => {
          console.log("Fetched");
          setcharacters(res.characters);
          console.log("Fetched");
        });
    }

    fetchCharacters();
    // CharacterDispatch({type:INIT})

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <View>
      {!characters ? (
        <View>
          <Text>..loading</Text>
        </View>
      ) : (
        <View>
          {characters?.map((character, index) => (
            <View key={index}>
              <Image
                source={{
                  uri: character.avatar,
                }}
              />
              <Pressable
                onPress={() => handleCharacter(character as character)}
              >
                {character.name}
              </Pressable>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

function CharacterSelect({
  func,
}: {
  func?: (character: characterName) => void;
}) {
  const state = {
    index: 0,
    characters: [],
    activeCharacter: null,
  };

  function reducer(state: Tstate, action: ACTION) {
    const { index } = state;
    const { type } = action;

    switch (type) {
      case "INIT":
        console.log("Characters received");
        return { ...state, characters: action.payload };

      case "NEXT":
        console.log(index);
        if (index + 1 == action.payload) {
          return { ...state, index: 0 };
        }

        return { ...state, index: index + 1 };
      case "PREV":
        console.log(index);
        if (index - 1 < 0) {
          return { ...state, index: 0 };
        }
        return { ...state, index: index - 1 };

      default:
        return { ...state };
    }
  }

  async function sayMyNameBitch(name: string) {
    const { data, error } = await supabase.functions.invoke("get_speech", {
      body: { name: `${name}` },
    });

    console.log(data);
  }

  const navigate = useNavigation();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [CharacterState, CharacterDispatch] = useReducer(reducer, state);
  const [expanded, setexpanded] = useState(false);

  const { index, characters } = CharacterState;
  const { socket } = useSocketcontext();
  const { user } = useUser();

  const { width, height } = useWindowDimensions();
  const flatListRef = useRef<FlatList>(null);

  const scrollToNextItem = (currentIndex: number) => {
    flatListRef.current?.scrollToIndex({
      index: currentIndex + 1,
      animated: true,
    });
  };

  const scrollToPreviousItem = (currentIndex: number) => {
    flatListRef.current?.scrollToIndex({
      index: currentIndex - 1,
      animated: true,
    });
  };

  const activeCharacter: "" = characters ? characters[index] : [];

  useEffect(() => {
    async function fetchCharacters() {
      const { characters } = await fetch(
        "https://snapdragon-cerulean-pulsar.glitch.me/characters"
      )
        .then((res) => res.json())
        .then((res) => res);
      console.log("fetched characters");
      CharacterDispatch({ type: "INIT", payload: characters });
    }

    fetchCharacters();
    // CharacterDispatch({type:INIT})

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!characters || !activeCharacter) {
    return <Text>...loadiing</Text>;
  }

  const { avatar, bio, name, traits } = activeCharacter;
  const { peeks, lives, ultimate, peektype } = traits;

  const username = user?.username;

  function handleCharacter(activeCharacter: unknown) {
    // func(activeCharacter as characterName);
    socket?.emit("SET_CHARACTER", { character: activeCharacter, username });
  }

  // TODO: HANDLE OUT OF BOUNDS WITH NEXT
  const renderItem = ({ item, index }: { item: character; index: number }) => {
    const { name, avatar, traits, bio } = item;
    const { peeks, lives, ultimate, peektype } = traits;

    return (
      <View
        style={{
          width: width,
          paddingTop: 0,
          position: "relative",
          height: height,
        }}
      >
        <Image
          style={{ height: height / 1.4, width: "100%" }}
          source={{ uri: item?.avatar }}
        />

        {/* Controls */}
        <View
          style={{
            flexDirection: "row",
            position: "absolute",
            top: height / 2 - 50,
            width: "100%",
            justifyContent: "space-between",
            paddingHorizontal: 2,
          }}
        >
          {/* Left */}
          <Pressable
            style={{ backgroundColor: "#000000", padding: 10 }}
            onPress={() =>
              // CharacterDispatch({ type: "NEXT", payload: characters.length })
              scrollToPreviousItem(index)
            }
          >
            <AntDesign name="leftcircle" size={24} color="white" />
          </Pressable>

          {/* Right */}
          <Pressable
            style={{ backgroundColor: "#000000", padding: 10 }}
            onPress={() =>
              // CharacterDispatch({ type: "NEXT", payload: characters.length })
              scrollToNextItem(index)
            }
          >
            <AntDesign name="rightcircle" size={24} color="white" />
          </Pressable>
        </View>

        {/* NAME  */}
        <Pressable
          onPress={() => sayMyNameBitch(item.name)}
          style={{ paddingHorizontal: 20 }}
        >
          <Text style={{ fontSize: 35, fontWeight: "900" }}>{item.name}</Text>
        </Pressable>

        {/* CHARACTER BUTTON/ TRAITS */}
        <View
          style={{
            paddingHorizontal: 20,
            marginTop: 10,
            width: "100%",
            flexDirection: "column",
            rowGap: 10,
          }}
        >
          {/* TRAITS CONTAINER */}
          <Pressable
            onPress={() => setexpanded(!expanded)}
            style={[styles.button]}
          >
            <Text style={styles.buttonText}>View Traits</Text>
          </Pressable>

          <Pressable
            onPress={() => handleCharacter(item)}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Select Character</Text>
          </Pressable>
        </View>

        {/* TRAITS AND BIO MODAL */}
        {expanded && (
          <View
            style={{
              position: "absolute",
              width: "100%",
              top: 0,
              bottom: 0,
              backgroundColor: "red",
            }}
          >
            <Button onPress={() => setexpanded(!expanded)} title="Close" />
          </View>
        )}
      </View>
    );
  };

  return (
    // TODO: CONTROL OUT OF BOUNDS
    <SafeAreaView
      style={{
        paddingTop: Platform.OS === "ios" ? 0 : 20,
        position: "relative",
        backgroundColor: "white",
      }}
    >
      <Pressable
        onPress={() => navigate.goBack()}
        className="absolute top-14 left-2 bg-black z-50 p-2 rounded-lg"
      >
        <Text className="text-white">Back</Text>
      </Pressable>
      {/* <StatusBar style="auto" /> */}
      <FlatList
        ref={flatListRef}
        initialNumToRender={1}
        snapToAlignment="start"
        snapToInterval={width}
        decelerationRate="fast"
        horizontal
        showsHorizontalScrollIndicator
        data={characters}
        keyExtractor={(character) => character.name}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 10,
    backgroundColor: "grey",
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 25,
    fontWeight: "600",
    color: "green",
  },
});

export default CharacterSelect;
