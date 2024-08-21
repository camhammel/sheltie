import React, { useState, useEffect, useContext } from "react";
import { View } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import ListComponent from "../components/ListComponent";
import { storage } from "../utils/storage";
import { Context } from "../context/AuthContext";

const FavouritesScreen = () => {
  const [results, setResults] = useState([]);

  const isFocused = useIsFocused();

  const { getfavs } = useContext(Context);

  useEffect(() => {
    setResults(JSON.parse(storage.getString("favourites")));

    return () => {};
  }, [isFocused]);

  return (
    <View style={{ flex: 1 }}>
      <ListComponent
        results={results}
        refresh={() => getfavs(storage.getString("email"), false)}
        hasMoreResults={false}
        loadMoreResults={() => {}}
        isStatic={true}
      />
    </View>
  );
};

export default FavouritesScreen;
