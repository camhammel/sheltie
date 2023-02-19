import React, { useState, useContext } from "react";
import { Text, Input, Button } from "react-native-elements";
import { View, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Formik } from "formik";
import * as yup from "yup";
import { COLORS } from "../assets/colors";
import { Context as AuthContext } from "../context/AuthContext";

const resetSchema = yup.object({
  email: yup.string().required().email(),
  //test this email to ensure that it exists in the database before sending a code
});

const ResetForm = ({ switchStage, setEmail }) => {
  const { emailExists, sendCodeToEmail } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <Formik
      initialValues={{ email: "" }}
      onSubmit={(values) => {
        setEmail(values.email);
        (async () => {
          let result = await emailExists(values.email.toString().toLowerCase());
          if (result == true || AsyncStorage.getItem("checkEmail") == "true") {
            setErrorMessage("");
            if (sendCodeToEmail(values.email.toString().toLowerCase()))
              switchStage();
            else {
            }
          } else {
            setErrorMessage("Sorry, that email doesn't exist.");
          }
        })();
      }}
      validationSchema={resetSchema}
    >
      {(props) => (
        <View style={{ backgroundColor: COLORS.white, flex: 1 }}>
          <Text
            h3
            style={{
              textAlign: "center",
              color: COLORS.primary,
              marginTop: 40,
              marginBottom: 20,
              fontWeight: "300",
              marginHorizontal: 40,
            }}
          >
            Enter Your Email Address
          </Text>
          <Input
            label="Email"
            textContentType="emailAddress"
            placeholder="myemail@email.com"
            inputStyle={styles.inputStyle}
            inputContainerStyle={styles.containerStyle}
            labelStyle={styles.labelStyle}
            onChangeText={props.handleChange("email")}
            onTextInput={setErrorMessage("")}
            value={props.values.email}
            keyboardType="email-address"
            errorMessage={
              props.touched.email && (props.errors.email || errorMessage)
            }
            errorStyle={{
              marginTop: 5,
              marginLeft: 15,
              marginBottom: 10,
            }}
            style={{ borderBottomWidth: 0 }}
          />
          <Button
            title="Request Code"
            onPress={() => props.handleSubmit()}
            buttonStyle={styles.buttonStyle}
          />
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  inputStyle: {
    borderRadius: 8,
    padding: 10,
    borderBottomWidth: 0,
  },
  containerStyle: {
    borderRadius: 8,
    marginHorizontal: 5,
    padding: 5,
    alignSelf: "center",
  },
  labelStyle: {
    marginLeft: 10,
    marginBottom: 5,
    marginTop: 15,
    borderBottomWidth: 0,
  },
  buttonStyle: {
    marginHorizontal: 40,
    backgroundColor: COLORS.primary,
    marginTop: 20,
  },
});

export default ResetForm;
