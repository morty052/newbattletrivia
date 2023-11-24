import { Pressable, View, Text, ScrollView, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import { Mic } from "../../../../components";

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

function LetterSelectScreen({
  handleFinish,
}: {
  handleFinish: (letter: string) => void;
}) {
  const [listening, setListening] = useState(false);
  const [result, setResult] = useState("");

  return (
    <View className="flex flex-1 justify-center flex-col items-center  mt-14">
      <Text className="text-white text-2xl ">Select a letter</Text>
      <ScrollView horizontal>
        {alphabet.map((letter) => (
          <View
            className="flex flex-row justify-center items-center  "
            key={letter}
          >
            <Pressable
              onPress={() => handleFinish(letter)}
              className="bg-yellow-200 rounded-lg py-2 px-4 mt-2 w-20 h-20 flex justify-center items-center mx-6"
            >
              <Text className="text-xl text-center text-gray-800">
                {letter}
              </Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function WaitingView({
  setFinished,
}: {
  setFinished: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <View className="flex flex-1 justify-center flex-col items-center">
      <Text className="text-white text-2xl ">Waiting for next player</Text>
      <Pressable
        onPress={() => setFinished(false)}
        className="bg-yellow-200 rounded-lg py-2 px-4 mt-2 w-full"
      >
        <Text className="text-xl text-center text-gray-800">Next</Text>
      </Pressable>
    </View>
  );
}

export function WaitScreen({
  userId,
  turnId,
  selectingLetter,
  handleLetterSelect,
}: {
  userId: number | null;
  turnId: number;
  selectingLetter: boolean;
  handleLetterSelect: (letter: string) => void;
}) {
  const [finished, setFinished] = useState(false);

  return (
    <>
      {selectingLetter && userId == turnId && (
        <LetterSelectScreen
          handleFinish={(letter) => handleLetterSelect(letter)}
        />
      )}

      {selectingLetter && userId != turnId && (
        <WaitingView setFinished={setFinished} />
      )}
    </>
  );
}