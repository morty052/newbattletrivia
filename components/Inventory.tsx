import { View, Text, Pressable } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";

type Props = {};

function InventoryItem({
  amount,
  children,
}: {
  amount: number;
  children: React.ReactNode;
}) {
  return (
    <Pressable className="bg-black/40 flex flex-row items-center  w-28 px-2 py-1.5 relative rounded-xl ">
      <View className="flex flex-row items-center justify-between w-3/4 pr-1">
        {children}
        <Text className="text-gray-50 text-xl font-bold">{amount}</Text>
      </View>
      <View className="bg-black absolute right-0 rounded-tr-xl rounded-br-xl top-0 bottom-0  w-6    flex justify-center items-center p-1">
        <FontAwesome name="plus" size={15} color="white" />
      </View>
    </Pressable>
  );
}

const Inventory = (props: Props) => {
  return (
    <View className="  flex mt-2  mb-4">
      <View className="w-full flex flex-row justify-between ">
        <InventoryItem amount={1}>
          <FontAwesome name="viacoin" size={25} color="lime" />
        </InventoryItem>
        <InventoryItem amount={1}>
          <FontAwesome name="ticket" size={25} color="red" />
        </InventoryItem>
        <InventoryItem amount={1}>
          <FontAwesome5 name="medal" size={24} color="gold" />
        </InventoryItem>
      </View>
    </View>
  );
};

export default Inventory;
