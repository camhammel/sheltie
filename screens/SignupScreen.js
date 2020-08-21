import React, { useContext } from "react";
import { View, StyleSheet, Image, useWindowDimensions } from "react-native";
import { Text } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Context as AuthContext } from "../context/AuthContext";
import NavLink from "../components/NavLink";
import AuthForm from "../components/AuthForm";
import SignUpComponent from "../components/SignUpComponent";
import { COLORS } from "../assets/colors";
import Spacer from "../components/Spacer";
import Logo from "../assets/logo.png";

const SignupScreen = ({ navigation }) => {
  const { state, signup, clearErrorMessage } = useContext(AuthContext);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.primary }}>
      <KeyboardAwareScrollView behaviour="padding" style={styles.scrollStyle}>
        {/* <AuthForm
          headerText="Sign Up for Sheltie"
          buttonLabel="Sign Up"
          errorMessage={state.errorMessage}
          onSubmit={signup}
        /> */}
        <Spacer>
          <Text
            h2
            style={{
              color: COLORS.white,
              alignSelf: "center",
              marginBottom: 10,
            }}
          >
            Sign Up
          </Text>
          <Image
            source={Logo}
            style={{
              width: useWindowDimensions().width / 3,
              height: useWindowDimensions().height / 4,
              alignSelf: "center",
            }}
          />
        </Spacer>
        <SignUpComponent state={state} clearErrorMessage={clearErrorMessage} />
        <NavLink
          text="Already have an account? Sign in here."
          routeName="Signin"
          clearErrorMessage={clearErrorMessage}
        />
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollStyle: {
    marginTop: 50,
  },
});

export default SignupScreen;
