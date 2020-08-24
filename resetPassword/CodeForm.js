import React, { useState, useRef } from "react";
import { Text, Button } from "react-native-elements";
import { View, StyleSheet, AsyncStorage } from "react-native";
import { COLORS } from "../assets/colors";
import CodeInput from "../components/CodeInput";
import Icon from "react-native-vector-icons/FontAwesome";
import * as SecureStore from "expo-secure-store";

const CodeForm = ({ switchStage }) => {
  const [value, setValue] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <Text
        h3
        style={{
          marginTop: 40,
          textAlign: "center",
          color: COLORS.primary,
          marginBottom: 20,
          fontWeight: "300",
          marginHorizontal: 40,
        }}
      >
        Input the code sent to your email address
      </Text>
      <View style={{ flex: 1 }}>
        <CodeInput value={value} setValue={setValue} cellCount={6} />
      </View>
      <View style={{ flex: 1 }}>
        <Button
          icon={
            loading ? <Icon name="spinner" size={15} color="white" /> : null
          }
          buttonStyle={{
            backgroundColor: COLORS.primary,
            marginHorizontal: 40,
          }}
          title={loading ? "" : "Submit"}
          onPress={() => {
            setLoading(true);
            setTimeout(async () => {
              if (value == (await SecureStore.getItemAsync("fpcode"))) {
                setLoading(false);
                switchStage();
              } else {
                setLoading(false);
                alert("Incorrect Code.");
              }
            }, 600);
          }}
        />
      </View>
    </View>
  );
};

export default CodeForm;

const styles = StyleSheet.create({});
