import { StatusBar } from "expo-status-bar";
import { SocketContextProvider } from "./contexts/SocketContext";
import { ClerkProvider } from "@clerk/clerk-expo";
import { NavigationContainer } from "@react-navigation/native";
import MainStack from "./routes/MainStack";
import { Level } from "./views";
import VoiceTest from "./views/Test";

type Props = {};

const App = () => {
  return (
    <>
      <ClerkProvider
        publishableKey={
          "pk_test_aW5maW5pdGUtZmF3bi01MC5jbGVyay5hY2NvdW50cy5kZXYk"
        }
      >
        <NavigationContainer>
          <MainStack />
          <StatusBar />
        </NavigationContainer>
      </ClerkProvider>
    </>
  );
};

export default App;
