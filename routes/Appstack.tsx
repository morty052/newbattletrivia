import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "../views";

const stack = createNativeStackNavigator();

export function AppStack() {
  return (
    <stack.Navigator>
      <stack.Screen name="Home" component={HomeScreen} />
    </stack.Navigator>
  );
}
