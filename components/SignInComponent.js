import React, { useContext } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { Input, Button, Text } from "react-native-elements";
import { Context as AuthContext } from "../context/AuthContext";
import Icon from "react-native-vector-icons/Entypo";
import { Formik } from "formik";
import * as yup from "yup";
import { COLORS } from "../assets/colors";
import { styles } from "../utils/styles";

const SigninSchema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().min(6).required(),
});

export default function SignInComponent({ state, clearErrorMessage }) {
  const { signin } = useContext(AuthContext);

  return (
    <View>
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={(values) => {
          let my_email = values.email;
          let my_pass = values.password;
          try {
            signin({ email: my_email, password: my_pass });
          } catch (err) {
            alert(err.status);
          }
        }}
        validationSchema={SigninSchema}
      >
        {(props) => (
          <View>
            <Input
              //label="Email"
              placeholder="Email address"
              onChangeText={props.handleChange("email")}
              value={props.values.email}
              keyboardType="email-address"
              autoCorrect={false}
              autoCapitalize="none"
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
              //label="Password"
              placeholder="Password"
              onChangeText={props.handleChange("password")}
              value={props.values.password}
              textContentType="newPassword"
              autoCorrect={false}
              autoCapitalize="none"
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
            <Button
              title="Sign in"
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
