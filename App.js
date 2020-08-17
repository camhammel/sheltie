import React, { useState } from "react";
import { AppLoading } from "expo";
import { Asset } from "expo-asset";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomeScreen from "./screens/WelcomeScreen";
import SignupScreen from "./screens/SignupScreen";
import SigninScreen from "./screens/SigninScreen";
import ListScreen from "./screens/ListScreen";
import PetDetailScreen from "./screens/PetDetailScreen";
import LoadingScreen from "./screens/LoadingScreen";
import AccountScreen from "./screens/AccountScreen";
import FavouritesScreen from "./screens/FavouritesScreen";
import { Provider as AuthProvider } from "./context/AuthContext";
import { Provider as TokenProvider } from "./context/TokenContext";
import { navigationRef } from "./navigationRef";
import { decode, encode } from "base-64";
import { COLORS } from "./assets/colors";

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

const Stack = createStackNavigator();

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function App() {
  const [isReady, setIsReady] = useState(false);

  const _cacheResourcesAsync = async () => {
    const images = [
      require("./assets/logo.png"),
      require("./assets/icon.png"),
      require("./assets/default.png"),
    ];
    const cacheImages = images.map((image) => {
      return Asset.fromModule(image).downloadAsync();
    });
    return Promise.all(cacheImages);
  };

  if (!isReady) {
    return (
      <AppLoading
        startAsync={_cacheResourcesAsync}
        onFinish={() => setIsReady(true)}
        onError={console.warn}
      />
    );
  }

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
              options={{
                title: "Nearby Pets for Adoption",
                headerLeft: null,
                headerTintColor: "black",
                headerStyle: { backgroundColor: COLORS.primarylight },
              }}
            />
            <Stack.Screen
              name="PetDetail"
              component={PetDetailScreen}
              options={({ route }) => ({
                headerTintColor: "black",
                headerStyle: { backgroundColor: COLORS.primarylight },
                title: capitalizeFirstLetter(route.params.name.toLowerCase()),
              })}
            />
            <Stack.Screen
              name="Account"
              component={AccountScreen}
              options={{
                title: "Account",
                headerShown: true,
                headerTintColor: "black",
                headerStyle: { backgroundColor: COLORS.primarylight },
              }}
            />
            <Stack.Screen
              name="Favourites"
              component={FavouritesScreen}
              options={{
                title: "Favourites",
                headerShown: true,
                headerTintColor: "black",
                headerStyle: { backgroundColor: COLORS.primarylight },
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </TokenProvider>
  );
}

export default App;
