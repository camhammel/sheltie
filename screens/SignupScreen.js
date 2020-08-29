import React, { useContext } from "react";
import {
  View,
  StyleSheet,
  Image,
  useWindowDimensions,
  AsyncStorage,
  ImageBackground,
  Dimensions,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Context as AuthContext } from "../context/AuthContext";
import NavLink from "../components/NavLink";
import { useNavigation } from "@react-navigation/native";
import SignUpComponent from "../components/SignUpComponent";
import Logo from "../assets/transparent_icon2.png";
const BgImage = require("../assets/authBg-25.png");

const SignupScreen = () => {
  const navigation = useNavigation();
  const { state, signup, clearErrorMessage } = useContext(AuthContext);

  return (
    <ImageBackground
      source={BgImage}
      style={{
        display: "flex",
        flex: 1,
        resizeMode: "contain",
        display: "flex",
      }}
    >
      <KeyboardAwareScrollView>
        <View style={styles.scrollContainerStyle}>
          <View style={{ flex: 1, justifyContent: "flex-start" }}>
            <Image
              source={Logo}
              style={{
                width: useWindowDimensions().width,
                height: useWindowDimensions().height / 4,
                alignSelf: "center",
                marginTop: 60,
                marginBottom: 40,
              }}
              resizeMode="contain"
            />
            <SignUpComponent
              state={state}
              clearErrorMessage={clearErrorMessage}
            />
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
            }}
          >
            <NavLink
              text="Already have an account? Sign in here."
              routeName="Signin"
              clearErrorMessage={clearErrorMessage}
              custStyle={{ marginBottom: 20, marginTop: 0, color: "white" }}
            />
            <NavLink
              text="Or, continue as Guest."
              routeName="List"
              clearErrorMessage={() => {
                console.log("got here");
                (async () => {
                  await AsyncStorage.setItem("guest", "true");
                })();
                //navigation.navigate("List");
              }}
              custStyle={{ marginBottom: 40, marginTop: 0, color: "white" }}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  scrollContainerStyle: {
    flex: 1,
    minHeight: Dimensions.get("window").height,
  },
});

export default SignupScreen;
