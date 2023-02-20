import React, { useEffect, useState } from "react";
import { View,  Alert } from "react-native";
import petfinder from "../api/petfinder";
import ListComponent from "../components/ListComponent";
import { storage } from "../utils/storage";

const ShelterListScreen = ({ navigation, route }) => {
  let { item } = route.params;
  const [results, setResults] = useState([]);
  const [isLoading, setLoading] = useState(false);
  let query = "animals?organization=" + item.id;

  useEffect(() => {
    navigation.setOptions({
      headerTitleStyle: { color: "white" },
      headerBackTitle: "Back",
      headerTitle: item?.name,
    });
    if (results.length < 1 && !isLoading) {
      setLoading(true);
    }
  }, []);

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

export default ShelterListScreen;
