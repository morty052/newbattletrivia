import { TextInput, View, Text, Pressable, Image } from "react-native";
import { useEffect, useReducer, useState } from "react";
import { Screen } from "../../../../components";
import { AnswerBar } from "../answerbar";
import { PlayerBar } from "../playerbar";
import { playerClass } from "../../features/setPlayer";
import { Mic } from "../../../../components";

const AnimalScreen = ({
  handleSubmit,
}: {
  handleSubmit: (id: string, name: string) => void;
}) => {
  const [animal, setAnimal] = useState("");
  const [listening, setListening] = useState(false);
  const id = "animal";
  return (
    <View className="flex justify-center space-y-8 h-4/5 px-4 pb-10">
      <Text className="text-white text-5xl text-center ">Animal</Text>
      {!listening ? (
        <TextInput
          onChangeText={(e) => setAnimal(e)}
          placeholder="Name"
          className="w-full border border-white py-2 rounded-lg bg-white text-center text-2xl  "
        />
      ) : (
        <View className="w-full border border-white py-2 rounded-lg bg-white   ">
          <Text className="text-gray-800 text-5xl text-center">{animal}</Text>
        </View>
      )}
      {/* Submit Button */}
      {animal.length > 2 && (
        <Pressable
          onPress={() => handleSubmit(id, animal)}
          className="bg-yellow-200 rounded-lg py-2"
        >
          <Text className="text-xl text-center text-gray-800">Submit</Text>
        </Pressable>
      )}

      {/* MIC AND KEYBOARD */}
      <View className="w-full flex flex-row items-center justify-between ">
        <Mic
          listening={listening}
          setListening={setListening}
          results={animal}
          setResults={(e) => setAnimal(e)}
        />
        <Pressable onPress={() => setListening(false)}>
          <Image
            className="h-20 w-20 rounded-full"
            source={{
              uri: "https://img.freepik.com/free-psd/kawaii-3d-object-icon_23-2150565740.jpg?w=740&t=st=1700391301~exp=1700391901~hmac=d30ef6be88ef9d8df913b9c170ae86da2252301b2948b76b8b2f52f894c06ec7",
            }}
          />
        </Pressable>
      </View>
    </View>
  );
};

const PlaceScreen = ({
  handleSubmit,
}: {
  handleSubmit: (id: string, name: string) => void;
}) => {
  const [place, setPlace] = useState("");
  const [listening, setListening] = useState(false);
  const id = "place";
  return (
    <View className="flex justify-center space-y-8 h-4/5 px-4 pb-10">
      <Text className="text-white text-5xl text-center ">Place</Text>
      {!listening ? (
        <TextInput
          onChangeText={(e) => setPlace(e)}
          placeholder="Name"
          className="w-full border border-white py-2 rounded-lg bg-white text-center text-2xl  "
        />
      ) : (
        <View className="w-full border border-white py-2 rounded-lg bg-white   ">
          <Text className="text-gray-800 text-5xl text-center">{place}</Text>
        </View>
      )}
      {/* Submit Button */}
      {place.length > 2 && (
        <Pressable
          onPress={() => handleSubmit(id, place)}
          className="bg-yellow-200 rounded-lg py-2"
        >
          <Text className="text-xl text-center text-gray-800">Submit</Text>
        </Pressable>
      )}

      {/* MIC AND KEYBOARD */}
      <View className="w-full flex flex-row items-center justify-between ">
        <Mic
          listening={listening}
          setListening={setListening}
          results={place}
          setResults={(e) => setPlace(e)}
        />
        <Pressable onPress={() => setListening(false)}>
          <Image
            className="h-20 w-20 rounded-full"
            source={{
              uri: "https://img.freepik.com/free-psd/kawaii-3d-object-icon_23-2150565740.jpg?w=740&t=st=1700391301~exp=1700391901~hmac=d30ef6be88ef9d8df913b9c170ae86da2252301b2948b76b8b2f52f894c06ec7",
            }}
          />
        </Pressable>
      </View>
    </View>
  );
};

const ThingScreen = ({
  handleSubmit,
}: {
  handleSubmit: (id: string, name: string) => void;
}) => {
  const [thing, setThing] = useState("");
  const [listening, setListening] = useState(false);
  const id = "thing";
  return (
    <View className="flex justify-center space-y-8 h-4/5 px-4 pb-10">
      <Text className="text-white text-5xl text-center ">Thing</Text>
      {!listening ? (
        <TextInput
          onChangeText={(e) => setThing(e)}
          placeholder="Name"
          className="w-full border border-white py-2 rounded-lg bg-white text-center text-2xl  "
        />
      ) : (
        <View className="w-full border border-white py-2 rounded-lg bg-white   ">
          <Text className="text-gray-800 text-5xl text-center">{thing}</Text>
        </View>
      )}
      {/* Submit Button */}
      {thing.length > 2 && (
        <Pressable
          onPress={() => handleSubmit(id, thing)}
          className="bg-yellow-200 rounded-lg py-2"
        >
          <Text className="text-xl text-center text-gray-800">Submit</Text>
        </Pressable>
      )}

      {/* MIC AND KEYBOARD */}
      <View className="w-full flex flex-row items-center justify-between ">
        <Mic
          listening={listening}
          setListening={setListening}
          results={thing}
          setResults={(e) => setThing(e)}
        />
        <Pressable onPress={() => setListening(false)}>
          <Image
            className="h-20 w-20 rounded-full"
            source={{
              uri: "https://img.freepik.com/free-psd/kawaii-3d-object-icon_23-2150565740.jpg?w=740&t=st=1700391301~exp=1700391901~hmac=d30ef6be88ef9d8df913b9c170ae86da2252301b2948b76b8b2f52f894c06ec7",
            }}
          />
        </Pressable>
      </View>
    </View>
  );
};

// const NameScreen = ({
//   handleSubmit,
// }: {
//   handleSubmit: (id: string, name: string) => void;
// }) => {
//   const [name, setName] = useState("");
//   const id = "name";
//   return (
//     <View className=" flex justify-center space-y-8 h-4/5 px-4 pb-10 relative ">
//       <Text className="text-white text-5xl text-center ">Name</Text>
//       <TextInput
//         onChangeText={(e) => setName(e)}
//         placeholder="Name"
//         className="w-full border border-white py-2 rounded-lg bg-white text-center text-2xl  "
//       />

//       {/* Submit Button */}
//       <Pressable
//         onPress={() => handleSubmit(id, name)}
//         className="bg-yellow-200 rounded-lg py-2"
//       >
//         <Text className="text-xl text-center text-gray-800">Submit</Text>
//       </Pressable>

//       <View className="w-full  flex-col items-center   absolute bottom-0">
//         <Mic setTranscription={setName} />
//       </View>
//     </View>
//   );
// };

const NameScreen = ({
  handleSubmit,
}: {
  handleSubmit: (id: string, name: string) => void;
}) => {
  const [name, setName] = useState("");
  const [listening, setListening] = useState(false);
  const id = "name";
  return (
    <View className=" flex justify-center space-y-6 h-4/5 px-4 pb-10 relative ">
      <Text className="text-white text-5xl text-center ">Name</Text>
      {!listening ? (
        <TextInput
          onChangeText={(e) => setName(e)}
          placeholder="Name"
          className="w-full border border-white py-2 rounded-lg bg-white text-center text-2xl  "
        />
      ) : (
        <View className="w-full border border-white py-2 rounded-lg bg-white   ">
          <Text className="text-gray-800 text-5xl text-center">{name}</Text>
        </View>
      )}

      {/* Submit Button */}
      {name.length > 2 && (
        <Pressable
          onPress={() => handleSubmit(id, name)}
          className="bg-yellow-200 rounded-lg py-2"
        >
          <Text className="text-xl text-center text-gray-800">Submit</Text>
        </Pressable>
      )}

      {/* MIC AND KEYBOARD */}
      <View className="w-full flex flex-row items-center justify-between ">
        <Mic
          listening={listening}
          setListening={setListening}
          results={name}
          setResults={(e) => setName(e)}
        />
        <Pressable onPress={() => setListening(false)}>
          <Image
            className="h-20 w-20 rounded-full"
            source={{
              uri: "https://img.freepik.com/free-psd/kawaii-3d-object-icon_23-2150565740.jpg?w=740&t=st=1700391301~exp=1700391901~hmac=d30ef6be88ef9d8df913b9c170ae86da2252301b2948b76b8b2f52f894c06ec7",
            }}
          />
        </Pressable>
      </View>
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
  tallying,
  currentPlayer,
}: {
  index: number;
  setIndex: any;
  handleFinish: (answer: any) => void;
  tallying: boolean;
  currentPlayer: playerClass;
}) {
  const [answer, setAnswer] = useState({
    name: "",
    animal: "",
    place: "",
    thing: "",
  });
  // const [tallying, setTallying] = useState(false);
  const [contesting, setContesting] = useState(false);
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
      handleFinish(answer);
      currentPlayer.populateChoices(answer);
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
              <PlayerBar
                contesting={contesting}
                setContesting={setContesting}
              />

              {contesting && (
                <>
                  <AnswerBar title={name} label="Name" />
                  <AnswerBar title={animal} label="Animal" />
                  <AnswerBar title={place} label="Place" />
                  <AnswerBar title={thing} label="Thing" />
                </>
              )}
            </View>
          </>
        )}
      </>
    </View>
  );
}
