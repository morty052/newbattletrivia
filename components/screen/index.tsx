import { View, Text } from "react-native";
import React from "react";

type Props = {
  children?: React.ReactNode;
};

export const Screen = ({ children }: Props) => {
  return <View className="flex-1 bg-blue-400 px-2 pt-12">{children}</View>;
};
