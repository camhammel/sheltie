import React, { useState, useEffect, useContext } from "react";
import * as SplashScreen from 'expo-splash-screen';
import { Asset } from "expo-asset";
import * as Linking from "expo-linking";
import { loadAsync } from "expo-font";
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
import MapsScreen from "./screens/MapsScreen";
import ShelterListScreen from "./screens/ShelterListScreen";
import { Provider as AuthProvider } from "./context/AuthContext";
import { navigationRef } from "./navigationRef";
import { decode, encode } from "base-64";
import { COLORS } from "./assets/colors";

SplashScreen.preventAutoHideAsync();

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

  useEffect(() => {
    Linking.getInitialURL().then((url) => {
      if (url) {
        setTimeout(() => {
          _handleOpenURL(url);
        }, 500);
      }
    });

    const handler = Linking.addEventListener("url", ({ url }) => {
      _handleOpenURL(url);
    });

    return function cleanup() {
      handler.remove();
    };
  }, []);

  const _cacheResourcesAsync = async () => {
    await loadAsync({
      Yellowtail: require("./assets/fonts/Yellowtail-Regular.ttf"),
    });

    const images = [
      require("./assets/default.png"),
      require("./assets/authBg-25.png"),
      require("./assets/transparent_icon2.png"),
      require("./assets/accountPattern.png"),
    ];
    const cacheImages = images.map((image) => {
      return Asset.fromModule(image).downloadAsync();
    });
    return Promise.all(cacheImages);
  };

  useEffect(()=>{
    _cacheResourcesAsync().then(()=>{
      SplashScreen.hideAsync();
    })
  }, [])

  const _handleOpenURL = (url) => {
    let { path, queryParams } = Linking.parse(url);

    if (path == "pet") {
      if (queryParams.id) {
        navigationRef.current.navigate("PetDetail", { id: queryParams.id });
      } else {
        alert("Invalid Pet ID: " + queryParams.id);
      }
    } else {
      //alert("Invalid path: " + path);
    }
  };

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
        <Stack.Screen
          name="Maps"
          component={MapsScreen}
          options={{
            title: "Shelters Near Me",
            headerShown: true,
            headerTintColor: "white",
            headerStyle: { backgroundColor: COLORS.primarylight },
          }}
        />
        <Stack.Screen
          name="ShelterList"
          component={ShelterListScreen}
          options={{
            title: "",
            headerShown: true,
            headerTintColor: "white",
            headerStyle: { backgroundColor: COLORS.primarylight },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function AppWrapper() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
