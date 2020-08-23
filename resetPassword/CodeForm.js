import React, { useState } from "react";
import { Text, Input, Button } from "react-native-elements";
import { View, StyleSheet } from "react-native";
import { Formik } from "formik";
import * as yup from "yup";
import { COLORS } from "../assets/colors";

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
  return (
    <Formik
      initialValues={{ code: "" }}
      onSubmit={() => {
        switchStage();
      }}
      validationSchema={resetSchema}
    >
      {(props) => (
        <View>
          <Text h4>Input the code sent to your email address.</Text>
          <Input
            label="Code"
            placeholder=""
            onChangeText={props.handleChange("code")}
            value={props.values.code}
            keyboardType="phone-pad"
            errorMessage={props.touched.code && props.errors.code}
            errorStyle={{
              marginLeft: 15,
              marginBottom: 10,
            }}
          />
          <Button title="Submit" onPress={() => props.handleSubmit()} />
        </View>
      )}
    </Formik>
  );
};

export default CodeForm;

const styles = StyleSheet.create({});
