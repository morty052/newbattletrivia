import { Socket } from "socket.io-client";

export const defaultContextState = {
  socket: undefined,
  uid: "",
  users: [],
};

const SocketReducer = (state, action) => {
  console.info(`socket open`);

  switch (action.type) {
    case "update_socket":
      return { ...state, socket: action.payload as Socket };

    case "join_room":
      state.socket?.emit("join_room", action.payload, action.payload?.callBack);
      return { ...state };

    case "set_user":
      state.socket?.emit("set_user", action.payload);
      return { ...state };

    case "ping_room":
      state.socket?.emit("ping_room", action.payload, action.payload?.callBack);
      return { ...state };

    default:
      return { ...state };
  }
};

export default SocketReducer;
