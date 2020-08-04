import React, { useState, useContext } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Button, Image, Text, Input } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Context as AuthContext } from "../context/AuthContext";
import NavLink from "../components/NavLink";
import AuthForm from "../components/AuthForm";

const SignupScreen = ({ navigation }) => {
  const { state, signup, clearErrorMessage } = useContext(AuthContext);

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <KeyboardAwareScrollView behaviour="padding" style={styles.scrollStyle}>
        <AuthForm
          headerText="Sign Up for Sheltie"
          buttonLabel="Sign Up"
          errorMessage={state.errorMessage}
          onSubmit={signup}
        />
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
