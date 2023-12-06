import { Pressable, View, Text, Image } from "react-native";

export function OptionPicker({
  open,
  setOpen,
  setIndex,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <View className="absolute bottom-2 inset-x-0 px-2 space-y-4">
      {/* {!open && (
        <Pressable
          onPress={() => setOpen(!open)}
          className="rounded-full h-10 w-10 bg-white self-end flex items-center justify-center pt-1.5"
        >
          <Text className="text-3xl">^</Text>
        </Pressable>
      )} */}

      <View className="border flex flex-row  justify-between border-white py-2 px-4  rounded-3xl ">
        <Pressable onPress={() => setIndex(0)}>
          <Image
            className="h-16 w-16 rounded-full"
            source={{
              uri: "https://img.freepik.com/free-psd/realistic-3d-emoji-with-happyface-glasses_125540-2828.jpg?w=900&t=st=1699792433~exp=1699793033~hmac=09ce034141fbf3afe4cec04eed33512431dba38941e6001b5d8c354fa6f12c64",
            }}
          />
        </Pressable>
        <Pressable onPress={() => setIndex(1)}>
          <Image
            className="h-16 w-16 rounded-full"
            source={{
              uri: "https://img.freepik.com/free-psd/3d-rendering-bear-emoji-icon_23-2150339737.jpg?w=740&t=st=1699792589~exp=1699793189~hmac=c70344e38f0426e15239811b9feedd2a8952ed41ad626c1d9612a33805342c84",
            }}
          />
        </Pressable>
        <Pressable onPress={() => setIndex(2)}>
          <Image
            className="h-16 w-16 rounded-full"
            source={{
              uri: "https://img.freepik.com/free-psd/3d-rendering-gps-travel-icon_23-2149389115.jpg?w=740&t=st=1699792666~exp=1699793266~hmac=806444008062a385bdbb7890eaf24785d6bdbf724fbf24252f70d85be6f4b7e2",
            }}
          />
        </Pressable>
        <Pressable onPress={() => setIndex(3)}>
          <Image
            className="h-16 w-16 rounded-full"
            source={{
              uri: "https://img.freepik.com/free-psd/3d-winter-icon-with-teapot_23-2150819504.jpg?w=740&t=st=1699792719~exp=1699793319~hmac=087171b1bd915c0a4c6ba7e92e50dd18fe299ecf6318ca3a9d72ef614b2cb2f6",
            }}
          />
        </Pressable>
      </View>
    </View>
  );
}
