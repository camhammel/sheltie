import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-elements";
import { COLORS } from "../assets/colors";
import Slider from "@react-native-community/slider";

const MySlider = ({ distance, setDistance }) => {
  return (
    <View>
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 20,
          color: COLORS.primary,
          marginLeft: 15,
          marginBottom: 5,
        }}
      >
        DISTANCE - {distance}mi
      </Text>
      <Slider
        style={{
          marginHorizontal: 20,
        }}
        minimumValue={0}
        step={25}
        minimumTrackTintColor={COLORS.primarylight}
        maximumValue={300}
        onSlidingComplete={(value) => {
          setDistance(value);
        }}
        value={distance}
      />
    </View>
  );
};

export default MySlider;
