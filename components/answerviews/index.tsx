import { TextInput, View, Text, Pressable } from "react-native";
import { useEffect, useReducer, useState } from "react";

const state = {
  name: true,
  animal: false,
  place: false,
  thing: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, animal: true };

    default:
      return { ...state };
  }
};

const AnimalScreen = ({
  handleSubmit,
}: {
  handleSubmit: (id: string, name: string) => void;
}) => {
  const [animal, setAnimal] = useState("");
  const id = "animal";
  return (
    <View className="flex justify-center space-y-8 h-4/5 px-4 pb-10">
      <Text className="text-white text-5xl text-center ">Animal</Text>
      <TextInput
        onChangeText={(e) => setAnimal(e)}
        placeholder="Animal"
        className="w-full border border-white py-2 rounded-lg bg-white text-center text-2xl  "
      />
      <Pressable
        onPress={() => handleSubmit(id, animal)}
        className="bg-yellow-200 rounded-lg py-2"
      >
        <Text className="text-xl text-center text-gray-800">Submit</Text>
      </Pressable>
    </View>
  );
};

const PlaceScreen = ({
  handleSubmit,
}: {
  handleSubmit: (id: string, name: string) => void;
}) => {
  const [place, setPlace] = useState("");
  const id = "place";
  return (
    <View className="flex justify-center space-y-8 h-4/5 px-4 pb-10">
      <Text className="text-white text-5xl text-center ">Place</Text>
      <TextInput
        onChangeText={(e) => setPlace(e)}
        placeholder="Place"
        className="w-full border border-white py-2 rounded-lg bg-white text-center text-2xl  "
      />
      <Pressable
        onPress={() => handleSubmit(id, place)}
        className="bg-yellow-200 rounded-lg py-2"
      >
        <Text className="text-xl text-center text-gray-800">Submit</Text>
      </Pressable>
    </View>
  );
};

const ThingScreen = ({
  handleSubmit,
}: {
  handleSubmit: (id: string, name: string) => void;
}) => {
  const [thing, setThing] = useState("");
  const id = "thing";
  return (
    <View className="flex justify-center space-y-8 h-4/5 px-4 pb-10">
      <Text className="text-white text-5xl text-center ">Thing</Text>
      <TextInput
        onChangeText={(e) => setThing(e)}
        placeholder="Thing"
        className="w-full border border-white py-2 rounded-lg bg-white text-center text-2xl  "
      />
      <Pressable
        onPress={() => handleSubmit(id, thing)}
        className="bg-yellow-200 rounded-lg py-2"
      >
        <Text className="text-xl text-center text-gray-800">Submit</Text>
      </Pressable>
    </View>
  );
};

const NameScreen = ({
  handleSubmit,
}: {
  handleSubmit: (id: string, name: string) => void;
}) => {
  const [name, setName] = useState("");
  const id = "name";
  return (
    <View className=" flex justify-center space-y-8 h-4/5 px-4 pb-10">
      <Text className="text-white text-5xl text-center ">Name</Text>
      <TextInput
        onChangeText={(e) => setName(e)}
        placeholder="Name"
        className="w-full border border-white py-2 rounded-lg bg-white text-center text-2xl  "
      />

      {/* Submit Button */}
      <Pressable
        onPress={() => handleSubmit(id, name)}
        className="bg-yellow-200 rounded-lg py-2"
      >
        <Text className="text-xl text-center text-gray-800">Submit</Text>
      </Pressable>
    </View>
  );
};

export function AnswerView({
  index,
  setIndex,
  setFinished,
  finished,
}: {
  index: number;
  setIndex: any;
  setFinished: (finished: boolean) => void;
  finished: boolean;
}) {
  const [answer, setAnswer] = useState({
    name: "",
    animal: "",
    place: "",
    thing: "",
  });
  //   const [index, setIndex] = useState(0);
  const [answerState, dispatch] = useReducer(reducer, state);
  const { name, animal, place, thing } = answerState;

  const emptyAnswers = Object.values(answer).filter((value) => value == "");

  function handleSubmit(id: string, choice: string) {
    setAnswer((prev) => ({
      ...prev,
      [id]: choice,
    }));

    if (index === 3) {
      setIndex(0);
      return;
    }

    setIndex((prev) => prev + 1);
  }

  useEffect(() => {
    if (emptyAnswers.length > 0) {
      console.log("empty answers", emptyAnswers);
      return;
    }

    if (emptyAnswers.length === 0) {
      console.log("no empty answers");
      setFinished(true);
      return;
    }
  }, [answer]);

  const indexes: any = {
    0: <NameScreen handleSubmit={(id, answer) => handleSubmit(id, answer)} />,
    1: <AnimalScreen handleSubmit={(id, answer) => handleSubmit(id, answer)} />,
    2: <PlaceScreen handleSubmit={(id, answer) => handleSubmit(id, answer)} />,
    3: <ThingScreen handleSubmit={(id, answer) => handleSubmit(id, answer)} />,
  };

  return <>{!finished && <View>{indexes[index]}</View>}</>;
}
