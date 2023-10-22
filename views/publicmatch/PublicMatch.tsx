import { View, Text, Pressable, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSocketcontext } from "../../hooks/useSocketContext";
import { useUser } from "@clerk/clerk-expo";
import { Loader } from "../../components";
import { useEffect, useState } from "react";

function PublicMatch({ route }) {
  const [match, setmatch] = useState<null | string>("");
  const [matchmaking, setmatchmaking] = useState(false);
  const [acceptModalOpen, setacceptModalOpen] = useState(false);
  const [matchParams, setmatchParams] = useState<ThandleMatchParams>({
    username: "",
    match: "",
    message: "",
    room_id: "",
    category: "",
    seeker_id: "",
    match_id: "",
  });

  const [test_id, settest_id] = useState("");
  const navigation = useNavigation();
  const { socket } = useSocketcontext();

  const { user, isLoaded } = useUser();
  const username = user?.username;

  const { room_id } = route.params;

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    socket?.emit("MATCH_MAKING", { room_id, username }, (res: any) => {
      console.log(res);
      // const { match, seeker_id, match_id, room_id, category } = res;
      // navigation.navigate("Level", {
      //   room_id,
      //   seeker_id,
      //   match_id,
      //   category,
      //   public: true,
      // });

      setmatchmaking(true);
    });
  }, [socket, isLoaded]);

  useEffect(() => {
    if (!matchmaking) {
      return;
    }

    socket?.emit(
      "FIND_MATCH",
      { username },
      (res: {
        match: string;
        message: "MATCH_FOUND" | "NO_MATCH_FOUND";
        room_id: string;
        category: string;
        seeker_id: string;
        match_id: string;
      }) => {
        const { match, message, room_id, category, seeker_id, match_id } = res;
        handleMatch(res);
      }
    );
  }, [matchmaking, socket]);

  useEffect(() => {
    socket?.on(
      "JOINED_PUBLIC_ROOM",
      (res: {
        room_id: string;
        status: "CREATED" | "JOINED";
        seeker_id: string;
        match_id: string;
      }) => {
        const { room_id, status, seeker_id, match_id } = res;

        // TODO: HANDLE Category proprly
        const category = "General_Knowledge";

        switch (status) {
          case "CREATED":
            console.log("One Player", res);
            break;
          case "JOINED":
            console.log("PLAYER ACCEPTED NAVIGATING NOW", res);
            navigation.navigate("Level", {
              room_id,
              seeker_id,
              match_id,
              category,
              public: true,
            });

          default:
            break;
        }

        // settest_id(room_id);
      }
    );

    socket?.on("PUBLIC_ROOM", (res) => {
      console.log(`${username} got it too`);
    });

    // return () => {
    //   socket?.off("JOINED_PUBLIC_ROOM");
    //   socket?.off("PUBLIC_ROOM");
    // };
  }, [socket]);

  type ThandleMatchParams = {
    match: string;
    message: "MATCH_FOUND" | "NO_MATCH_FOUND" | "";
    room_id: string;
    category: string;
    seeker_id: string;
    match_id: string;
    username?: string | null | undefined;
  };

  const handleMatch = (params: ThandleMatchParams) => {
    const { match, message, room_id, category, seeker_id, match_id } = params;
    setmatch(match);

    setmatchParams({
      username: username,
      match,
      message,
      room_id,
      category,
      seeker_id,
      match_id,
    });

    setacceptModalOpen(true);
  };

  const handleAccept = () => {
    setacceptModalOpen(false);
    console.log(matchParams);
    socket?.emit("ACCEPT_MATCH", { ...matchParams }, (res: any) => {
      const { room_id, category, seeker_id, match_id } = res;
      console.log(res);
    });
  };

  if (!isLoaded || !room_id || !room_id) {
    return <Loader />;
  }

  return (
    <View className="flex-1 flex-col gap-y-8 bg-gray-400 pt-10">
      {!matchmaking && <Loader />}
      {matchmaking && (
        <>
          <View className="py-20 px-4">
            <Text className="text-3xl">current user: {username}</Text>
            <Pressable onPress={() => navigation.goBack()}>
              <Text>Back</Text>
            </Pressable>
            <Text>Public Match: {room_id}</Text>
            <Text> Match: {match}</Text>

            <Button
              title="Test name Space"
              onPress={() =>
                socket?.emit("TEST_NAME_SPACE", { room_id: test_id })
              }
            />
          </View>
        </>
      )}
      {acceptModalOpen && (
        <View className="flex flex-col items-center h-screen bg-blue-400">
          <Text>Are you sure you want to accept this match? {match}</Text>
          <Pressable onPress={() => handleAccept()}>
            <Text>Yes</Text>
          </Pressable>
          <Pressable onPress={() => setacceptModalOpen(false)}>
            <Text>No</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

export default PublicMatch;
