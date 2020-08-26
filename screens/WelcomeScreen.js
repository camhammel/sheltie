import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  AsyncStorage,
  ScrollView,
} from "react-native";
import { Button, Image, Text } from "react-native-elements";
import Logo from "../assets/icon.png";
import { COLORS } from "../assets/colors";

const WelcomeScreen = ({ navigation }) => {
  AsyncStorage.setItem("guest", "true");

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#ffffff" }}>
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
      <View>
        <Button
          containerStyle={{ marginHorizontal: 40 }}
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
          onPress={async () => {
            await AsyncStorage.setItem("guest", "true");
            navigation.navigate("List");
          }}
        >
          <Text style={styles.linkStyle}>Continue as guest</Text>
        </TouchableOpacity>
        <Text style={{ textAlign: "center", marginTop: 60 }}>
          Powered by the Petfinder API
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    marginBottom: 60,
  },
  headerStyle: {
    textAlign: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  bodyStyle: {
    textAlign: "center",
    fontSize: 20,
  },
  linkStyle: {
    marginTop: 20,
    textAlign: "center",
    color: "blue",
    fontSize: 16,
  },
});

export default WelcomeScreen;
