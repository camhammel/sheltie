import React, { useContext } from "react";
import {
  View,
  StyleSheet,
  Image,
  useWindowDimensions,
  ImageBackground,
} from "react-native";
import { Text } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Context } from "../context/AuthContext";
import NavLink from "../components/NavLink";
import SignInComponent from "../components/SignInComponent";
import { COLORS } from "../assets/colors";
import Spacer from "../components/Spacer";
import Logo from "../assets/logo.png";
const BgImage = require("../assets/authbg.png");

const SigninScreen = ({ navigation }) => {
  const { state, clearErrorMessage } = useContext(Context);

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
        <SignInComponent state={state} clearErrorMessage={clearErrorMessage} />
        <NavLink
          text="Forgot Password?"
          routeName="ForgotPassword"
          clearErrorMessage={clearErrorMessage}
          custStyle={{ marginBottom: 10, marginTop: 60, color: "white" }}
        />
        <NavLink
          text="Don't have an account? Sign up here."
          routeName="Signup"
          clearErrorMessage={clearErrorMessage}
          custStyle={{ marginBottom: 20, color: "white" }}
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

export default SigninScreen;
