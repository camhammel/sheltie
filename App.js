import React, { useEffect, useState } from "react";
import { View } from 'react-native';
import { Asset } from "expo-asset";
import * as Font from "expo-font";
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
import { navigationRef, isReadyRef } from "./navigationRef";
import { COLORS } from "./assets/colors";
import { StatusBar } from "expo-status-bar";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { SafeAreaProvider } from "react-native-safe-area-context";
import { retrieveToken } from "./api/petfinder";
import 'dotenv/config'

const queryClient = new QueryClient()

const Stack = createStackNavigator();

function App() {
  const [isReady, setIsReady] = useState(false);

  async function prepare() {
    try {
      await Font.loadAsync({
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
    } catch (e) {
      console.warn(e);
    }
  }

  useEffect(() => {
    prepare();
    retrieveToken();
    return () => {
      isReadyRef.current = false;
    }
  }, [])

  const linking = {
    prefixes: ['https://*.sheltie.app', 'https://sheltie.app'],
    config: {
      screens: {
        PetDetail: 'pet/:id'
      }
    }
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef} linking={linking} onReady={() => { isReadyRef.current = true; setIsReady(true); }}>
        {isReady && <Stack.Navigator initialRouteName="Loading">
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
        </Stack.Navigator>}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default function AppWrapper() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <App />
        <StatusBar />
      </QueryClientProvider>
    </AuthProvider>
  );
}
