import React, { useState } from "react";
import { Text, Input, Button } from "react-native-elements";
import { View, StyleSheet } from "react-native";
import { Formik } from "formik";
import * as yup from "yup";
import { COLORS } from "../assets/colors";

const resetSchema = yup.object({
  email: yup.string().required().email(),
  //test this email to ensure that it exists in the database before sending a code
});

const ResetForm = ({ switchStage, setEmail }) => {
  return (
    <Formik
      initialValues={{ email: "" }}
      onSubmit={(values) => {
        setEmail(values.email);
        switchStage();
      }}
      validationSchema={resetSchema}
    >
      {(props) => (
        <View>
          <Text h3>Email Address</Text>
          <Input
            label="Email"
            placeholder="myemail@email.com"
            onChangeText={props.handleChange("email")}
            value={props.values.email}
            keyboardType="email-address"
            errorMessage={props.touched.email && props.errors.email}
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

export default ResetForm;

const styles = StyleSheet.create({});
