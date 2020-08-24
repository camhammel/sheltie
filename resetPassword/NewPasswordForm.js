import React, { useState, useContext } from "react";
import { Text, Input, Button } from "react-native-elements";
import { View, StyleSheet } from "react-native";
import { Formik } from "formik";
import * as yup from "yup";
import { COLORS } from "../assets/colors";
import { Context as AuthContext } from "../context/AuthContext";

const newPassSchema = yup.object({
  password: yup.string().required().min(6),
});

const NewPasswordForm = ({ email, switchStage }) => {
  const { updatePassword } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <Formik
      initialValues={{ password: "" }}
      onSubmit={(values) => {
        (async () => {
          let status = await updatePassword({
            email: email,
            password: values.password,
          });

          if (status == true) {
            console.log("Successfully updated password.");
            switchStage();
          } else if (status == false) {
            console.log("Password couldn't be updated.");
            switchStage();
            alert("Password couldn't be updated.");
          } else {
            alert("Unknown response...");
          }
        })();
      }}
      validationSchema={newPassSchema}
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
            Enter Your New Password
          </Text>
          <Input
            label="New Password"
            placeholder="*************"
            onChangeText={props.handleChange("password")}
            onTextInput={() => {
              setErrorMessage("");
            }}
            value={props.values.password}
            errorMessage={
              props.touched.password && (props.errors.password || errorMessage)
            }
            errorStyle={{
              marginLeft: 15,
              marginBottom: 10,
            }}
            textContentType="newPassword"
            inputStyle={styles.inputStyle}
            inputContainerStyle={styles.containerStyle}
            labelStyle={styles.labelStyle}
          />
          <Button
            buttonStyle={styles.buttonStyle}
            title="Submit"
            onPress={() => props.handleSubmit()}
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

export default NewPasswordForm;
