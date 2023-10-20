import { View, Text, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSocketcontext } from "../../hooks/useSocketContext";
import { useUser } from "@clerk/clerk-expo";
import { Loader } from "../../components";
import { useEffect, useState } from "react";

function PublicMatch({ route }) {
  const [match, setmatch] = useState<null | string>("");
  const navigation = useNavigation();
  const { socket } = useSocketcontext();

  const { user, isLoaded } = useUser();
  const username = user?.username;

  const { room_id } = route.params;

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    socket?.emit("FIND_MATCH", { room_id, username }, (res: any) => {
      console.log(res);
      const { match, seeker_id, match_id, room_id, category } = res;
      navigation.navigate("Level", {
        room_id,
        seeker_id,
        match_id,
        category,
        public: true,
      });
      setmatch(match);
    });
  }, [socket, isLoaded]);

  if (!isLoaded || !room_id || !room_id) {
    return <Loader />;
  }

  return (
    <View className="flex-1 flex-col gap-y-8 bg-gray-400 pt-10">
      <Text className="text-3xl">current user: {username}</Text>
      <Pressable onPress={() => navigation.goBack()}>
        <Text>Back</Text>
      </Pressable>
      <Text>Public Match: {room_id}</Text>
      <Text> Match: {match}</Text>
    </View>
  );
}

export default PublicMatch;
