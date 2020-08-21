import React, { useContext } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { Input, Button, Text } from "react-native-elements";
import { Context as AuthContext } from "../context/AuthContext";
import { Formik } from "formik";
import * as yup from "yup";
import { COLORS } from "../assets/colors";

const SignupSchema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().min(6).required(),
  confirmPassword: yup
    .string()
    .min(6)
    .required()
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

export default function SignUpComponent({ state, clearErrorMessage }) {
  const { signup } = useContext(AuthContext);

  return (
    <View>
      <Formik
        initialValues={{ email: "", password: "", confirmPassword: "" }}
        onSubmit={(values) => {
          let my_email = values.email;
          let my_pass = values.password;
          try {
            signup({ email: my_email, password: my_pass });
          } catch (err) {
            alert(err.status);
          }
        }}
        validationSchema={SignupSchema}
      >
        {(props) => (
          <View>
            <Input
              label="Email"
              placeholder="myemail@email.com"
              onChangeText={props.handleChange("email")}
              value={props.values.email}
              keyboardType="email-address"
              inputStyle={styles.inputStyle}
              inputContainerStyle={styles.containerStyle}
              labelStyle={styles.labelStyle}
              errorMessage={
                props.touched.email &&
                (props.errors.email || state.errorMessage)
              }
              errorStyle={{
                marginLeft: 15,
                marginBottom: 10,
              }}
              onTextInput={() => {
                clearErrorMessage();
              }}
            />
            <Input
              label="Password"
              placeholder="*******"
              onChangeText={props.handleChange("password")}
              value={props.values.password}
              textContentType="newPassword"
              secureTextEntry
              inputStyle={styles.inputStyle}
              inputContainerStyle={styles.containerStyle}
              labelStyle={styles.labelStyle}
              errorMessage={props.touched.password && props.errors.password}
              errorStyle={{
                marginLeft: 15,
                marginBottom: 10,
              }}
            />
            <Input
              label="Confirm Password"
              placeholder="*******"
              onChangeText={props.handleChange("confirmPassword")}
              value={props.values.confirmPassword}
              secureTextEntry
              inputStyle={styles.inputStyle}
              inputContainerStyle={styles.containerStyle}
              labelStyle={styles.labelStyle}
              errorMessage={
                props.touched.confirmPassword && props.errors.confirmPassword
              }
              errorStyle={{
                marginLeft: 15,
                marginBottom: 10,
              }}
            />
            <Button
              title="submit"
              onPress={props.handleSubmit}
              buttonStyle={{
                backgroundColor: "transparent",
                width: useWindowDimensions().width / 4,
                alignSelf: "center",
                borderRadius: 25,
                borderColor: COLORS.white,
                borderWidth: 1,
              }}
              containerStyle={{
                width: useWindowDimensions().width / 4,
                alignSelf: "center",
              }}
              titleStyle={{
                color: COLORS.white,
                fontSize: 22,
              }}
            />
          </View>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  inputStyle: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 10,
    color: COLORS.darkgrey,
  },
  containerStyle: {
    borderRadius: 8,
    marginHorizontal: 5,
    padding: 5,
    borderBottomWidth: 0,
  },
  labelStyle: {
    color: COLORS.white,
    marginLeft: 10,
    marginBottom: 5,
    marginTop: 5,
  },
});
