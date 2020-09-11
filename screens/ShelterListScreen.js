import React, { useEffect, useState, useRef } from "react";
import { View, Dimensions, AsyncStorage, StyleSheet } from "react-native";
import { Card, Text, Button } from "react-native-elements";
import petfinder from "../api/petfinder";
import ListComponent from "../components/ListComponent";

const ShelterListScreen = ({ navigation, route }) => {
  let { item } = route.params;
  const [results, setResults] = useState([]);
  let query = "animals?organization=" + item.id;

  const searchApi = async () => {
    let animals = [];

    petfinder
      .get(query, {
        headers: {
          Authorization: `Bearer ${(
            await AsyncStorage.getItem("token")
          ).toString()}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        animals = response.data.animals;
        setResults(response.data.animals);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitleStyle: { color: "white" },
      headerBackTitle: "Back",
      headerTitle: item?.name,
    });
    searchApi();
  }, []);
  return (
    <View>
      <Text>{item?.id}</Text>
      <View style={{ flex: 1 }}>
        <ListComponent results={results} refresh={searchApi()} />
      </View>
    </View>
  );
};

export default ShelterListScreen;
