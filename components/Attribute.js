import React from "react";
import Male from "../assets/male.png";
import Female from "../assets/female.png";
import { Text } from "react-native-elements";
import { View, StyleSheet, Image } from "react-native";
import FAIcon from "react-native-vector-icons/FontAwesome";
import Icon from "react-native-vector-icons/Entypo";
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS } from "../assets/colors";

function capitalizeFirstLetter(string) {
  string = string.toLowerCase();
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const Attribute = ({ type, value, gender }) => {
  switch (type) {
    case "size": {
      return (
        <View style={{ flexDirection: "row", marginTop: 5, marginLeft: 10 }}>
          <Icon
            name="ruler"
            size={20}
            color={COLORS.primary}
            style={{ marginLeft: 15, alignSelf: "center" }}
          />
          <Text
            style={{
              fontSize: 18,
              marginLeft: 10,
              margin: 5,
              color: COLORS.darkgrey,
            }}
          >
            {value}
          </Text>
        </View>
      );
    }
    case "age": {
      return (
        <View style={{ flexDirection: "row", marginTop: 5, marginLeft: 10 }}>
          <FAIcon
            name="birthday-cake"
            size={20}
            color={COLORS.primary}
            style={{ marginLeft: 15, alignSelf: "center" }}
          />
          <Text
            style={{
              fontSize: 18,
              marginLeft: 10,
              margin: 5,
              color: COLORS.darkgrey,
            }}
          >
            {value}
          </Text>
        </View>
      );
    }
    case "declawed": {
      if (value == true || value == false) {
        return (
          <View style={{ flexDirection: "row", marginTop: 5, marginLeft: 10 }}>
            <Icon
              name="scissors"
              size={20}
              color={COLORS.primary}
              style={{ marginLeft: 15, alignSelf: "center" }}
            />
            <Text
              style={{
                fontSize: 18,
                marginLeft: 10,
                margin: 5,
                color: COLORS.darkgrey,
              }}
            >
              {value ? "Declawed" : "Not Declawed"}
            </Text>
          </View>
        );
      } else return null;
    }
    case "spayed": {
      if (value == true || value == false) {
        return (
          <View style={{ flexDirection: "row", marginTop: 5, marginLeft: 10 }}>
            <MCIcon
              name="reproduction"
              size={20}
              color={COLORS.primary}
              style={{ marginLeft: 15, alignSelf: "center" }}
            />
            <Text
              style={{
                fontSize: 18,
                marginLeft: 10,
                margin: 5,
                color: COLORS.darkgrey,
              }}
            >
              {value && gender == "Male" ? "Neutered" : null}
              {value && gender == "Female" ? "Spayed" : null}
              {!value && gender == "Male" ? "Not Neutered" : null}
              {!value && gender == "Female" ? "Not Spayed" : null}
            </Text>
          </View>
        );
      } else return null;
    }
    case "house_trained": {
      if (value == true || value == false) {
        return (
          <View style={{ flexDirection: "row", marginTop: 5, marginLeft: 10 }}>
            <Icon
              name="home"
              size={20}
              color={COLORS.primary}
              style={{ marginLeft: 15, alignSelf: "center" }}
            />
            <Text
              style={{
                fontSize: 18,
                marginLeft: 10,
                margin: 5,
                color: COLORS.darkgrey,
              }}
            >
              {value ? "House Trained" : "Not House Trained"}
            </Text>
          </View>
        );
      } else return null;
    }
    case "shots": {
      if (value == true || value == false) {
        return (
          <View style={{ flexDirection: "row", marginTop: 5, marginLeft: 10 }}>
            <MCIcon
              name="needle"
              size={20}
              color={COLORS.primary}
              style={{ marginLeft: 15, alignSelf: "center" }}
            />
            <Text
              style={{
                fontSize: 18,
                marginLeft: 10,
                margin: 5,
                color: COLORS.darkgrey,
              }}
            >
              {value ? "Shots up-to-date" : "Needs shots"}
            </Text>
          </View>
        );
      } else return null;
    }
  }

  return (
    <View style={{ flexDirection: "row", marginTop: 10 }}>
      <Text
        h3
        style={{
          marginLeft: 15,
          marginVertical: 10,
          fontWeight: "bold",
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

export default Attribute;
