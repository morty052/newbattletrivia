import { Entypo, FontAwesome } from "@expo/vector-icons";
import { Pressable, View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";

function Header() {
  const navigation = useNavigation();
  const [open, setopen] = useState(false);

  return (
    <>
      <View
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
        <Pressable onPress={() => setopen(!open)}>
          <Entypo name="menu" size={24} color="white" />
        </Pressable>
        <Pressable
          onPress={() => navigation.goBack()}
          className="flex flex-row gap-x-6 items-center"
        >
          <FontAwesome name="bell" size={24} color="white" />
          <FontAwesome name="user" size={24} color="white" />
        </Pressable>
      </View>

      {open && (
        <View className=" absolute bottom-0 top-0 w-72 bg-black z-10 pt-10 px-4">
          <Pressable onPress={() => setopen(false)}>
            <Text className="text-white text-2xl font-medium">Close</Text>
          </Pressable>
        </View>
      )}
    </>
  );
}

export default Header;
