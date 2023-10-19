import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Pressable,
} from "react-native";
import { useState } from "react";
import { useSignIn, SignedIn, SignedOut } from "@clerk/clerk-expo";

type Props = {
  navigation: any;
};

const SignIn = ({ navigation }: Props) => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const onSignInPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });
      // This is an important step,
      // This indicates the user is signed in
      await setActive({ session: completeSignIn.createdSessionId });
      navigation.navigate("Home");
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <View>
      <View className="py-4 px-2 bg-gray-700 h-screen ">
        <View className=" px-2 py-8 flex ">
          <Text className="text-2xl font-semibold text-gray-50">
            Sign in to your account
          </Text>
          <View className=" mt-4 ">
            <TextInput
              onChangeText={(text) => setEmailAddress(text)}
              className="border-b border-gray-50 p-2 w-full my-6 "
              placeholder="Email"
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
            onPress={onSignInPress}
            className="bg-yellow-400 py-4 flex justify-center items-center rounded-lg"
          >
            <Text className="text-white text-3xl font-bold">Sign In</Text>
          </Pressable>
          <TouchableOpacity>
            <Text className="text-yellow-400 text-sm font-bold text-center mt-2.5">
              click here to sign up instead
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* <TouchableOpacity onPress={onSignInPress}>
        <Text>Sign in</Text>
      </TouchableOpacity>

      <SignedIn>
        <Text>You are Signed in</Text>
      </SignedIn>
      <SignedOut>
        <Text>You are Not Signed in</Text>
      </SignedOut> */}
    </View>
  );
};

export default SignIn;
