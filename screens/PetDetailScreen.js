import React from "react";
import { View, StyleSheet, Image, Dimensions } from "react-native";
import { Text } from "react-native-elements";
import ListComponent from "../components/ListComponent";
import SearchHeader from "../components/SearchHeader";

const PetDetailScreen = ({ route, navigation }) => {
  const screenWidth = Math.round(Dimensions.get("window").width);
  const { item } = route.params;

  return (
    <View>
      <View>
        <Image
          source={item.src}
          style={{ height: screenWidth, width: screenWidth }}
        />
      </View>
      <View style={{}}>
        <Text h4 style={{ marginHorizontal: 10, marginVertical: 10 }}>
          {item.title}
        </Text>
        <Text style={{ fontSize: 18, marginLeft: 10 }}>{item.breed}</Text>
      </View>
    </View>
  );
};

var styles = StyleSheet.create({});

export default PetDetailScreen;
