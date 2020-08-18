import React from "react";
import Male from "../assets/male.png";
import Female from "../assets/female.png";
import { Text } from "react-native-elements";
import { View, StyleSheet, Image, Dimensions } from "react-native";

function capitalizeFirstLetter(string) {
  string = string.toLowerCase();
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const NameGender = ({ name, gender }) => {
  // if (name.length > 8) {
  //   name = name.substring(0, 8) + "...";
  // }

  return (
    <View
      style={{
        flexDirection: "row",
        marginTop: 10,
        justifyContent: "flex-start",
      }}
    >
      <Text
        h3
        style={{
          marginLeft: 15,
          marginVertical: 10,
          fontWeight: "bold",
          width: Dimensions.get("screen").width - 240,
        }}
        //adjustsFontSizeToFit={true}
        numberOfLines={1}
        ellipsizeMode="tail"
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
    width: 30,
    resizeMode: "contain",
    alignSelf: "center",
    marginLeft: 0,
  },
});

export default NameGender;
