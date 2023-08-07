import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import ListComponent from "../components/ListComponent";
import { storage } from "../utils/storage";

const FavouritesScreen = () => {
  const [results, setResults] = useState([]);

  const isFocused = useIsFocused();

  useEffect(() => {
    setResults(JSON.parse(storage.getString("favourites")));

    return () => {};
  }, [isFocused]);

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

export default FavouritesScreen;
