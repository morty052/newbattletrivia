import { Pressable, StyleSheet, Text, View, Image } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import testSound from "../assets/wrongcode.mp3";
import useSound from "../hooks/useSound";

import { useNavigation } from "@react-navigation/native";

import aroan from "../assets/aroan.jpeg";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  room_id: string;
};

function CharacterButton() {
  const navigation = useNavigation();

  return (
    <Pressable onPress={() => navigation.navigate(`CharacterSelect`)}>
      <Image source={aroan} style={styles.characterbutton} />
    </Pressable>
  );
}

const BottomNav = ({ open, setOpen, room_id }: Props) => {
  const navigation = useNavigation();

  const { play } = useSound(testSound);

  const menuItems = [
    {
      name: "Characters",
      to: "MenuOptions",
    },
    {
      name: "Friends",
      to: "PublicMatch",
    },
    {
      name: "Play",
      to: "Lobby",
    },
    // * SEND USER TO CATEGORY SCREEN INITIALLY
    // * FOR USER TO BE SENT BACK TO CREATEROOM/CREATEDROOMID
    {
      name: "Tournament",
      to: "PrivateMatch",
    },
  ];

  return (
    <View className="bg-blue-400" style={styles.container}>
      {/* {menuItems.map((option, key) => (
      ))} */}
      {/* CHARACTER BUTTON */}
      <CharacterButton />

      {/* ONLINE FRIENDS */}
      <Pressable
        style={styles.navbutton}
        // onPress={() => navigation.navigate(`${option.to}`)}
        onPress={() => {
          navigation.navigate("Friends", {
            room_id,
          });
        }}
      >
        {/* <Text>Online Friends</Text> */}
        <FontAwesome5 name="user-friends" size={24} color="black" />
      </Pressable>

      {/* PLAY BUTTON  */}
      <Pressable
        style={styles.playButton}
        // onPress={() => navigation.navigate(`${option.to}`)}
        onPress={() => {
          play();
          setOpen(!open);
        }}
      >
        <Text style={styles.playButtonText}>Play</Text>
      </Pressable>

      {/* TOURNAMENT */}
      <Pressable
        style={styles.navbutton}
        onPress={() => navigation.navigate(`Tournament`)}
        // onPress={() => {
        //   setOpen(!open);
        // }}
      >
        <FontAwesome5 name="trophy" size={24} color="black" />
      </Pressable>

      {/* STORE */}
      <Pressable
        style={styles.navbutton}
        onPress={() => navigation.navigate(`Store`)}
      >
        <FontAwesome5 name="store" size={24} color="black" />
      </Pressable>
    </View>
  );
};

export default BottomNav;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 30,
    left: 4,
    right: 4,
    borderRadius: 20,
    borderColor: "white",
    borderWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
    // justifyContent: "space-between",
  },
  playButton: {
    flex: 1,
    justifyContent: "center",
    display: "flex",
    flexDirection: "row",
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "white",
  },
  playButtonText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "steelblue",
  },
  navbutton: {
    height: 50,
    width: 50,
    borderRadius: 100,
    backgroundColor: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  characterbutton: {
    height: 50,
    width: 50,
    borderRadius: 100,
    backgroundColor: "white",
  },
});
