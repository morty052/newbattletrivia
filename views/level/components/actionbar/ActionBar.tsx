/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { player } from "../../../../types/player";
import { useReducer, useEffect } from "react";
// import {
//   FaCircle,
//   FaHeart,
//   FaSearch,
//   FaStar,
//   FaUser,
//   FaUserFriends,
// } from "react-icons/fa";
import { Socket } from "socket.io-client";
import { useSocketcontext } from "../../../../hooks/useSocketContext";
import { character, Debuffs, TstatusTypes } from "../../../../types";
// import { message } from "antd";
import { View, Text, Pressable } from "react-native/";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { PlayerInfo } from "./partials";
import actionbarReducer, {
  actionbarState,
} from "../../../../reducers/actionbarReducer";

interface TactionBarProps {
  CurrentPlayer: player;
  OtherPlayers: player[];
  scoreBoard: player[];
  room_id: string;
  level: number;
  confused: boolean;
  setconfused: (c: boolean) => void;
  statusEffects: TstatusTypes | undefined;
  setStatusEffects: (e: TstatusTypes) => void | undefined;
  PowerParams: {
    answer: string;
    nextQuestion: string;
    thirdQuestion: string;
    socket: Socket;
    roomID: string;
    func: (lives: number, powerBars: number) => void;
  };
}

const ActionBar = ({
  CurrentPlayer,
  OtherPlayers,
  PowerParams,
  scoreBoard,
  room_id,
  level,
}: TactionBarProps) => {
  // destructure display numbers and user powers from player class passed as props
  const {
    lives,
    powerBars,
    callPowers,
    ultimate,
    character,
    ultimateBars,
    ultimates,
    username,
  }: player = CurrentPlayer && CurrentPlayer;
  const { name } = character && character;
  const { socket } = useSocketcontext();

  function callUltimate() {
    // CurrentPlayer.Debuff("crushed");
    socket?.emit("USE_POWER", { name, room_id }, (res: string) => {
      console.log(res);
    });
  }

  //* FUNCTION TO DETERMINE SENDER DEBUFF TYPES AND TARGET
  function callDebuff(target: string | undefined) {
    const { character } = CurrentPlayer;
    const { name } = character;
    // @ts-ignore

    // * GET DEBUFF, TARGET NAME AND SENDER FROM SEND DEBUFF FUNCTION DEFINED IN PLAYER OBJECT
    const { debuff, target_name, sender } = CurrentPlayer.callDebuff({
      target_name: `${target}`,
      name: name,
    });

    console.log([debuff, target_name, sender]);

    // console.log(sender);
    socket?.emit(
      "DEBUFF",
      { debuff, target_name, room_id, sender },
      (res: string) => {
        console.log(res);
      }
    );
  }

  // @ts-ignore
  const [ActionState, ActionDispatch] = useReducer(
    actionbarReducer,
    actionbarState
  );

  const { Lives, userTrayOpen } = ActionState;

  const handleTray = () => {
    if (userTrayOpen) {
      return ActionDispatch({ type: "CLOSE_TRAY" });
    }

    ActionDispatch({ type: "OPEN_TRAY" });
  };

  const sendRequest = (username: string) => {
    const targetPartner = OtherPlayers?.find(
      (player) => player.username == username
    );

    CurrentPlayer.teamUp(targetPartner);

    // socket.emit("TEAM_UP",{
    //   username:name
    // })
  };

  const ActionTray = () => {
    return (
      <View className="p-4 mb-4 rounded-2xl bg-white/70 flex gap-y-4">
        {scoreBoard.length < 1
          ? OtherPlayers?.map((player, index) => (
              <PlayerInfo key={index} player={player} callDebuff={callDebuff} />
            ))
          : scoreBoard?.map((player, index) => {
              return (
                // <Pressable
                //   style={{ flexDirection: "row" }}
                //   onPress={() => callDebuff(player.controller?.username)}
                //   key={index}
                // >

                //   <Pressable
                //     style={{ flexDirection: "row" }}
                //     onPress={() => callDebuff(player.username)}
                //   >
                //     {/* // * HANDLE  CURRENT  PLAYER */}
                //     <View>
                //       {player.username == username ? (
                //         <Text>y {player.username}</Text>
                //       ) : (
                //         <Text>g {player.controller?.username}</Text>
                //       )}
                //     </View>
                //     <Text>{player.points}</Text>
                //   </Pressable>

                // </Pressable>
                <PlayerInfo
                  key={index}
                  player={player}
                  callDebuff={callDebuff}
                />
              );
            })}
      </View>
    );
  };

  const MainActionBar = () => {
    const { answer, nextQuestion, thirdQuestion, socket, roomID } = PowerParams;

    const params = {
      level,
      func: () => ActionDispatch({ type: "USE_POWER" }),
    };

    const Superparams = {
      answer,
      nextQuestion,
      thirdQuestion,
      socket,
      roomID,
      // func: (lives:number, powerbars:number) => ActionDispatch({ type: "USE_ULTIMATE", payload:{lives:lives,powerBars:powerbars}}),
      func: (name: string) =>
        ActionDispatch({ type: "USE_ULTIMATE", payload: { name } }),
    };

    return (
      <View>
        {userTrayOpen && <ActionTray />}
        <View>
          <View className=" flex flex-row justify-between items-center border border-blue-600 px-4 py-4 rounded-xl bg-white">
            <View className="flex flex-row items-center gap-x-2">
              <Entypo name="heart" size={24} color="red" />
              <Text className="text-lg font-medium">{lives}</Text>
            </View>

            {/* // eslint-disable-next-line react-hooks/rules-of-hooks */}
            <Pressable
              className="flex flex-row gap-x-2 items-center"
              onPress={() => callPowers(params)}
            >
              <Entypo name="eye" size={24} color="black" />
              <Text className="text-lg font-medium">{powerBars}</Text>
            </Pressable>

            <Pressable
              className="flex flex-row gap-x-2 items-center"
              // onClick={() => callUltimate()}
            >
              <Entypo name="star" size={24} color="gold" />
              <Text className="text-lg font-medium">{ultimateBars}</Text>
            </Pressable>

            <Pressable
              className="flex flex-row gap-x-2 items-center"
              onPress={() => handleTray()}
            >
              <FontAwesome5 name="user-friends" size={24} color="blue" />
              <Text className="text-lg font-medium">
                {OtherPlayers?.length}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  // *SET UI DISPLAY VALUES FROM CURRENT PLAYER
  useEffect(() => {
    ActionDispatch({
      type: "INIT",
      payload: {
        CurrentPlayer,
      },
    });
  }, []);

  useEffect(() => {
    socket?.on("POWER_USED", (res: character) => {
      CurrentPlayer.Debuff("crushed");
      ActionDispatch({ type: "DEBUFF", payload: { name: res } });
    });
  }, [socket]);

  // *LISTEN TO DEBUFF EVENTS AND POWERS
  // TODO MOVE INTO CHOICELIST COMPONENT
  // TODO ADD MORE DEBUFFS HERE
  // !DEBUFF LISTENER WAS HERE

  return (
    <View style={{ position: "absolute", bottom: 30, left: 10, right: 10 }}>
      <MainActionBar />
    </View>
  );
};

export default ActionBar;

// !BACKUP FUNCTION
// useEffect(() => {
//   socket?.on(
//     "DEBUFF_USED",
//     (res: {
//       debuff: Debuffs;
//       target_name: string;
//       room_id: string;
//       sender: string;
//     }) => {
//       GET TARGET NAME , TYPE OF DEBUFF AND SENDER FROM RESPONSE
//       const { debuff, target_name, sender } = res;
//       console.log(debuff);
//       console.log(username);

//       APPLY DEBUFF IF TARGERT USERNAME EQUALS TARGET
//       if (username == target_name) {
//         console.log("This you buddy", target_name);
//         @ts-ignore
//         ActionDispatch({
//           type: "DEBUFF",
//           payload: {
//             debuff,
//             sender,
//           },
//         });

//         APPLY DEBUFF
//         setconfused(true);
//         setStatusEffects("brainstorming");
//       }
//     }
//   );
// }, [socket]);
