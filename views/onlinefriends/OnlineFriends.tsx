import { player } from "../../types";
import { useState, useEffect } from "react";
import { useSocketcontext } from "../../hooks/useSocketContext";
import { useUser } from "@clerk/clerk-expo";
import { Text, View, TextInput, Pressable, Button } from "react-native";
import { layout } from "../../styles/primary";

function OnlineFriends({ navigation, route }: any) {
  const { socket } = useSocketcontext(); //* GET SOCKET

  const { room_id } = route.params; // * GET ROOM ID
  console.log("this is", room_id);

  const { user, isLoaded, isSignedIn } = useUser(); //  * GET USER
  const username = user?.username;

  const [players, setplayers] = useState([]); //   *PLAYERS

  const [friends, setfriends] = useState([]); //   *FRIENDS

  // * PLAYER SEARCH QUERY
  const [playerName, setplayerName] = useState("");

  // * FILTER PLAYERS USING SEARCH QUERY
  const results =
    players?.length > 1
      ? players.filter((player: player) =>
          player.username.toLowerCase().includes(playerName.toLowerCase())
        )
      : [];

  // * FRIEND REQUEST HANDLER
  function handleFriendRequest(target: string) {
    // TODO: Implement friend request handling logic here
    // You can access the player object to get information about the friend request
    // For example, you can access player.username to get the username of the player who sent the friend request
    // You can use this information to display a notification or update the UI accordingly

    socket?.emit("FRIEND_REQUEST", { username: target, sender: username });
  }

  // * INVITE PLAYER FUNCTION
  function invitePlayer(target_user: string | undefined) {
    /* 
      TODO:CHANGE USERNAME LOCATION FROM LOCAL STORAGE
      TODO:ADD ROOM_ID TO INVITATION REQUEST
      * THE USERNAME IS THE USERNAME OF THE SENDER
      * THE SOCKET ID BELONGS TO TARGET USER
      */

    // !original function
    // socket?.emit("SEND_INVITATION", { socket_id, username:hostName, room_id });

    socket?.emit("SEND_INVITATION", { target_user, room_id, sender: username });
  }

  // *FETCH FRIENDS AND PLAYERS
  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    // * FETCH ONLY FRIENDS OF CURRENT PLAYER
    async function fetchFriends() {
      if (!username) {
        console.log("username not found");
        return;
      }
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: `{"username":"${username}"}`,
      };

      const { onlineFriends } = await fetch(
        "https://snapdragon-cerulean-pulsar.glitch.me/friends",
        options
      )
        .then((res) => res.json())
        .then((res) => res)
        .catch((err) => console.log(err));
      //   CreateRoomDispatch({
      //     type: "FETCH_FRIENDS",
      //     payload: { friends: onlineFriends },
      //   });
      setfriends(onlineFriends);
    }

    //  * FETCH ALL PLAYERS
    async function fetchPlayers() {
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: `{"username":"${username}"}`,
      };
      const { players } = await fetch(
        "https://snapdragon-cerulean-pulsar.glitch.me/players",
        options
      )
        .then((res) => res.json())
        .then((res) => res)
        .catch((err) => console.log(err));

      //   CreateRoomDispatch({
      //     type: "FETCH_PLAYERS",
      //     payload: { players: players },
      //   });
      setplayers(players);
    }

    fetchFriends();
    fetchPlayers();
  }, [socket, username, isLoaded]);

  if (!isLoaded) {
    return <Text>Loading</Text>;
  }

  return (
    <View style={layout}>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
      {/* SEARCH PLAYERS */}
      <View>
        <View>
          <View>
            <TextInput
              style={{ height: 40, borderColor: "black", borderWidth: 1 }}
              value={playerName}
              onChangeText={(e) => setplayerName(e)}
              placeholder="Type to search players"
              id=""
            />
            <Text style={{ textAlign: "center" }}>
              Search players by username
            </Text>

            {/* RESULTS */}
            {playerName && (
              <View style={{ backgroundColor: "white" }}>
                {/* Display message if no results match search */}
                {playerName && results.length < 1 && (
                  <Text>No results match your search</Text>
                )}
                {results?.map((player: player, index: number) => (
                  <Pressable
                    onPress={() => {
                      handleFriendRequest(player.username);
                      setplayerName("");
                    }}
                    key={index}
                  >
                    <Text>{player.username}</Text>
                  </Pressable>
                ))}
                <View>
                  <Text>Click on player to send invite</Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* ONLINE FRIENDS */}
      <View>
        <Text>Online Friends:</Text>
      </View>
      {friends?.map((friend: player, index) => {
        return (
          <Pressable onPress={() => invitePlayer(friend.username)} key={index}>
            <Text> {friend.username}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default OnlineFriends;
