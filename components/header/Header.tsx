import { Entypo, FontAwesome } from "@expo/vector-icons";
import { Pressable, View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-expo";
import { useSocketcontext } from "../../hooks/useSocketContext";

type message = {
  sender: string;
  message?: string;
  accepted: boolean;
};

function Header() {
  const navigation = useNavigation();
  const [open, setopen] = useState(false);
  const [notificationOpen, setnotificationOpen] = useState(false);
  const [messages, setmessages] = useState<[] | message[]>([]);

  const { user } = useUser();
  const username = user?.username;

  const { socket } = useSocketcontext();

  async function fetchMessages() {
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

    const { messages } = await fetch(
      "https://snapdragon-cerulean-pulsar.glitch.me/messages",
      options
    )
      .then((res) => res.json())
      .then((res) => res)
      .catch((err) => console.log(err));

    setmessages(messages);
    console.log(messages);
  }

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    socket?.on("NEW_MESSAGE", (msg) => {
      console.log("message received");
      fetchMessages();
    });
  }, [socket]);

  // TODO ADD ACCEPT NOTIFICATIONS LOGIC
  function acceptFriendRequest(target: string) {
    socket?.emit("ACCEPT_FRIEND_REQUEST", {
      username,
      sender: target,
    });
  }
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
          onPress={() => setnotificationOpen(!notificationOpen)}
          className="flex flex-row gap-x-6 items-center"
        >
          <FontAwesome name="bell" size={24} color="white" />
          <FontAwesome name="user" size={24} color="white" />
        </Pressable>
      </View>

      {/* SIDEBAR */}
      {open && (
        <View className=" absolute bottom-0 top-0 w-72 bg-black z-10 pt-10 px-4">
          <Pressable onPress={() => setopen(false)}>
            <Text className="text-white text-2xl font-medium">Close</Text>
          </Pressable>
          <Pressable onPress={() => navigation.goBack()}>
            <Text className="text-white text-2xl font-medium">Back</Text>
          </Pressable>
        </View>
      )}

      {/* NOTIFICATIONS */}
      {notificationOpen && (
        <View className="absolute bottom-0 top-0 right-0 left-0 bg-gray-50 z-[500] pt-10 px-4">
          <Pressable onPress={() => setnotificationOpen(false)}>
            <Text className="text-gray-800 text-2xl font-medium">
              Notifications
            </Text>
          </Pressable>

          <View>
            {messages?.map((message, index) => {
              const { accepted, sender } = message;

              return (
                <View
                  key={index}
                  className="my-2 p-4 bg-gray-200 rounded-lg flex flex-row items-center justify-between"
                >
                  <Text>{sender} wants to be your friend</Text>
                  {!accepted && (
                    <View className="flex flex-row space-x-2">
                      <Pressable onPress={() => acceptFriendRequest(sender)}>
                        <Text className="text-green-600">Accept</Text>
                      </Pressable>
                      <Pressable>
                        <Text className="text-red-600">Reject</Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      )}
    </>
  );
}

export default Header;
