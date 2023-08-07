import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import ListComponent from "../components/ListComponent";
import petfinder from "../api/petfinder";
import { storage } from "../utils/storage";

const FavouritesScreen = () => {
  let favIds = [0];
  let parsedIds;
  const [results, setResults] = useState([]);

  const isFocused = useIsFocused();

  useEffect(() => {
    favIds = storage.getString("favourites");
    parsedIds = JSON.parse(favIds);
    searchFavs();

    return () => {};
  }, [isFocused]);

  const searchFavs = async () => {
    let animals = [];
    let promises = [];
    for (let i = 0; i < parsedIds.length; i++) {
      promises.push(
        petfinder
          .get(`animals/${parsedIds[i]}`)
          .then((response) => {
            // do something with response
            animals.push(response.data.animal);
          })
          .catch((error) => {})
      );
    }

    Promise.all(promises).then(() => {
      setResults(animals.sort((a, b) => a?.id.localeCompare(b?.id, undefined, { numeric: true })));
    });
  };
  return (
    <View style={{ flex: 1 }}>
      <ListComponent
        results={results}
        refresh={() => {}}
        loadMoreResults={() => {}}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default FavouritesScreen;
