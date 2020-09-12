import React, { useEffect, useState } from "react";
import { View, AsyncStorage } from "react-native";
import { Text } from "react-native-elements";
import petfinder from "../api/petfinder";
import ListComponent from "../components/ListComponent";

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
      searchApi();
    }
  }, []);

  const searchApi = async () => {
    petfinder
      .get(query, {
        headers: {
          Authorization: `Bearer ${(
            await AsyncStorage.getItem("token")
          ).toString()}`,
        },
      })
      .then((response) => {
        console.log(response.data.animals);
        //animals = response.data.animals;
        setResults(JSON.parse(response.data.animals));
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <View style={{ flex: 1 }}>
      <ListComponent results={results} refresh={searchApi()} />
    </View>
  );
};

export default ShelterListScreen;
