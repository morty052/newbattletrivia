import { useNavigation } from "@react-navigation/native";
import { save, getValueFor, deleteKey } from "../../lib/secure-store";

import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  TextInput,
  Pressable,
} from "react-native";

import Voice, {
  SpeechRecognizedEvent,
  SpeechResultsEvent,
  SpeechErrorEvent,
} from "@react-native-voice/voice";
import { AnswerView } from "../../views/level/components";
import { Button } from "../shared";

export function Mic({
  results,
  setResults,
  listening,
  setListening,
}: {
  listening: boolean;
  setListening: (value: boolean) => void;
  setResults: (text: string) => void;
  results: string;
}) {
  const [recognized, setRecognized] = useState("");
  const [volume, setVolume] = useState("");
  const [error, setError] = useState("");
  const [end, setEnd] = useState("");
  const [started, setStarted] = useState("");
  //   const [results, setResults] = useState([]);
  const [partialResults, setPartialResults] = useState([]);

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    // Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStart = (e: any) => {
    console.log("onSpeechStart: ", e);
    setStarted("√");
  };

  const onSpeechRecognized = (e: SpeechRecognizedEvent) => {
    console.log("onSpeechRecognized: ", e);
    setRecognized("√");
  };

  const onSpeechEnd = (e: any) => {
    console.log("onSpeechEnd: ", e);
    setEnd("√");
  };

  const onSpeechError = (e: SpeechErrorEvent) => {
    console.log("onSpeechError: ", e);
    setError(JSON.stringify(e.error));
  };

  const onSpeechResults = (e: SpeechResultsEvent) => {
    console.log("onSpeechResults: ", e);
    setResults(e?.value?.[0]);
    // setTranscription(e.value);
  };

  const onSpeechPartialResults = (e: SpeechResultsEvent) => {
    console.log("onSpeechPartialResults: ", e);
    setPartialResults(e.value);
  };

  //   const onSpeechVolumeChanged = (e: any) => {
  //     console.log("onSpeechVolumeChanged: ", e);
  //     setVolume(e.value);
  //   };

  const _startRecognizing = async () => {
    setListening(true);
    _clearState();
    try {
      await Voice.start("en-US");
      console.log("called start");
    } catch (e) {
      console.error(e);
    }
  };

  const _destroyRecognizer = async () => {
    try {
      await Voice.destroy();
    } catch (e) {
      console.error(e);
    }
    _clearState();
  };

  const _stopRecognizing = async () => {
    // setListening(false);
    try {
      await Voice.stop();
      //   _destroyRecognizer();
    } catch (e) {
      console.error(e);
    }
  };

  const _cancelRecognizing = async () => {
    try {
      await Voice.cancel();
    } catch (e) {
      console.error(e);
    }
  };

  const _clearState = () => {
    setRecognized("");
    setVolume("");
    setError("");
    setEnd("");
    setStarted("");
    setResults([]);
    setPartialResults([]);
  };

  return (
    <View className="px-2">
      {/* {listening && (
        <Text className="text-red-500 text-2xl font-semibold my-6">
          Listening
        </Text>
      )}
      {results?.length > 0 && <Text style={styles.stat}>{results[0]}</Text>} */}
      <TouchableHighlight
        onPressIn={_startRecognizing}
        onPressOut={_stopRecognizing}
      >
        <Image
          className="h-20 w-20 rounded-full"
          source={{
            uri: "https://img.freepik.com/free-psd/kawaii-3d-object-icon_23-2150565770.jpg?size=626&ext=jpg&ga=GA1.1.907105722.1700386478&semt=ais",
          }}
        />
      </TouchableHighlight>
    </View>
  );
}

const NameScreen = ({
  handleSubmit,
}: {
  handleSubmit: (id: string, name: string) => void;
}) => {
  const [name, setName] = useState("");
  const [listening, setListening] = useState(false);
  const id = "name";

  const res = { room_id: "", status: "", seeker_id: "", match_id: "" };

  async function saveRoom() {
    // await save("currentRoom", JSON.stringify(res));
    const room = await getValueFor("currentRoom");
    console.log(room);
    // await deleteKey("currentRoom");
  }

  return (
    <View className=" flex justify-center space-y-6 h-4/5 px-4 pb-10 relative ">
      <Text className="text-white text-5xl text-center ">Name</Text>
      <Button title="test" onPress={saveRoom} />
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

export function RecordingScreen({ answer }: { answer: string }) {
  return (
    <NameScreen
      handleSubmit={(id, answer) => {
        console.log(id, answer);
      }}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    width: 80,
    height: 80,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  action: {
    textAlign: "center",
    color: "#0000FF",
    marginVertical: 5,
    fontWeight: "bold",
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5,
  },
  stat: {
    textAlign: "center",
    color: "#B0171F",
    marginBottom: 1,
  },
});
