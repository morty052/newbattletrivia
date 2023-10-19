import { useUser } from "@clerk/clerk-expo";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Socket } from "socket.io-client";
import { useSocketcontext } from "../../hooks/useSocketContext";

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

  function handleReject() {
    closeModal();
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={closeModal}>
        <Text>Close Modal</Text>
      </Pressable>
      <Pressable style={{ marginTop: 40 }} onPress={handleAccept}>
        <Text>Accept Invite</Text>
      </Pressable>
    </View>
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
