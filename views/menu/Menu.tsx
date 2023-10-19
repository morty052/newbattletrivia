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

const Stack = createNativeStackNavigator();
const MenuStack = createNativeStackNavigator();

function MenuOptions({}: any) {
  // const { mode } = useParams();
  let mode = null;
  const { socket, _id } = useSocketcontext();

  const navigation = useNavigation();

  const menuItems = [
    {
      name: "Single Player",
      to: "/room/category",
    },
    {
      name: "Public Match",
      to: "/menu/searchplayers",
    },
    // * SEND USER TO CATEGORY SCREEN INITIALLY
    // * FOR USER TO BE SENT BACK TO CREATEROOM/CREATEDROOMID
    {
      name: "Private match",
      to: "Privatematch",
    },
    {
      name: "Marathon",
      to: "Privatematch",
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
            },
          ]}
        >
          {menuItems.map((option, index: number) => {
            const { name, to } = option;

            return (
              <Button
                key={index}
                styles={{ backgroundColor: "steelblue" }}
                title={name}
                onPress={() =>
                  navigation.navigate("Category", {
                    room_id: _id,
                  })
                }
              />
            );
          })}
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
      {/* {open && (
        <View style={fBox}>
          <Button
            styles={{ backgroundColor: "steelblue" }}
            title="Single Player"
            onPress={() => {
              navigation.navigate("Options");
            }}
          />

          <Button
            styles={{ backgroundColor: "steelblue" }}
            title="Multi Player"
            onPress={() => {
              navigation.navigate("Options");
            }}
          />
          <Button
            styles={{ backgroundColor: "steelblue" }}
            title="Private Match"
            onPress={() => {
              navigation.navigate("Category");
            }}
          />
          <Button
            styles={{ backgroundColor: "steelblue" }}
            title="Change Character"
            onPress={() => {
              navigation.navigate("CharacterSelect");
            }}
          />
        </View>
      )} */}
      {/* HEADER */}
      {/* <View
        style={{
          display: "flex",
          flexDirection: "row",
          // backgroundColor: "white",
          width: "100%",
          justifyContent: "space-between",
          paddingVertical: 10,
          paddingHorizontal: 4,
          borderRadius: 5,
        }}
      >
        <Pressable onPress={() => navigation.goBack()}>
          <Entypo name="menu" size={24} color="white" />
        </Pressable>
        <View className="flex flex-row gap-x-6 items-center">
          <FontAwesome name="bell" size={24} color="white" />
          <FontAwesome name="user" size={24} color="white" />
        </View>
      </View> */}
      <Header />

      {/* INVENTORY */}
      {/* <View
        style={{
          display: "flex",
          flexDirection: "row",
          backgroundColor: "white",
          width: "100%",
          justifyContent: "space-between",
          paddingVertical: 10,
          paddingHorizontal: 4,
          borderRadius: 5,
          marginTop: 20,
        }}
      >
        <Text>Stuff</Text>
        <Text>Other Stuff</Text>
      </View> */}
      <Inventory />

      {/* TUTORIAL AND GAMEMODE */}
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
          <MaterialIcons name="event-note" size={24} color="white" />
        </Pressable>
      </View>

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
          <Button title="Close modal now" onPress={() => setopen(false)} />
          <MenuOptions />
        </View>
      </Modal>
    </ImageBackground>
  );
}

// function MenuRoutes() {
//   return (
//     <MenuStack.Navigator>
//       <MenuStack.Screen name="Privatematch" component={Header} />
//       <MenuStack.Screen name="Options" component={Test} />
//     </MenuStack.Navigator>
//   );
// }

// const Header = () => {
//   const { isSignedIn, user } = useUser();
//   return (
//     <View>
//       <View>
//         {/* <UserButton />
//         <Link to={"/login"}>{isSignedIn ? `${user.username}` : "Sign in"}</Link> */}
//       </View>

//       <View>
//         {/* <FaCog />
//         <FaBell /> */}
//       </View>
//     </View>
//   );
// };

// type TSearchOnlinePlayersProps = {
//   players: player[];
//   handleInvite: (s: string | undefined) => void | undefined;
//   handleSearchPlayers: () => void;
// };

// function SearchOnlinePlayers({
//   players,
//   handleInvite,
//   handleSearchPlayers,
// }: TSearchOnlinePlayersProps) {
//   return (
//     <>
//       {/* ONLINE PLAYERS BOX */}
//       <View>
//         <Text>Online players:</Text>
//         {players?.map((player, index) => (
//           <Pressable onPress={() => handleInvite(player.socket)} key={index}>
//             {player.username}
//           </Pressable>
//         ))}
//       </View>

//       {/* ONLINE PLAYERS BUTTON */}
//       <View>
//         <Pressable onPress={handleSearchPlayers}>
//           <Text> Search Online Players</Text>
//         </Pressable>
//       </View>
//     </>
//   );
// }

// type TmenuOptionsProps = {
//   mode:string
// }

// function Test({ navigation }) {
//   const { socket } = useSocketcontext();

//   function sendMessage(_id: string) {
//     socket?.emit("MESSAGE", { _id });
//   }

//   useEffect(() => {
//     socket?.on("NEW_MESSAGE", (msg: string) => {
//       console.log(msg);
//     });
//   }, [socket]);

//   return (
//     <View>
//       <Pressable onPress={() => navigation.navigate("Options")}>
//         <Text>Test</Text>
//       </Pressable>
//     </View>
//   );
// }

function Menu() {
  const [players, setPlayers] = useState<[] | player[]>([]);
  const [menuOpen, setmenuOpen] = useState(false);

  // TODO CHANGE LOCATION OF HOST
  // const [host, sethost] = useState([]);

  const { socket, _id } = useSocketcontext();
  const { user, isLoaded, isSignedIn } = useUser();

  const [MenuState, MenuDispatch] = useReducer(MenuReducer, defaultMenuState);

  //   const { invitationReceived, host } = MenuState;

  useEffect(() => {
    //* HANDLE INCOMING INVITATION ON GUEST SIDE
    socket?.on("INVITATION", (res) => {
      console.log("inite received");
      /*
       * OPEN MODAL / STORE HOST'S USERNAME AND ROOM_ID
       * ROOM_ID IS ALWAYS THE SAME AS THE HOST'S _ID GOTTEN FROM INVITATION
       */
      console.log(res);

      // !ORIGINAL FUNCTION
      MenuDispatch({ type: "HANDLE_INVITE", payload: res });

      // sethost(res);
    });

    socket?.on("FRIEND_REQUEST_RECEIVED", (data) => {
      /*
       * DISPLAY FRIEND REQUEST
       TODO: UPDATE NOTIFICATIONS
       */

      const { username } = data;
      console.info(`Friend request received from ${username}`);
    });

    // * HANDLE INVITATION ACCEPTED ON GUEST SIDE
    // TODO: DO SOMETHING WITH THE ROOM_ID GOTTEN FROM EVENT
    // TODO GET CATEGORY FROM RES
    // socket?.on("JOIN_HOST_ROOM", (res) => {
    //   const { category, _id } = res;
    //   console.log(res);

    //   window.location.assign(`/lobby/${_id}/${category}`);
    // });
  }, [socket, isSignedIn]);

  // useEffect(() => {
  //   if (isSignedIn) {
  //     socket?.emit(
  //       "USER_CONNECTED",
  //       { username: user?.username },
  //       (_id: string) => {
  //         console.log(_id);
  //         set_id(_id);
  //       }
  //     );
  //   }
  // }, [socket, isSignedIn]);

  function handleSearchPlayers() {
    socket?.emit("FINDING_ONLINE_USERS", (res: player[]) => {
      console.log(res);
      setPlayers(res);
    });
  }

  // function handleInvite(socket_id: string | undefined) {
  //   socket?.emit("SEND_INVITATION", { socket_id, username });
  // }

  //   function closeModal() {
  //     MenuDispatch({ type: "CLOSE_MODAL" });
  //   }

  // function handleMode(mode:string) {
  //   if (mode == "OFFLINE") {
  //     console.log(mode)
  //     return MenuDispatch({type:'SET_SINGLE_PLAYER'})
  //   }
  //  else if (mode == "ONLINE") {
  //     console.log(mode)
  //     return MenuDispatch({type:"SET_MULTIPLAYER"})
  //   }

  // }

  // function MenuRoutes() {
  //   return (
  //     <>
  //       <Routes>
  //         <Route path="/" element={<GameOptions />} />
  //         {/* <Route path="/options/:mode" element={<MenuOptions />} /> */}

  //         <Route path="/createroom/category" element={<CreateRoom />} />

  //         <Route path="/createroom/:room_id" element={<CreateRoom />} />

  //         <Route
  //           path="/searchplayers"
  //           element={
  //             // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //             // @ts-ignore
  //             <SearchOnlinePlayers
  //               players={players}
  //               // handleInvite={handleInvite}
  //               handleSearchPlayers={handleSearchPlayers}
  //             />
  //           }
  //         />
  //         <Route
  //           path="/category"
  //           element={
  //             <TopicScreen
  //               // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //               // @ts-ignore
  //               setcategory={(id: string) => console.log(id)}
  //               categories={All_Categories}
  //             />
  //           }
  //         />
  //         <Route
  //           path="/selectcharacter"
  //           element={
  //             <CharacterSelect func={(id: characterName) => console.log(id)} />
  //           }
  //         />
  //         <Route path="/test" element={<Test />} />
  //       </Routes>
  //     </>
  //   );
  // }

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
    </MenuStack.Navigator>
  );
}

export default Menu;
