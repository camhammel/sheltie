import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomeScreen from "./screens/WelcomeScreen";
import SignupScreen from "./screens/SignupScreen";
import SigninScreen from "./screens/SigninScreen";
import ListScreen from "./screens/ListScreen";
import PetDetailScreen from "./screens/PetDetailScreen";
import LoadingScreen from "./screens/LoadingScreen";
import AccountScreen from "./screens/AccountScreen";
import { Provider as AuthProvider } from "./context/AuthContext";
import { Provider as TokenProvider } from "./context/TokenContext";
import { navigationRef } from "./navigationRef";
import { decode, encode } from "base-64";

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

const Stack = createStackNavigator();

function App() {
  return (
    <TokenProvider>
      <AuthProvider>
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator initialRouteName="Loading">
            <Stack.Screen
              name="Loading"
              component={LoadingScreen}
              options={{ title: "Loading", headerShown: false }}
            />
            <Stack.Screen
              name="Welcome"
              component={WelcomeScreen}
              options={{ title: "Welcome", headerShown: false }}
            />
            <Stack.Screen
              name="Signup"
              component={SignupScreen}
              options={{
                title: "Sign Up",
                animationTypeForReplace: "pop",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Signin"
              component={SigninScreen}
              options={{ title: "Sign In", headerShown: false }}
            />
            <Stack.Screen
              name="List"
              component={ListScreen}
              options={{ title: "Nearby Pets for Adoption", headerLeft: null }}
            />
            <Stack.Screen
              name="PetDetail"
              component={PetDetailScreen}
              options={({ route }) => ({ title: route.params.name })}
            />
            <Stack.Screen
              name="Account"
              component={AccountScreen}
              options={{ title: "Account", headerShown: true }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </TokenProvider>
  );
}

export default App;
