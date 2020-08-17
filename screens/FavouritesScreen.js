import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, AsyncStorage } from "react-native";
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
      console.log("FavIds: " + parsedIds);
      await searchFavs();
    })();

    return () => {};
    //Update the state you want to be updated
  }, [isFocused]);

  const searchFavs = async () => {
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
          .catch((error) => {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              console.log(error.response.data);
              //console.log(error.response.status);
              //console.log(error.response.headers);
            } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              console.log(error.request);
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log("Error", error.message);
            }
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
      <ListComponent results={results} refresh={searchFavs()} />
    </View>
  );
};

const styles = StyleSheet.create({});

export default FavouritesScreen;
