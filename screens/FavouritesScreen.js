import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, AsyncStorage } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import ListComponent from "../components/ListComponent";
import petfinder from "../api/petfinder";

const FavouritesScreen = () => {
  let favIds = [0];
  const [results, setResults] = useState([]);

  // useEffect(() => {
  //   (async () => {
  //     favIds = await AsyncStorage.getItem("favourites");
  //     let parsedIds = JSON.parse(favIds);
  //     console.log("FavIds: " + parsedIds);
  //     await searchFavs(parsedIds);
  //   })();
  // }, []);

  const isFocused = useIsFocused();
  useEffect(() => {
    (async () => {
      favIds = await AsyncStorage.getItem("favourites");
      let parsedIds = JSON.parse(favIds);
      console.log("FavIds: " + parsedIds);
      await searchFavs(parsedIds);
    })();
    //Update the state you want to be updated
  }, [isFocused]);

  const searchFavs = async (parsedIds) => {
    console.log(
      "Token value in storage is: " +
        (await AsyncStorage.getItem("token")).toString()
    );

    let animals = [];
    let promises = [];
    for (let i = 0; i < parsedIds.length; i++) {
      promises.push(
        petfinder
          .get(`animals/${parsedIds[i]}`, {
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
