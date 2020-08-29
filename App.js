import React, { useState, useEffect, useContext } from "react";
import { AppLoading } from "expo";
import { Asset } from "expo-asset";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SignupScreen from "./screens/SignupScreen";
import SigninScreen from "./screens/SigninScreen";
import ListScreen from "./screens/ListScreen";
import PetDetailScreen from "./screens/PetDetailScreen";
import LoadingScreen from "./screens/LoadingScreen";
import AccountScreen from "./screens/AccountScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import FavouritesScreen from "./screens/FavouritesScreen";
import { Provider as AuthProvider } from "./context/AuthContext";
import {
  Provider as TokenProvider,
  Context as TokenContext,
} from "./context/TokenContext";
import { navigationRef } from "./navigationRef";
import { decode, encode } from "base-64";
import { COLORS } from "./assets/colors";
import * as Linking from "expo-linking";
import * as Font from "expo-font";
import { loadAsync } from "expo-font";

let goturl = false;

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
  const { update_token } = useContext(TokenContext);

  useEffect(() => {
    update_token();
    Linking.getInitialURL().then((url) => {
      if (url) {
        goturl = true;
        setTimeout(() => {
          _handleOpenURL(url);
        }, 500);
      }
    });

    Linking.addEventListener("url", ({ url }) => {
      _handleOpenURL(url);
    });

    return function cleanup() {
      Linking.removeEventListener("url");
    };
  }, []);

  const [isReady, setIsReady] = useState(false);

  const _cacheResourcesAsync = async () => {
    await loadAsync({
      //TeamSpirit: require("./assets/fonts/TeamSpirit-NF.ttf"),
      Yellowtail: require("./assets/fonts/Yellowtail-Regular.ttf"),
    });

    const images = [
      require("./assets/logo.png"),
      require("./assets/icon.png"),
      require("./assets/default.png"),
      require("./assets/authBg-25.png"),
      require("./assets/transparent_icon2.png"),
    ];
    const cacheImages = images.map((image) => {
      return Asset.fromModule(image).downloadAsync();
    });
    return Promise.all(cacheImages);
  };

  const _handleOpenURL = (url) => {
    let { path, queryParams } = Linking.parse(url);
    console.log("Path: " + path + ", query: " + queryParams.id);
    if (path == "pet") {
      if (queryParams.id) {
        console.log("**********Trying to navigate!");
        navigationRef.current.navigate("PetDetail", { id: queryParams.id });
      } else {
        alert("Invalid Pet ID: " + queryParams.id);
      }
    } else {
      //alert("Invalid path: " + path);
    }
  };

  if (!isReady && !goturl) {
    return (
      <AppLoading
        startAsync={_cacheResourcesAsync}
        onFinish={() => setIsReady(true)}
        onError={console.warn}
      />
    );
  } else {
    return (
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName="Loading">
          <Stack.Screen
            name="Loading"
            component={LoadingScreen}
            options={{ title: "Loading", headerShown: false }}
          />
          <Stack.Screen
            name="Signup"
            component={SignupScreen}
            options={{
              title: "Sign Up",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Signin"
            component={SigninScreen}
            options={{ title: "Sign In", headerShown: false }}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
            options={{
              title: "Forgot Password",
              headerShown: true,
              headerTintColor: "white",
              headerStyle: { backgroundColor: COLORS.primarylight },
            }}
          />
          <Stack.Screen
            name="List"
            component={ListScreen}
            options={{
              title: "Nearby Pets for Adoption",
              headerLeft: null,
              headerTintColor: "white",
              headerStyle: { backgroundColor: COLORS.primarylight },
            }}
          />
          <Stack.Screen
            name="PetDetail"
            component={PetDetailScreen}
            options={{
              headerTintColor: "white",
              headerStyle: { backgroundColor: COLORS.primarylight },
              headerTitle: "",
              headerTitleStyle: { fontFamily: "TeamSpirit" },
            }}
          />
          <Stack.Screen
            name="Account"
            component={AccountScreen}
            options={{
              title: "Account",
              headerShown: true,
              headerTintColor: "white",
              headerStyle: { backgroundColor: COLORS.primarylight },
            }}
          />
          <Stack.Screen
            name="Favourites"
            component={FavouritesScreen}
            options={{
              title: "Favourites",
              headerShown: true,
              headerTintColor: "white",
              headerStyle: { backgroundColor: COLORS.primarylight },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default function AppWrapper() {
  return (
    <TokenProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </TokenProvider>
  );
}
