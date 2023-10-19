// import { useParams } from "react-router-dom";
import { useSocketcontext } from "../hooks/useSocketContext";
import { useEffect, useState, useLayoutEffect } from "react";
import { player, category } from "../types";
import CharacterSelect from "../views/characterselect/CharacterSelect";
import { All_Categories } from "../constants";
// import { FaUser } from "react-icons/fa";
import { MiniCharacterSelect } from "../views/characterselect/CharacterSelect";
import { useUser } from "@clerk/clerk-expo";
import {
  View,
  Button,
  Text,
  Pressable,
  Image,
  ImageSourcePropType,
} from "react-native";
import { layout } from "../styles/primary";
import { useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnlineFriends from "../views/onlinefriends/OnlineFriends";
// import { console } from "antd";

const Stack = createNativeStackNavigator();

type TSearchOnlinePlayersProps = {
  players?: player[] | null;
};

type TcategoryNames =
  | "General_knowledge"
  | "Movie_trivia"
  | "Mythology_trivia"
  | "Music_trivia"
  | "VideoGame_trivia"
  | "Science_Nature_trivia"
  | "Animal_trivia";

type TLobbyProps = {
  invitedPlayers?: player[] | null;
  category: string | TcategoryNames;
  hostname: string | null;
};

type TCategoryDisplayProps = {
  category: TcategoryNames | string;
};

function CategoryDisplay({ category }: TCategoryDisplayProps) {
  let categoryName;
  switch (category) {
    case "Animal_trivia":
      categoryName = "Animal Trivia";
      break;
    case "General_knowledge":
      categoryName = "General Knowledge Trivia";
      break;
    case "Movie_trivia":
      categoryName = "Movie Trivia";
      break;
    case "Music_trivia":
      categoryName = "Music Trivia";
      break;
    case "Mythology_trivia":
      categoryName = "Mythology Trivia";
      break;
    case "Science_Nature_trivia":
      categoryName = "Science & Nature Trivia";
      break;
    case "VideoGame_trivia":
      categoryName = "Video Game Trivia";
      break;
    default:
      break;
  }

  return (
    <View>
      <Text>Category: {categoryName}</Text>
    </View>
  );
}

function SearchOnlinePlayers({ players }: TSearchOnlinePlayersProps) {
  return (
    <View>
      {players?.map((player, index) => {
        const { controller } = player;
        const { username } = controller;
        return <Text key={index}>{username}</Text>;
      })}
    </View>
  );
}

function TopicSwitcher({
  setswitchingCategory,
}: {
  setswitchingCategory: (bool: boolean) => void;
}) {
  const { socket } = useSocketcontext();
  const { room_id } = [];

  function handleSwitch(category: string) {
    socket?.emit("SET_CATEGORY", { category, room_id }, (res: string) => {
      setswitchingCategory(false);
    });
  }

  return (
    <View>
      {All_Categories.map((category, index) => (
        <Text onPress={() => handleSwitch(category.id)} key={index}>
          {category.name}
        </Text>
      ))}
    </View>
  );
}

function characterSwitcher() {
  return (
    <View>
      <CharacterSelect />
    </View>
  );
}

interface PlayerBarProps {
  playerReady: boolean;
  characterAvatar: string;
  currentPlayerName: string;
  currentPlayer: player | undefined;
  handleReady: (t: player) => void;
}

function PlayerBar({
  playerReady,
  characterAvatar,
  currentPlayerName,
  currentPlayer,
  handleReady,
}: PlayerBarProps) {
  const [switchingCharacter, setswitchingCharacter] = useState(false);

  return (
    <View>
      {/* MAIN PLAYER BAR */}
      <Pressable onPress={() => setswitchingCharacter(!switchingCharacter)}>
        {/* USERNAME AND CHARACTER AVATAR AND ICON */}
        <View>
          <View>
            <Image source={characterAvatar as ImageSourcePropType} />
          </View>
          <View>
            <Text>{currentPlayerName}</Text>
            <Text>FaUser</Text>
          </View>
        </View>

        <View>
          {/* READY BUTTON */}
          <Pressable onPress={() => handleReady(currentPlayer)}>
            <View></View>
          </Pressable>

          {/* READY TEXT */}
          <View>
            <Text>{!playerReady ? "Not Ready" : "Ready"}</Text>
          </View>
        </View>
      </Pressable>

      {/* CHARACTER SELECT */}
      {switchingCharacter && (
        <MiniCharacterSelect
          func={(character) => console.log(character.name)}
        />
      )}
    </View>
  );
}

function Lobby({ route }) {
  // const category = localStorage.getItem("category")
  const [playerID, setPlayerID] = useState("");
  const [currentPlayer, setCurrentPlayer] = useState<player | undefined>();
  const [host, setHost] = useState<string | player | undefined>("");
  const [allPlayers, setAllPlayers] = useState<undefined | player[]>();
  const [category, setCategory] = useState<category | string>("");
  const [loading, setloading] = useState(true);
  const [switchingCategory, setswitchingCategory] = useState(false);
  const [switchingCharacter, setswitchingCharacter] = useState(false);
  const [playerReady, setplayerReady] = useState(false);

  const navigation = useNavigation();

  // @ts-expect-error
  const { room_id } = route.params;
  // TODO GET USERNAME FROM SOMEWHERE ELSE
  const { user, isLoaded } = useUser();

  const username = user?.username;

  const { socket } = useSocketcontext();

  function handleGameStart() {
    socket?.emit(
      "LAUNCH_ROOM",
      { room_id },
      (res: { category: string; room_id: string; players: player[] }) => {
        const { category, room_id, players } = res;

        // TODO: HANDLE NAVIGATION
        // window.location.assign(`/level/${room_id}/${category}`)
        navigation.navigate("Level", {
          room_id,
          category,
        });
      }
    );
  }

  function handleChangeCategory() {
    setswitchingCategory(true);
  }

  function handleReady(player: player) {
    setplayerReady(!playerReady);
    socket?.emit("READY_PLAYER", { player, room_id }, (res: string) => {});
  }

  type IlobbyPlayerProps = {
    guests: player[];
    host: player[];
    players: player[];
    category: string;
  };

  useLayoutEffect(() => {
    // TODO: GET USERNAME FROM SOMEWHERE ELSE
    console.log("this is room", room_id);
    socket?.emit("PING_LOBBY", { room_id }, (res: IlobbyPlayerProps) => {
      const { players, category } = res;

      //* DETERMINE CURRENT USER BY COMPARING USERNAME WITH ALL USERS IN PLAYERS ARRAY
      const currentuser = players.find((player) => player.username == username);
      const host = players.find((player) => player._id == room_id);

      //  * SET PLAYER ID TO DETERMINE HOST ID LATER

      if (isLoaded) {
        setCurrentPlayer(currentuser);
        setAllPlayers(players);
        setPlayerID(currentuser?._id);
        setHost(host);
        setCategory(category);
        setloading(false);
      }

      //TODO: DETERMINE WHEN TO STOP LOADING
      // setloading(false)
    });
  }, [socket, isLoaded]);

  useEffect(() => {
    socket?.on("INVITATION_ACCEPTED", (data) => {
      const { guestRef, host_id } = data;
      /* 
      * SAVE INCOMING PLAYER TO APP STATE AS "guestRef"
      * GET host_id FROM EVENT 
      * EMIT "room_id" AS "host_id" TO SOCKET FOR GUEST SOCKET AND GUEST TO JOIN
      ! THIS FUNCTION FIRES "ADD_GUEST" EVENT DISPATCH TO REDUCER
      ! THIS FUNCTION CALLS "addGuest" FUNCTION FROM REDUCER BY PASSING IT AS A PAYLOAD 
      ! THIS FUNCTIONS SENDS GUEST USERNAME TO RENDER AS POPUP
      */

      // * FIRE ADD_GUEST DISPATCH WHEN THIS EVENT IS CALLED ON SERVER SIDE

      console.info("getting there");
      // CreateRoomDispatch({
      //   type: "ADD_GUEST",
      //   payload: { guest: guestRef, addGuest: addGuest, host_id },
      // });
    });

    socket?.on("ROOM_READY", (res: { category: string; room_id: string }) => {
      const { category, room_id } = res;
      navigation.navigate("Level", {
        room_id,
        category,
      });
    });

    socket?.on("CATEGORY_CHANGE", (res: { category: category }) => {
      const { category } = res;
      setCategory(category);
    });

    socket?.on("PLAYER_READY", (res) => {});
  }, [socket]);

  if (!currentPlayer) {
    return (
      <View style={layout}>
        <Text>...loading</Text>
      </View>
    );
  }

  // DESTRUCTURE HOST NAME AND NEEDED VARIABLES FROM HOST
  // @ts-expect-error
  const { username: hostname } = host;
  const { username: currentPlayerName, characterAvatar } = currentPlayer;

  function MainLobby() {
    const navigation = useNavigation();

    return (
      <View style={layout}>
        {/* DISPLAY ROOM CONTROLS ONLY IF PLAYER ID IS EQUAL TO ROOM ID */}
        {room_id == playerID && (
          <View>
            <Text>This is Your Lobby</Text>

            <View>
              <Button title="Start Game" onPress={() => handleGameStart()} />
              <Button
                title="Change Category"
                onPress={() => handleChangeCategory()}
              />
              <Button title="Go Back" onPress={() => navigation.goBack()} />
              <Button
                title="Friends"
                onPress={() =>
                  navigation.navigate("Friends", {
                    room_id,
                  })
                }
              />
            </View>
          </View>
        )}

        <Button title="Go bAck" onPress={() => navigation.goBack()} />
        <View>
          <View>
            <Text>Host: {hostname}</Text>

            <CategoryDisplay category={category as string} />
          </View>

          {/* DISPLAY  HOST */}
          {room_id != playerID && (
            <PlayerBar
              playerReady={playerReady}
              currentPlayer={currentPlayer}
              currentPlayerName={currentPlayerName}
              characterAvatar={characterAvatar}
              handleReady={handleReady}
            />
          )}

          <View>
            <Text>Other Players</Text>
            {allPlayers?.map((player, index) => {
              if (player.username == currentPlayerName) {
                return null;
              }

              // return <p key={index}>{player.username}</p>;
              return (
                <View key={index}>
                  <PlayerBar
                    currentPlayer={player}
                    playerReady={playerReady}
                    currentPlayerName={player.username}
                    characterAvatar={player.characterAvatar}
                    handleReady={handleReady}
                  />
                </View>
              );
            })}
          </View>
          {/*  */}
        </View>
      </View>
    );
  }

  {
    /* DISPLAY ROOM CONTROLS ONLY IF PLAYER ID IS EQUAL TO ROOM ID */
  }
  {
    /* DISPLAY CURRENT PLAYER EXCEPT HOST */
  }
  {
    /*DISPLAY ALL OTHER PLAYERS EXCEPT CURRENT PLAYER  */
  }
  {
    /* 
  // TODO : DISPLAY ALL OTHER PLAYERS EXCEPT HOST
  */
  }

  {
    /* OTHER PLAYERS COMPONENT */
  }
  return (
    <>
      {/* {!switchingCategory && !switchingCharacter ? (
        <View style={layout}>
          {room_id == playerID && (
            <View>
              <Text>This is Your Lobby</Text>

              <View>
                <Button title="Start Game" onPress={() => handleGameStart()} />
                <Button
                  title="Change Category"
                  onPress={() => handleChangeCategory()}
                />
                <Button title="Go Back" onPress={() => navigation.goBack()} />
              </View>
            </View>
          )}

          <View>
            <View>
              <Text>Host: {hostname}</Text>

              <CategoryDisplay category={category as string} />
            </View>

            

            {room_id != playerID && (
              <PlayerBar
                playerReady={playerReady}
                currentPlayer={currentPlayer}
                currentPlayerName={currentPlayerName}
                characterAvatar={characterAvatar}
                handleReady={handleReady}
              />
            )}

            <View>
              <Text>Other Players</Text>
              {allPlayers?.map((player, index) => {
                if (player.username == currentPlayerName) {
                  return null;
                }

                // return <p key={index}>{player.username}</p>;
                return (
                  <View key={index}>
                    <PlayerBar
                      currentPlayer={player}
                      playerReady={playerReady}
                      currentPlayerName={player.username}
                      characterAvatar={player.characterAvatar}
                      handleReady={handleReady}
                    />
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      ) : (
        <TopicSwitcher setswitchingCategory={setswitchingCategory} />
      )} */}

      <Stack.Navigator>
        <Stack.Screen
          options={{ headerShown: false }}
          name="MainLobby"
          component={MainLobby}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Friends"
          component={OnlineFriends}
        />
      </Stack.Navigator>
    </>
  );
}

export default Lobby;
