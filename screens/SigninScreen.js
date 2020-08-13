import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Context } from "../context/AuthContext";
import NavLink from "../components/NavLink";
import AuthForm from "../components/AuthForm";

const SigninScreen = ({ navigation }) => {
  const { state, signin, clearErrorMessage } = useContext(Context);

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <KeyboardAwareScrollView behaviour="padding" style={styles.scrollStyle}>
        <AuthForm
          headerText="Sign In to Sheltie"
          buttonLabel="Sign In"
          errorMessage={state.errorMessage}
          onSubmit={signin}
        />
        <NavLink
          text="Don't have an account? Sign up here."
          routeName="Signup"
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

export default SigninScreen;
