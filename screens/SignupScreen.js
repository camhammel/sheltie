import React, { useContext } from "react";
import {
  View,
  StyleSheet,
  Image,
  useWindowDimensions,
  TouchableOpacity,
  AsyncStorage,
} from "react-native";
import { Text } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Context as AuthContext } from "../context/AuthContext";
import NavLink from "../components/NavLink";
import { useNavigation } from "@react-navigation/native";
import SignUpComponent from "../components/SignUpComponent";
import { COLORS } from "../assets/colors";
import Spacer from "../components/Spacer";
import Logo from "../assets/logo.png";

const SignupScreen = () => {
  const navigation = useNavigation();
  const { state, signup, clearErrorMessage } = useContext(AuthContext);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.primary }}>
      <KeyboardAwareScrollView behaviour="padding" style={styles.scrollStyle}>
        {/* <AuthForm
          headerText="Sign Up for Sheltie"
          buttonLabel="Sign Up"
          errorMessage={state.errorMessage}
          onSubmit={signup}
        /> */}
        <Spacer>
          <Text
            h2
            style={{
              color: COLORS.white,
              alignSelf: "center",
              marginBottom: 10,
              marginTop: 15,
            }}
          >
            Sign Up
          </Text>
          <Image
            source={Logo}
            style={{
              width: useWindowDimensions().width / 3,
              height: useWindowDimensions().height / 4,
              alignSelf: "center",
            }}
          />
        </Spacer>
        <SignUpComponent state={state} clearErrorMessage={clearErrorMessage} />
        <NavLink
          text="Already have an account? Sign in here."
          routeName="Signin"
          clearErrorMessage={clearErrorMessage}
          custStyle={{ marginBottom: 0, marginTop: 20 }}
        />
        <NavLink
          text="Continue as Guest."
          routeName="List"
          clearErrorMessage={() => {
            console.log("got here");
            (async () => {
              await AsyncStorage.setItem("guest", "true");
            })();
            //navigation.navigate("List");
          }}
          custStyle={{ marginBottom: 40, marginTop: 0 }}
        />
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollStyle: {
    marginTop: 50,
  },
  linkStyle: {
    marginTop: 20,
    textAlign: "center",
    color: "blue",
    fontSize: 15,
    marginBottom: 40,
  },
});

export default SignupScreen;
