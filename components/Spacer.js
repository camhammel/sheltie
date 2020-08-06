import React from "react";
import { View, StyleSheet } from "react-native";

const Spacer = ({ children, margin }) => {
  let marg;

  {
    margin ? (marg = margin) : (marg = 15);
  }

  return <View style={{ margin: marg }}>{children}</View>;
};

export default Spacer;
