import React from "react";
import Male from "../assets/male.png";
import Female from "../assets/female.png";
import { Text } from "react-native-elements";
import { View, StyleSheet, Image } from "react-native";

function capitalizeFirstLetter(string) {
  string = string.toLowerCase();
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const NameGender = ({ name, gender }) => {
  if (name.length > 14) {
    name = name.substring(0, 14) + "...";
  }

  return (
    <View style={{ flexDirection: "row", marginTop: 10 }}>
      <Text
        h4
        style={{
          marginLeft: 15,
          marginVertical: 10,
        }}
        adjustsFontSizeToFit={true}
        numberOfLines={3}
      >
        {capitalizeFirstLetter(name)}
      </Text>
      {gender == "Male" ? (
        <Image source={Male} style={styles.genderStyle} />
      ) : (
        <Image source={Female} style={styles.genderStyle} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  genderStyle: {
    height: 30,
    width: 50,
    resizeMode: "contain",
    alignSelf: "center",
  },
});

export default NameGender;
