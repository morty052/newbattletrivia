import { useUser } from "@clerk/clerk-expo";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useSocketcontext } from "../../hooks/useSocketContext";
import { Modal } from "react-native";

export type host = {
  username: string;
  socket_id: string;
  _id: string;
};

type InviteModalProps = {
  closeModal: () => void;
  host: host | undefined;
};

const InvitationModal = ({ closeModal, host }: InviteModalProps) => {
  const { user, isLoaded } = useUser();
  const username = user?.username;

  const { socket } = useSocketcontext();

  function handleAccept() {
    console.log(host);
    socket?.emit("JOIN_USER", {
      username,
      host: host?.username,
      _id: host?._id,
    });
    closeModal();
  }

  // TODO ADD REJECT FUNCTION
  function handleReject() {
    closeModal();
  }

  return (
    <Modal transparent className="">
      <View className="flex-1 bg-black/70 flex py-40 px-2 ">
        <View className="bg-white px-2 py-6 rounded-xl ">
          <Text className="text-2xl text-center font-semibold">Invitation</Text>
          <View className="py-4">
            <Text className="text-lg text-center font-medium">
              You have been invited to join a game accept or reject by clicking
              an option
            </Text>
          </View>

          <View className="py-2">
            <Text className="text-lg text-center">
              Category: General Knowledge
            </Text>
          </View>
          <View className="py-2">
            <Text className="text-lg text-center">Host: {host?.username}</Text>
          </View>
          <View className="flex flex-row justify-between items-center pt-4">
            <Pressable
              className="px-4 py-2 border rounded-lg"
              onPress={closeModal}
            >
              <Text className="text-lg text-red-600 ">Reject </Text>
            </Pressable>
            <Pressable
              className="px-4 py-2 border rounded-lg"
              onPress={handleAccept}
            >
              <Text className="text-lg text-green-600">Accept </Text>
            </Pressable>
          </View>

          <Text className=" text-center">Report this user</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    width: "100%",
    height: "100%",
    backgroundColor: "#000000AA",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default InvitationModal;
