import { View, Text, TextInput, Pressable } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

const SignUp = () => {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  const { isLoaded, signUp, setActive } = useSignUp();
  const navigation = useNavigation();

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        emailAddress,
        password,
        username,
      });

      await fetch("https://snapdragon-cerulean-pulsar.glitch.me/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: `{
          "email": "${emailAddress}",
          "password": "${password}",
          "username": "${username}"
        }`,
      });

      navigation.navigate("Home");

      // send the email.
      // await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // await signUp.

      // change the UI to our pending section.
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };
  return (
    <View className="py-4 px-2 bg-gray-700 h-screen ">
      <View className=" px-2 py-8 flex ">
        <Text className="text-2xl font-semibold text-gray-50">
          Create a new account
        </Text>
        <View className=" mt-4 ">
          <TextInput
            onChangeText={(text) => setEmailAddress(text)}
            className="border-b border-gray-50 p-2 w-full my-6 "
            placeholder="Email"
            placeholderTextColor={"rgb(249 250 251 )"}
          />
          <TextInput
            onChangeText={(text) => setUsername(text)}
            className="border-b border-gray-50 p-2 w-full my-6"
            placeholder="Username"
            placeholderTextColor={"rgb(249 250 251 )"}
          />
          <TextInput
            onChangeText={(text) => setPassword(text)}
            className="border-b border-gray-50 p-2 w-full my-6"
            placeholder="Password"
            placeholderTextColor={"rgb(249 250 251 )"}
          />
        </View>
        <Pressable
          onPress={onSignUpPress}
          className="bg-yellow-400 py-4 flex justify-center items-center rounded-lg"
        >
          <Text className="text-white text-3xl font-bold">Sign Up</Text>
        </Pressable>
        <Text className="text-yellow-400 text-sm font-bold text-center mt-2.5">
          {" "}
          click here to login instead
        </Text>
      </View>
    </View>
  );
};

export default SignUp;
