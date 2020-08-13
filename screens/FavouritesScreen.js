import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, AsyncStorage } from "react-native";
import ListComponent from "../components/ListComponent";
import { Context as AuthContext } from "../context/AuthContext";
import petfinder from "../api/petfinder";

const FavouritesScreen = () => {
  let favIds = [0];
  const [results, setResults] = useState([]);

  useEffect(() => {
    (async () => {
      favIds = await AsyncStorage.getItem("favourites");
      favIds = JSON.parse(favIds);
      console.log("FavIds: " + favIds);
      await searchFavs(favIds);
    })();
  }, []);

  useEffect(() => {
    //searchFavs(favIds);
  }, [favIds]);

  const searchFavs = async (favIds) => {
    console.log(
      "Token value in storage is: " +
        (await AsyncStorage.getItem("token")).toString()
    );

    let animals = [];
    let promises = [];
    for (let i = 0; i < favIds.length; i++) {
      promises.push(
        petfinder
          .get(`animals/${favIds[i]}`, {
            headers: {
              Authorization: `Bearer ${(
                await AsyncStorage.getItem("token")
              ).toString()}`,
            },
          })
          .then((response) => {
            // do something with response
            animals.push(response.data.animal);
          })
      );
    }

    Promise.all(promises).then(() => {
      console.log(animals);
      setResults(animals);
    });
  };
  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.resultStyle}>{results.length} results found</Text>
      <ListComponent results={results} />
    </View>
  );
};

const styles = StyleSheet.create({
  resultStyle: {
    backgroundColor: "#ffffff",
    paddingLeft: 10,
    paddingVertical: 5,
    color: "grey",
    fontSize: 16,
    textAlign: "center",
    borderBottomColor: "grey",
    borderBottomWidth: 1,
  },
});

export default FavouritesScreen;
