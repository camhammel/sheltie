import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import ListComponent from "../components/ListComponent";
import petfinder from "../api/petfinder";

const FavouritesScreen = () => {
  let favIds = [0];
  let parsedIds;
  const [results, setResults] = useState([]);

  const isFocused = useIsFocused();

  useEffect(() => {
    (async () => {
      favIds = await AsyncStorage.getItem("favourites");
      parsedIds = JSON.parse(favIds);
      await searchFavs();
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
    });
  };
  return (
    <View style={{ flex: 1 }}>
      <ListComponent
        results={results}
        refresh={() => {}}
        loadMoreResults={() => {}}
        isStatic={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default FavouritesScreen;
