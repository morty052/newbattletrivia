import { View, Text, Pressable, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSocketcontext } from "../../hooks/useSocketContext";
import { useUser } from "@clerk/clerk-expo";
import { Loader } from "../../components";
import { useEffect, useState } from "react";
import { checkForKey } from "../../lib/secure-store";

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

  async function handleMatchMaking() {
    const { username } = (await checkForKey()) ?? {};
    console.log(username);
    socket?.emit("MATCH_MAKING", { room_id, username }, (res: any) => {
      setmatchmaking(true);
    });
  }

  async function handleFindMatch() {
    const { username } = (await checkForKey()) ?? {};

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
  }

  useEffect(() => {
    handleMatchMaking();
  }, [socket]);

  useEffect(() => {
    if (!matchmaking) {
      return;
    }

    handleFindMatch();
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

  const handleMatch = async (params: ThandleMatchParams) => {
    const { username } = (await checkForKey()) ?? {};
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
    console.info("this is match params", matchParams);
    socket?.emit("ACCEPT_MATCH", { ...matchParams }, (res: any) => {
      const { room_id, category, seeker_id, match_id } = res;
      console.log("this is res", res);
    });
  };

  if (!matchmaking) {
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
