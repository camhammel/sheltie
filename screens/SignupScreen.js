import React, { useContext } from "react";
import {
  View,
  StyleSheet,
  Image,
  useWindowDimensions,
  TouchableOpacity,
  AsyncStorage,
  ImageBackground,
} from "react-native";
import { Text } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Context as AuthContext } from "../context/AuthContext";
import NavLink from "../components/NavLink";
import { useNavigation } from "@react-navigation/native";
import SignUpComponent from "../components/SignUpComponent";
import { COLORS } from "../assets/colors";
import Spacer from "../components/Spacer";
import Logo from "../assets/logo.png";
const BgImage = require("../assets/authbg.png");

const SignupScreen = () => {
  const navigation = useNavigation();
  const { state, signup, clearErrorMessage } = useContext(AuthContext);

  return (
    <ImageBackground
      source={BgImage}
      style={{
        flex: 1,
        resizeMode: "contain",
        justifyContent: "center",
      }}
    >
      <KeyboardAwareScrollView
        behaviour="padding"
        scrollContainerStyle={styles.scrollContainerStyle}
      >
        <Spacer>
          <Image
            source={Logo}
            style={{
              width: useWindowDimensions().width / 3,
              height: useWindowDimensions().height / 4,
              alignSelf: "center",
              marginTop: 60,
            }}
          />
        </Spacer>
        <SignUpComponent state={state} clearErrorMessage={clearErrorMessage} />
        <NavLink
          text="Already have an account? Sign in here."
          routeName="Signin"
          clearErrorMessage={clearErrorMessage}
          custStyle={{ marginBottom: 0, marginTop: 20, color: "white" }}
        />
        <NavLink
          text="Continue as Guest."
          routeName="List"
          clearErrorMessage={() => {
            console.log("got here");
            (async () => {
              await AsyncStorage.setItem("guest", "true");
            })();
            //navigation.navigate("List");
          }}
          custStyle={{ marginBottom: 40, marginTop: 10, color: "white" }}
        />
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  scrollContainerStyle: {
    flex: 1,
    justifyContent: "flex-end",
  },
});

export default SignupScreen;
