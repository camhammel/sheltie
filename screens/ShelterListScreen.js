import React, { useEffect, useState, useRef } from "react";
import { View, Dimensions, AsyncStorage, StyleSheet } from "react-native";
import { Card, Text, Button } from "react-native-elements";
import petfinder from "../api/petfinder";

const ShelterListScreen = ({ navigation, route }) => {
  let { item } = route.params;

  return (
    <View>
      <Text>Shelter List</Text>
      <Text>{item?.id}</Text>
      <Text>{item?.name}</Text>
    </View>
  );
};

export default ShelterListScreen;
