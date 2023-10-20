import { Pressable, View, Text, StyleSheet } from "react-native";
import { TstatusTypes } from "./ChoiceList";
import { button, buttonText } from "../../../styles/primary";
import useSound from "../../../hooks/useSound";
import wrongChoice from "../../../assets/wrongcode.mp3";
import correctChoice from "../../../assets/coreectanswer.mp3";

type Props = {
  text: string;
  func: () => void;
  statusEffects?: TstatusTypes | null;
  correct_answer?: string;
  revealed: boolean;
};

const Choice = ({
  text,
  func,
  statusEffects,
  correct_answer,
  revealed,
}: Props) => {
  const { play: wrongChoiceSound } = useSound(wrongChoice);
  const { play: successSound } = useSound(correctChoice);

  return (
    <View style={button}>
      <Pressable
        // className={`w-full rounded-xl border px-4 py-2 ${
        //   statusEffects && "bg-black text-black"
        // }`}
        onPress={() => {
          if (text !== correct_answer) {
            wrongChoiceSound();
          }
          if (text == correct_answer) {
            successSound();
          }
          func();
        }}
      >
        <Text>{text}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 25,
    fontWeight: "600",
    color: "white",
  },
  revealed: {
    fontSize: 25,
    fontWeight: "600",
    color: "white",
    backgroundColor: "red",
  },
});

export default Choice;
