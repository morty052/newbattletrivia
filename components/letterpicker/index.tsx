import { Pressable, ScrollView, Text } from "react-native";
import Animated, { FadeInLeft, FadeOutRight } from "react-native-reanimated";

const alphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

export function LetterPicker({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <>
      {open && (
        <Animated.View
          entering={FadeInLeft}
          exiting={FadeOutRight}
          className="bg-white/90 z-10 absolute  space-y-2 pt-4 right-4 top-10  h-[80%]  w-20 rounded-3xl flex flex-col"
        >
          <ScrollView className="space-y-4">
            {alphabet.map((letter) => (
              <Text key={letter} className="text-center font-bold text-lg">
                {letter}
              </Text>
            ))}
          </ScrollView>
          <Pressable
            className="bg-red-400 rounded-b-3xl py-2"
            onPress={() => setOpen(!open)}
          >
            <Text className="text-center font-bold text-lg">x</Text>
          </Pressable>
        </Animated.View>
      )}
    </>
  );
}
