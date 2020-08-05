import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Text, Image } from "react-native-elements";
import Spacer from "../components/Spacer";
import { Context as AuthContext } from "../context/AuthContext";
import Logo from "../assets/icon.png";

const AccountScreen = () => {
  const { signout } = useContext(AuthContext);

  return (
    <View style={styles.viewStyle}>
      <Spacer>
        <Image source={Logo} style={{ width: 256, height: 256 }} />
      </Spacer>
      <Spacer>
        <Text h4>Signed in as</Text>
      </Spacer>
      <Spacer>
        <Button
          style={styles.buttonStyle}
          type="solid"
          title={"Sign Out"}
          onPress={() => signout()}
          linearGradientProps={{
            colors: ["#FE96BE", "#F171A8"],
            start: { x: 0.25, y: 0.1 },
            end: { x: 0.25, y: 1 },
          }}
        ></Button>
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
