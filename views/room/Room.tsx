import { useUser } from "@clerk/clerk-react";
// import { Link, Route, Routes, useParams } from "react-router-dom";
import { All_Categories } from "../../constants";
import { useSocketcontext } from "../../hooks/useSocketContext";
// import { Lobby, OnlineFriends } from "";
import { Button, View, Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Lobby from "../../lobby/Lobby";

const RoomStack = createNativeStackNavigator();

function TopicSwitcher({
  navigation,
  setswitchingCategory,
}: {
  setswitchingCategory: (bool: boolean) => void;
  navigation: any;
}) {
  const { socket } = useSocketcontext();
  const { room_id }: { room_id: string } = [];

  function handleSwitch(category: string) {
    socket?.emit("SET_CATEGORY", { category, room_id }, (res: string) => {
      console.log(res);
      setswitchingCategory(false);
    });
  }

  return (
    // <View className="flex h-3/4 flex-col gap-y-6 overflow-scroll px-2 pt-8">
    <View>
      {All_Categories.map((category, index) => (
        // <button
        //   className="inline-flex justify-center rounded-2xl border border-white p-2 text-white shadow shadow-white"
        //   onClick={() => handleSwitch(category.id)}
        //   key={index}
        // >
        //   <span className="font-medium">{category.name}</span>
        // </button>
        <Button
          // className="inline-flex justify-center rounded-2xl border border-white p-2 text-white shadow shadow-white"
          onPress={() => handleSwitch(category.id)}
          title={category.name}
          key={index}
        />
      ))}
    </View>
  );
}

function Room() {
  const { isLoaded } = useUser();
  const { room_id } = useParams();
  const { socket } = useSocketcontext();

  if (!isLoaded) {
    return <Text>....loading</Text>;
  }

  function handleGameStart() {
    console.log("clicked");
    socket?.emit(
      "LAUNCH_ROOM",
      { room_id },
      (res: { category: string; room_id: string; players: player[] }) => {
        console.log(res);
        const { category, room_id, players } = res;

        // TODO: HANDLE NAVIGATION
        console.table([category, room_id, players]);
        // window.location.assign(`/level/${room_id}/${category}`)
      }
    );
  }

  // ?CREATE ROOM ON INITIAL LOAD ?

  return (
    <>
      {/* <View className="min-h-screen bg-gradient-to-b  from-purple-900 to-gray-700"> */}
      <View>
        {/* BACK BUTTON */}
        {/* <View className="fixed left-1 top-1 flex items-center gap-x-2 text-white"> */}
        <View>
          <Text>Exit</Text>
        </View>

        {/* CONTAINER */}
        {/* <View className="px-2 pt-14"> */}
        <View>
          {/*LINKS  */}
          {/* <View className="flex gap-x-4 px-2"> */}
          <View>
            <Button
              title="Category"
              // className="inline-flex w-28 justify-center rounded-2xl border border-white p-2 text-white shadow shadow-white"
              onPress={() => "category"}
            />
            <Button
              title="Player"
              // className="inline-flex w-28 justify-center rounded-2xl border border-white p-2 text-white shadow shadow-white"
              // to={"players"}
            />
            <Button
              // to={`/lobby/${room_id}`}
              title="Lobby"
            />
          </View>

          {/* ROUTES */}
          <RoomStack.Navigator>
            <RoomStack.Screen name="Lobby" component={Lobby} />
            <RoomStack.Screen name="Players" component={Lobby} />
          </RoomStack.Navigator>
          {/* <Routes>
            <Route path="/" element={<Lobby />} />
            <Route path="/lobby" element={<TopicSwitcher />} />
            <Route path="/players" element={<OnlineFriends />} />
          </Routes> */}

          {/* START GAME BUTTON */}
        </View>
      </View>
      <View
        onClick={() => handleGameStart()}
        className="absolute inset-x-0 bottom-4 flex justify-center "
      >
        <button
          type="button"
          onClick={() => handleGameStart()}
          className="z-10 inline-flex w-full max-w-md justify-center rounded-2xl border border-white p-2  shadow shadow-white"
        >
          <span className="text-white">Start Game</span>
        </button>
      </View>
    </>
  );
}

export default Room;
