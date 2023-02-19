import React, { useState } from "react";
import { Button, Image, Text, Input } from "react-native-elements";
import LinearGradient from 'react-native-linear-gradient';
import { View, StyleSheet } from "react-native";
import Logo from "../assets/icon.png";
import Spacer from "./Spacer";

const AuthForm = ({ headerText, buttonLabel, errorMessage, onSubmit }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <View style={styles.viewStyle}>
        <Spacer>
          <Image source={Logo} style={{ width: 256, height: 256 }} />
        </Spacer>
        <Text h3 style={styles.headerStyle}>
          {headerText}
        </Text>
        <Input
          value={email}
          onChangeText={setEmail}
          style={styles.inputStyle}
          label="Email"
          placeholder="email@address.com"
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="emailAddress"
        ></Input>
        <Input
          value={password}
          onChangeText={setPassword}
          style={styles.inputStyle}
          label="Password"
          placeholder="*********"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
          textContentType="password"
        ></Input>
      </View>
      {errorMessage != "" ? (
        <Text style={styles.errorStyle}>{errorMessage}</Text>
      ) : null}
      <Button
        style={styles.buttonStyle}
        type="solid"
        title={buttonLabel}
        onPress={() => onSubmit({ email, password })}
        ViewComponent={LinearGradient}
        linearGradientProps={{
          colors: ["#FE96BE", "#F171A8"],
          start: { x: 0.25, y: 0.1 },
          end: { x: 0.25, y: 1 },
        }}
      ></Button>
    </>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    textAlign: "center",
    marginBottom: 40,
  },
  buttonStyle: {
    marginHorizontal: 40,
  },
  inputStyle: {
    fontSize: 14,
  },
  viewStyle: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: 20,
    justifyContent: "space-evenly",
  },
  errorStyle: {
    fontSize: 16,
    color: "red",
    marginLeft: 10,
    marginBottom: 5,
  },
});

export default AuthForm;
