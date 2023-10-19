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
    <Pressable className="bg-white flex flex-row items-center w-20 px-4 py-2 justify-between rounded-xl ">
      {children}
      <Text className="text-lime-600 font-medium">{amount}</Text>
    </Pressable>
  );
}

const Inventory = (props: Props) => {
  return (
    <View className="bg-black/10  py-8 px-2 flex rounded-xl mt-4">
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
