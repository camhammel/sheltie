import React, { useState } from "react";
import { Text, Input, Button } from "react-native-elements";
import { View, StyleSheet } from "react-native";
import { Formik } from "formik";
import * as yup from "yup";
import { COLORS } from "../assets/colors";

const resetSchema = yup.object({
  email: yup.string().required().email(),
});

const NewPasswordForm = ({ switchStage }) => {
  return (
    <Formik
      initialValues={{ password: "" }}
      onSubmit={() => {
        switchStage();
      }}
      validationSchema={resetSchema}
    >
      {(props) => (
        <View>
          <Text h3>New Password</Text>
          <Input
            label="New Password"
            placeholder="*************"
            onChangeText={props.handleChange("password")}
            value={props.values.password}
            errorMessage={props.touched.password && props.errors.password}
            errorStyle={{
              marginLeft: 15,
              marginBottom: 10,
            }}
            textContentType="newPassword"
          />
          <Button title="Submit" onPress={() => props.handleSubmit()} />
        </View>
      )}
    </Formik>
  );
};

export default NewPasswordForm;

const styles = StyleSheet.create({});
