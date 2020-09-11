import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, AsyncStorage } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import ListComponent from "../components/ListComponent";
import petfinder from "../api/petfinder";

//TODO: test cache results of favourites

const FavouritesScreen = () => {
  let favIds = [0];
  let parsedIds;
  const [loading, setLoading] = useState("false");
  const [results, setResults] = useState([]);

  const isFocused = useIsFocused();

  useEffect(() => {
    (async () => {
      if (loading == "false") {
        setLoading("true");
        setResults(await AsyncStorage.getItem("favouritesAnimals"));
        favIds = await AsyncStorage.getItem("favourites");
        parsedIds = JSON.parse(favIds);
        if (results.length < 1 || results.length != parsedIds.length)
          await searchFavs();
        setLoading("false");
      }
    })();

    return () => {};
    //Update the state you want to be updated
  }, [isFocused]);

  const searchFavs = async () => {
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
          .catch((error) => {
            if (error.response) {
            }
          })
      );
    }

    Promise.all(promises).then(() => {
      setResults(animals);
      AsyncStorage.setItem("favouritesAnimals", animals);
    });
  };
  return (
    <View style={{ flex: 1 }}>
      <ListComponent results={results} refresh={searchFavs()} />
    </View>
  );
};

const styles = StyleSheet.create({});

export default FavouritesScreen;
