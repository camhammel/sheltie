import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, AsyncStorage } from "react-native";
import { Button, Text, Image } from "react-native-elements";
import Spacer from "../components/Spacer";
import { Context as AuthContext } from "../context/AuthContext";
import Logo from "../assets/icon.png";
import { COLORS } from "../assets/colors";

const AccountScreen = () => {
  const { signout } = useContext(AuthContext);

  return (
    <View style={styles.viewStyle}>
      <Spacer>
        <Image source={Logo} style={{ width: 256, height: 256 }} />
      </Spacer>
      <Spacer>
        <Text h4>You are currently signed in</Text>
      </Spacer>
      <Spacer>
        <Button
          style={styles.buttonStyle}
          type="solid"
          title={"Sign Out"}
          onPress={() => signout()}
          linearGradientProps={{
            colors: [COLORS.primary, COLORS.light],
            start: { x: 0.25, y: 0.1 },
            end: { x: 0.25, y: 1 },
          }}
        ></Button>
        <Spacer>
          <Text style={{ marginTop: 60 }}>Powered by the Petfinder API</Text>
        </Spacer>
      </Spacer>
    </View>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    textAlign: "center",
    marginBottom: 40,
  },
  buttonStyle: {
    marginHorizontal: 40,
  },

  viewStyle: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: 20,
    justifyContent: "flex-start",
    backgroundColor: "#ffffff",
  },
});

export default AccountScreen;
