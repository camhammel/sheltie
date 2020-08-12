import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, AsyncStorage } from "react-native";
import { Button, Text, Image } from "react-native-elements";
import Spacer from "../components/Spacer";
import { Context as AuthContext } from "../context/AuthContext";
import Logo from "../assets/icon.png";
import { COLORS } from "../assets/colors";
import sheltie from "../api/sheltie";

const AccountScreen = () => {
  const { signout, getfavs } = useContext(AuthContext);
  const [email, setEmail] = useState("");

  useEffect(() => {
    (async () => {
      setEmail(await AsyncStorage.getItem("email"));
    })();
  }, []);

  return (
    <View style={styles.viewStyle}>
      <Spacer>
        <Image source={Logo} style={{ width: 256, height: 256 }} />
      </Spacer>
      <Spacer>
        <Text h4 style={{ textAlign: "center" }}>
          You are currently signed in as
        </Text>
        <Text
          style={{
            fontSize: 22,
            marginTop: 10,
            color: COLORS.primary,
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {email}
        </Text>
      </Spacer>
      <Spacer>
        <Button
          style={styles.signoutStyle}
          type="solid"
          title={"Sign Out"}
          onPress={() => signout()}
          linearGradientProps={{
            colors: [COLORS.darkgrey, "grey"],
            start: { x: 0.25, y: 0.1 },
            end: { x: 0.25, y: 1 },
          }}
        ></Button>
        <Button
          style={styles.favouritesStyle}
          type="solid"
          title={"My Favourites"}
          onPress={() => getfavs(email)}
          linearGradientProps={{
            colors: [COLORS.primarylight, COLORS.primary],
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
  signoutStyle: {
    marginHorizontal: 40,
    marginBottom: 80,
  },
  favouritesStyle: {
    marginHorizontal: 20,
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
