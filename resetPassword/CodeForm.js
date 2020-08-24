import React, { useState, useRef } from "react";
import { Text, Input, Button } from "react-native-elements";
import { View, StyleSheet, AsyncStorage } from "react-native";
import { Formik } from "formik";
import * as yup from "yup";
import { COLORS } from "../assets/colors";
import CodeInput from "../components/CodeInput";
import Icon from "react-native-vector-icons/FontAwesome";

const resetSchema = yup.object({
  code: yup
    .number()
    .required()
    .test(
      "len",
      "Must be exactly 6 characters",
      (val) => val.toString().length === 6
    ),
});

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
      {/* <Input
            label="Code"
            placeholder=""
            onChangeText={props.handleChange("code")}
            onTextInput={() => {
              setErrorMessage("");
            }}
            value={props.values.code}
            keyboardType="phone-pad"
            errorMessage={
              props.touched.code && (props.errors.code || errorMessage)
            }
            errorStyle={{
              marginLeft: 15,
              marginBottom: 10,
            }}
          /> */}
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
              if (value == (await AsyncStorage.getItem("fpcode"))) {
                setLoading(false);
                switchStage();
              } else {
                setLoading(false);
                alert("Incorrect Code.");
              }
            }, 1000);
          }}
        />
      </View>
    </View>
  );
};

export default CodeForm;

const styles = StyleSheet.create({});
