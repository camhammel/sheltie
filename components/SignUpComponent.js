import React, { useContext } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { Input, Button, Text } from "react-native-elements";
import { Context as AuthContext } from "../context/AuthContext";
import { Formik } from "formik";
import * as yup from "yup";
import { COLORS } from "../assets/colors";
import { styles } from "../utils/styles";
import Icon from "react-native-vector-icons/Entypo";

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
            signup({
              email: my_email.toString().toLowerCase(),
              password: my_pass,
            });
          } catch (err) {
            alert(err.status);
          }
        }}
        validationSchema={SignupSchema}
      >
        {(props) => (
          <View>
            <Input
              placeholder="Email address"
              placeholderTextColor={COLORS.white}
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
              leftIcon={
                <Icon
                  name="email"
                  size={20}
                  color={COLORS.white}
                  //borderWidth={1}
                  //borderColor={COLORS.white}
                />
              }
            />
            <Input
              placeholder="Password"
              placeholderTextColor={COLORS.white}
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
              leftIcon={
                <Icon
                  name="lock"
                  size={20}
                  color={COLORS.white}
                  //borderWidth={1}
                  //borderColor={COLORS.white}
                />
              }
            />
            <Input
              placeholder="Confirm Password"
              placeholderTextColor={COLORS.white}
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
              leftIcon={
                <Icon
                  name="lock"
                  size={20}
                  color={COLORS.white}
                  //borderWidth={1}
                  //borderColor={COLORS.white}
                />
              }
            />
            <Button
              title="Sign up"
              onPress={props.handleSubmit}
              buttonStyle={{
                backgroundColor: "transparent",
                width: useWindowDimensions().width / 2,
                alignSelf: "center",
                borderRadius: 25,
                borderColor: COLORS.white,
                borderWidth: 1,
              }}
              containerStyle={{
                width: useWindowDimensions().width / 2,
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
