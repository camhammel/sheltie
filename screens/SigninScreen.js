import React, { useContext } from "react";
import { View, StyleSheet, Image, useWindowDimensions } from "react-native";
import { Text } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Context } from "../context/AuthContext";
import NavLink from "../components/NavLink";
import AuthForm from "../components/AuthForm";
import SignInComponent from "../components/SignInComponent";
import { COLORS } from "../assets/colors";
import Spacer from "../components/Spacer";
import Logo from "../assets/logo.png";

const SigninScreen = ({ navigation }) => {
  const { state, signin, clearErrorMessage } = useContext(Context);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.primary }}>
      <KeyboardAwareScrollView behaviour="padding" style={styles.scrollStyle}>
        {/* <AuthForm
          headerText="Sign In to Sheltie"
          buttonLabel="Sign In"
          errorMessage={state.errorMessage}
          onSubmit={signin}
        /> */}
        <Spacer>
          <Text
            h2
            style={{
              color: COLORS.white,
              alignSelf: "center",
              marginBottom: 10,
              marginTop: 15,
            }}
          >
            Sign In
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
        <SignInComponent state={state} clearErrorMessage={clearErrorMessage} />
        {/* <NavLink
          text="Forgot Password"
          routeName="ForgotPassword"
          clearErrorMessage={clearErrorMessage}
          custStyle={{ marginBottom: 0, marginTop: 60 }}
        /> */}
        <NavLink
          text="Don't have an account? Sign up here."
          routeName="Signup"
          clearErrorMessage={clearErrorMessage}
          custStyle={{ marginBottom: 60 }}
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

export default SigninScreen;
