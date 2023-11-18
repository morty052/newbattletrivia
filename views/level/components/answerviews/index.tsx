import { TextInput, View, Text, Pressable } from "react-native";
import { useEffect, useReducer, useState } from "react";
import { Screen } from "../../../../components";

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

type labelNames = "Name" | "Animal" | "Place" | "Thing";

const Answer = ({ title, label }: { title: string; label: labelNames }) => {
  let query = "";
  let baseUrl = "";

  async function handleContest(answer: string, label: labelNames) {
    const queryLabel = label.toLowerCase();
    const query = `check${queryLabel}?${queryLabel}=${answer}`;
    const baseUrl = `http://192.168.100.16:3000/ai/${query}`;

    try {
      console.log("this is label", label);
      console.log("this is url", baseUrl);
      const response = await fetch(baseUrl);
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Pressable
      onPress={() => handleContest(title, label)}
      className="flex flex-row justify-between my-6"
    >
      <Text className="text-white text-4xl font-semibold text-center ">
        {label}
      </Text>
      <Text className="text-white text-4xl font-semibold text-center ">
        {title}
      </Text>
    </Pressable>
  );
};

export function AnswerView({
  index,
  setIndex,
  handleFinish,
}: {
  index: number;
  setIndex: any;
  handleFinish: () => void;
}) {
  const [answer, setAnswer] = useState({
    name: "",
    animal: "",
    place: "",
    thing: "",
  });
  const [tallying, setTallying] = useState(false);
  // const [index, setIndex] = useState(0);

  const emptyAnswers = Object.values(answer).filter((value) => value == "");
  const { name, animal, place, thing } = answer;

  function handleSubmit(id: string, choice: string) {
    setAnswer((prev) => ({
      ...prev,
      [id]: choice,
    }));

    if (index === 3) {
      setIndex(0);
      return;
    }

    setIndex((prev: number) => prev + 1);
  }

  useEffect(() => {
    if (emptyAnswers.length > 0) {
      return;
    }

    if (emptyAnswers.length === 0) {
      // handleFinish();
      setTallying(true);
      // setAnswer({
      //   name: "",
      //   animal: "",
      //   place: "",
      //   thing: "",
      // });
      return;
    }
  }, [answer]);

  const indexes: any = {
    0: <NameScreen handleSubmit={(id, answer) => handleSubmit(id, answer)} />,
    1: <AnimalScreen handleSubmit={(id, answer) => handleSubmit(id, answer)} />,
    2: <PlaceScreen handleSubmit={(id, answer) => handleSubmit(id, answer)} />,
    3: <ThingScreen handleSubmit={(id, answer) => handleSubmit(id, answer)} />,
  };

  return (
    <View>
      <>
        {!tallying ? (
          <View>{indexes[index]}</View>
        ) : (
          <>
            <View className="space-y-8 px-2 pt-12">
              <View className="flex flex-row items-center justify-between border rounded-lg p-2">
                <View className="flex flex-row flex-1">
                  <View className="h-5 w-5 rounded-full border mr-2"></View>
                  <Text className="text-white  text-center ">Contest</Text>
                </View>

                <View className="flex flex-row  justify-between  w-2/5">
                  <Text className="text-white  text-center ">Player name</Text>
                  <Text className="text-white  text-center ">Score</Text>
                </View>
              </View>
              <Answer title={name} label="Name" />
              <Answer title={animal} label="Animal" />
              <Answer title={place} label="Place" />
              <Answer title={thing} label="Thing" />
            </View>
          </>
        )}
      </>
    </View>
  );
}
