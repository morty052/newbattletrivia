import {
  createContext,
  useState,
  useEffect,
  useReducer,
  Dispatch,
  ReactNode,
} from "react";
import useSocket from "../hooks/useSocket";
import SocketReducer, { defaultContextState } from "../reducers/SocketReducer";
import { Socket } from "socket.io-client";
import { Pressable, Text, View } from "react-native";
import { useUser } from "@clerk/clerk-expo";
// import InvitationModal from "../components/shared/InvitationModal";
// import { host } from "../components/shared/InvitationModal";
import { useNavigation } from "@react-navigation/native";

interface IsocketProps {
  socket: Socket | null;
  SocketState: null;
  SocketDispatch: Dispatch<void>;
  _id: string | null;
}

type host = {
  username: string;
  socket_id: string;
  _id: string;
};

type InviteModalProps = {
  closeModal: () => void;
  host: host | undefined;
  socket: Socket;
};

const InvitationModal = ({ closeModal, host, socket }: InviteModalProps) => {
  const { user, isLoaded } = useUser();
  const username = user?.username;

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
    <View>
      <Pressable onPress={closeModal}>
        <Text>Close Modal</Text>
      </Pressable>
      <Pressable style={{ marginTop: 40 }} onPress={handleAccept}>
        <Text>Accept Invite</Text>
      </Pressable>
    </View>
  );
};

export const SocketContext = createContext<IsocketProps>({
  socket: null,
  SocketState: null,
  SocketDispatch: () => {},
  _id: null,
});

export const SocketContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [inviteReceived, setinviteReceived] = useState(false);
  const [host, sethost] = useState<host>();
  const [_id, set_id] = useState<string | null>(null);
  const [popUpOpen, setpopUpOpen] = useState(false);

  // const socket = useSocket("https://snapdragon-cerulean-pulsar.glitch.me/",{
  const socket = useSocket(
    "https://snapdragon-cerulean-pulsar.glitch.me/user",
    // "http://localhost:5000/user",
    {
      reconnectionAttempts: 5,
      reconnectionDelay: 5000,
      autoConnect: false,
    }
  );

  const StartListeners = () => {
    socket.on("connect", () => {
      console.log("connected");
    });

    // socket.on("newmessage",(msg)=>{
    //   console.log("message")
    //   Alert.success(`message sent`)
    // })

    socket.on("reconnect", (attempt) => {
      console.log("Reconnect Attempt" + attempt);
    });

    socket.io.on("reconnect_attempt", (attempt) => {
      console.log("Reconnect Attempt" + attempt);
    });

    socket.io.on("reconnect_error", (error) => {
      console.log("Reconnect Attempt" + error);
    });

    socket.io.on("reconnect_failed", () => {
      console.info("Reconnect Failed");
    });
  };

  const { isSignedIn, user } = useUser();

  const { username } = user || {};

  const navigation = useNavigation();

  const SendHandShake = () => {
    if (!isSignedIn) {
      socket.emit("handshake", { isGuest: true });
      setloading(false);
      return;
    }
    socket.emit("handshake", { username });
    setloading(false);
  };

  const [loading, setloading] = useState(true);
  const [SocketState, SocketDispatch] = useReducer(
    SocketReducer,
    defaultContextState
  );

  useEffect(() => {
    // Connect to socket
    socket.connect();

    //  save socket with reducer to state
    SocketDispatch({ type: "update_socket", payload: socket });

    // Start the event listeners
    StartListeners();

    // send handshake
    SendHandShake();
  }, [isSignedIn, socket]);

  // * GET USER ID
  useEffect(() => {
    if (isSignedIn) {
      socket?.emit(
        "USER_CONNECTED",
        { username: user?.username },
        (_id: string) => {
          console.log(_id);
          set_id(_id);
        }
      );
    }
  }, [socket, isSignedIn]);

  useEffect(() => {
    socket?.on("FRIEND_REQUEST_RECEIVED", (data) => {
      /*
       * DISPLAY FRIEND REQUEST
       TODO: UPDATE NOTIFICATIONS
       */

      const { username } = data;
      // message.info(`Friend request received from ${username}`);
      setinviteReceived(true);
    });

    socket?.on("INVITATION", (res) => {
      /*
       * OPEN MODAL / STORE HOST'S USERNAME AND ROOM_ID
       * ROOM_ID IS ALWAYS THE SAME AS THE HOST'S _ID GOTTEN FROM INVITATION
       */
      console.log("res");
      sethost(res);
      setinviteReceived(true);
    });

    socket?.on("JOIN_HOST_ROOM", (res) => {
      const { _id } = res;
      console.log("got something back");

      navigation.navigate("Lobby", {
        room_id: _id,
      });
    });
  }, [socket]);

  if (loading) {
    return <Text>Loading</Text>;
  }

  return (
    <SocketContext.Provider
      value={{ SocketState, SocketDispatch, socket, _id }}
    >
      {children}
      {inviteReceived && (
        <InvitationModal
          socket={socket}
          closeModal={() => setinviteReceived(false)}
          host={host}
        />
      )}
    </SocketContext.Provider>
  );
};
