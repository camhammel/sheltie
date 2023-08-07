import { AppState, Platform } from "react-native";
import React, { useEffect } from "react";
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
// import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {
  QueryClient,
  QueryClientProvider,
  focusManager
} from '@tanstack/react-query'
import { SafeAreaProvider } from "react-native-safe-area-context";

const queryClient = new QueryClient()

const Stack = createStackNavigator();

function App() {
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
    return () => {
      isReadyRef.current = false;
    }
  }, [])

  const linking = {
    prefixes: ['https://*.sheltie.app', 'https://sheltie.app'],
    config: {
      initialRouteName: 'List',
      screens: {
        List: 'List',
        PetDetail: 'pet/:id'
      },
    }
  };

  function onAppStateChange(status) {
    if (Platform.OS !== 'web') {
      focusManager.setFocused(status === 'active')
    }
  }
  
  useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChange)
  
    return () => subscription.remove()
  }, [])

  return (
    // <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <NavigationContainer ref={navigationRef} linking={linking} onReady={() => { isReadyRef.current = true; }}>
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
      </SafeAreaProvider>
    // </GestureHandlerRootView>
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
