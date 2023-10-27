import { useState, useEffect, useReducer } from "react";
import { useSocketcontext } from "../../hooks/useSocketContext";
import MenuReducer, { defaultMenuState } from "../../reducers/MenuReducer";
import { player } from "../../types";
import { useUser } from "@clerk/clerk-expo";
import background from "../../assets/background.jpeg";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  BottomNav,
  TopicScreen,
  Button,
  Inventory,
  Header,
  ProgressBar,
} from "../../components";
import { layout } from "../../styles/primary";
import Lobby from "../../lobby/Lobby";
import {
  View,
  Text,
  Pressable,
  Image,
  ImageBackground,
  Modal,
  SafeAreaView,
} from "react-native";
import { fBox } from "../../styles/utility";
import Level from "../level/Level";
import CharacterSelect from "../characterselect/CharacterSelect";
import { FontAwesome } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import OnlineFriends from "../onlinefriends/OnlineFriends";
import { useNavigation } from "@react-navigation/native";
import LeaderBoard from "../leaderboard/LeaderBoard";
import Store from "../store/Store";
import { AntDesign } from "@expo/vector-icons";
import PublicMatch from "../publicmatch/PublicMatch";
import SinglePlayer from "../singleplayer/SinglePlayer";
import Roadmap from "../roadmap/Roadmap";
import Events from "../events/Events";

const Stack = createNativeStackNavigator();
const MenuStack = createNativeStackNavigator();

function MenuOptions({ setOpen }: any) {
  // const { mode } = useParams();
  let mode = null;
  const { socket, _id } = useSocketcontext();

  const navigation = useNavigation();

  const menuItems = [
    {
      name: "Single Player",
      to: "Singleplayer",
      params: {
        room_id: _id,
      },
    },
    {
      name: "Public Match",
      to: "Publicmatch",
      params: {
        room_id: _id,
      },
    },
    // * SEND USER TO CATEGORY SCREEN INITIALLY
    // * FOR USER TO BE SENT BACK TO CREATEROOM/CREATEDROOMID
    {
      name: "Private match",
      to: "Category",
      params: {
        room_id: _id,
      },
    },
    {
      name: "Marathon",
      to: "Category",
      params: {
        room_id: _id,
      },
    },
  ];

  if (mode == "OFFLINE") {
    return <Text>Playing Single Player</Text>;
  }

  return (
    <>
      <View style={[fBox, { paddingVertical: 40, paddingHorizontal: 5 }]}>
        <View
          style={[
            fBox,
            {
              borderWidth: 1,
              paddingVertical: 40,
              paddingHorizontal: 10,
              borderRadius: 20,
              backgroundColor: "#FFFFFFAA",
              position: "relative",
            },
          ]}
        >
          {menuItems.map((option, index: number) => {
            const { name, to, params } = option;

            return (
              <Button
                key={index}
                styles={{ backgroundColor: "steelblue" }}
                title={name}
                onPress={() => {
                  setOpen(false);
                  navigation.navigate(`${to}`, { ...params });
                }}
              />
            );
          })}
          <Pressable
            onPress={() => setOpen(false)}
            className="absolute -top-4 -right-1 bg-white p-2 rounded-full"
          >
            <AntDesign name="closecircleo" size={24} color="red" />
          </Pressable>
        </View>
      </View>
    </>
  );
}

function MenuScreen({ navigation }: any) {
  const [open, setopen] = useState(false);
  const { _id } = useSocketcontext();
  return (
    <ImageBackground
      source={background}
      style={[layout, { position: "relative" }]}
    >
      {/* HEADER */}
      <Header />

      {/* INVENTORY */}

      <Inventory />

      {/* PROGRESS BAR */}
      <ProgressBar />

      {/* TUTORIAL AND EVENTS */}
      <View
        style={{
          // backgroundColor: "white",
          marginTop: 20,
          flexDirection: "row",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {/* TUTORIAL */}
        <Pressable
          style={{
            backgroundColor: "steelblue",
            height: 70,
            width: 70,
            borderRadius: 100,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Entypo name="help" size={24} color="white" />
        </Pressable>
        {/* EVENTS */}
        <Pressable
          onPress={() => {
            navigation.navigate("Events");
          }}
          style={{
            backgroundColor: "steelblue",
            height: 70,
            width: 70,
            borderRadius: 100,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MaterialIcons name="event-note" size={24} color="white" />
        </Pressable>
      </View>
      {/* ROADMAP */}
      <View
        style={{
          // backgroundColor: "white",
          marginTop: 20,
          flexDirection: "row",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Pressable
          onPress={() => {
            navigation.navigate("Roadmap");
          }}
          style={{
            backgroundColor: "steelblue",
            height: 70,
            width: 70,
            borderRadius: 100,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Entypo name="map" size={24} color="white" />
        </Pressable>
      </View>

      <BottomNav room_id={_id} open={open} setOpen={setopen} />

      {/* OPTIONS  MODAL */}
      <Modal visible={open} transparent={true}>
        <View style={{ flex: 1, backgroundColor: "#000000AA", paddingTop: 50 }}>
          {/* <Button title="Close modal now" onPress={() => setopen(false)} /> */}
          <MenuOptions setOpen={setopen} />
        </View>
      </Modal>
    </ImageBackground>
  );
}

function Menu() {
  return (
    <MenuStack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="MenuOptions"
        component={MenuScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="PrivateMatch"
        component={MenuOptions}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Singleplayer"
        component={SinglePlayer}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="CharacterSelect"
        component={CharacterSelect}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Lobby"
        component={Lobby}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Category"
        component={TopicScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Publicmatch"
        component={PublicMatch}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Level"
        component={Level}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Friends"
        component={OnlineFriends}
      />
      <Stack.Screen
        // options={{ headerShown: false }}
        name="Tournament"
        component={LeaderBoard}
      />
      <Stack.Screen
        // options={{ headerShown: false }}
        name="Store"
        component={Store}
      />
      <Stack.Screen
        // options={{ headerShown: false }}
        name="Roadmap"
        component={Roadmap}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Events"
        component={Events}
      />
    </MenuStack.Navigator>
  );
}

export default Menu;
