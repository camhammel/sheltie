import React from "react";
import { View, StyleSheet, Image, Dimensions } from "react-native";
import { Text } from "react-native-elements";
import { Asset } from "expo-asset";

const defaultURI = Asset.fromModule(require("../assets/logo.png")).uri;

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const PetDetailScreen = ({ route, navigation }) => {
  const screenWidth = Math.round(Dimensions.get("window").width);
  const { item } = route.params;

  return (
    <View>
      <View>
        <Image
          source={{
            uri: item?.photos?.[0]?.large ?? defaultURI,
          }}
          style={{ height: screenWidth, width: screenWidth }}
        />
      </View>
      <View style={{}}>
        <Text h4 style={{ marginHorizontal: 10, marginVertical: 10 }}>
          {capitalizeFirstLetter(item.name.toLowerCase())}
        </Text>
        <Text style={{ fontSize: 18, marginLeft: 10 }}>
          {item.breeds.primary}
        </Text>
      </View>
    </View>
  );
};

var styles = StyleSheet.create({});

export default PetDetailScreen;
