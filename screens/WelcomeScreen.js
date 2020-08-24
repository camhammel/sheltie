import React from "react";
import { View, StyleSheet, TouchableOpacity, AsyncStorage } from "react-native";
import { Button, Image, Text } from "react-native-elements";
import Logo from "../assets/icon.png";
import { COLORS } from "../assets/colors";

const WelcomeScreen = ({ navigation }) => {
  (async () => {
    await AsyncStorage.setItem("guest", "true");
  })();

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View style={styles.viewStyle}>
        <Image
          source={Logo}
          style={{ width: 256, height: 256, marginTop: 40 }}
        />
        <Text h1 style={styles.headerStyle}>
          Sheltie
        </Text>
        <Text style={styles.bodyStyle}>Shelter Pet Adoption Classifieds</Text>
      </View>
      <View style={styles.view2Style}>
        <Button
          style={styles.buttonStyle}
          type="solid"
          title="Sign Up"
          linearGradientProps={{
            colors: [COLORS.primarylight, COLORS.primary],
            start: { x: 0.25, y: 0.1 },
            end: { x: 0.25, y: 1 },
          }}
          onPress={() => {
            navigation.navigate("Signup");
          }}
        ></Button>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Signin");
          }}
        >
          <Text style={styles.linkStyle}>I already have an account</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={(async () => {
            await AsyncStorage.setItem("guest", "true");
            navigation.navigate("List");
          })()}
        >
          <Text style={styles.linkStyle}>Continue as Guest</Text>
        </TouchableOpacity>
        <Text style={{ textAlign: "center", marginTop: 60 }}>
          Powered by the Petfinder API
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    marginVertical: 80,
  },
  view2Style: {
    flex: 1,
    flexDirection: "column",
  },
  headerStyle: {
    textAlign: "center",
    marginBottom: 20,
  },
  bodyStyle: {
    textAlign: "center",
    fontSize: 20,
  },
  buttonStyle: {
    marginHorizontal: 40,
  },
  linkStyle: {
    marginTop: 20,
    textAlign: "center",
    color: "blue",
    fontSize: 16,
  },
});

export default WelcomeScreen;
