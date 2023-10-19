// import { FaStar } from "react-icons/fa";
import { useSocketcontext } from "../hooks/useSocketContext";
import { All_Categories } from "../constants";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "@clerk/clerk-expo";
import { View, Text, Pressable, Button } from "react-native";
import { button, layout } from "../styles/primary";
import { fBox } from "../styles/utility";

function TopicScreen({ route }) {
  // TODO DO SOMETHING WITH SIGNED IN STATE
  const { user, isLoaded } = useUser();

  const { socket } = useSocketcontext();

  const username = user?.username;

  const navigation = useNavigation();

  const { room_id } = route.params;

  console.log("this is room id", room_id);

  // * CREATE ROOM FUNCTION
  function handleCreation(id: string) {
    // * SET CATEGORY CHOICE
    // localStorage.setItem("category", id);

    // * RETREIVE CATEGORY
    // const category = localStorage.getItem("category");

    // * SEND EVENT TO SERVER TO CREATE ROOM FROM CLIENT SIDE
    socket?.emit(
      "CREATE_ROOM",
      { username, category: id },
      (room_id: string) => {
        // *DISPATCH CREATE ROOM EVENT / SAVE ROOM ID TO EVENT STATE
        // !ORIGINAL FUNCTION
        // window.location.assign(`/menu/createroom/${res}`);

        navigation.navigate("Lobby", {
          room_id,
        });
      }
    );
  }

  if (!isLoaded) {
    return <Text>....loading</Text>;
  }

  return (
    <View style={layout}>
      <Button title="Go Bac" onPress={() => navigation.goBack()} />
      <Text>Select Category</Text>
      <View style={[fBox]}>
        {All_Categories?.map((category, index) => {
          const { name, id } = category;

          return (
            <Pressable
              style={button}
              key={index}
              onPress={() => handleCreation(id)}
            >
              <Text>{name}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default TopicScreen;
