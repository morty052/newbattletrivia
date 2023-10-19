import { Text, Pressable } from "react-native";
import React from "react";
import { button, buttonText } from "../../styles/primary";

type Props = {
  title: string;
  onPress: () => void;
  styles?: any;
};

const Button = ({ title, onPress, styles }: Props) => {
  return (
    <Pressable style={[button, styles]} onPress={onPress}>
      <Text style={buttonText}>{title}</Text>
    </Pressable>
  );
};

export default Button;
