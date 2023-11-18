import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen, Level, Menu } from "../views";
import { SocketContextProvider } from "../contexts/SocketContext";

const stack = createNativeStackNavigator();

export function AppStack() {
  return (
    <SocketContextProvider>
      <stack.Navigator>
        <stack.Screen
          options={{ headerShown: false }}
          name="App"
          component={Menu}
        />
        <stack.Screen
          options={{ headerShown: false }}
          name="Level"
          component={Level}
        />
      </stack.Navigator>
    </SocketContextProvider>
  );
}
