import React, { useContext } from "react";
import {
  View,
  StyleSheet,
  Image,
  useWindowDimensions,
  ImageBackground,
  Dimensions,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Context } from "../context/AuthContext";
import NavLink from "../components/NavLink";
import SignInComponent from "../components/SignInComponent";
import Logo from "../assets/transparent_icon2.png";
const BgImage = require("../assets/authBg-25.png");

const SigninScreen = ({ navigation }) => {
  const { state, clearErrorMessage } = useContext(Context);

  return (
    <ImageBackground
      source={BgImage}
      style={{
        display: "flex",
        flex: 1,
        resizeMode: "contain",
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
            <SignInComponent
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
              text="Forgot Password?"
              routeName="ForgotPassword"
              clearErrorMessage={clearErrorMessage}
              custStyle={{ marginTop: 0, marginBottom: 20, color: "white" }}
            />
            <NavLink
              text="Don't have an account? Sign up here."
              routeName="Signup"
              clearErrorMessage={clearErrorMessage}
              custStyle={{ marginTop: 0, marginBottom: 40, color: "white" }}
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

export default SigninScreen;
