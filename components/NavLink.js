import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import * as RootNavigation from "../navigationRef";

const NavLink = ({ text, routeName, clearErrorMessage }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        clearErrorMessage();
        RootNavigation.navigate(routeName);
      }}
    >
      <Text style={styles.linkStyle}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  linkStyle: {
    marginTop: 20,
    marginBottom: 60,
    textAlign: "center",
    color: "blue",
    fontSize: 16,
  },
});

export default NavLink;
