import React, { useEffect, useState } from "react";
import { View, AsyncStorage, Alert } from "react-native";
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
        if (response.data.animals.length < 1) {
          Alert.alert(
            "Sorry!",
            "Looks like this shelter doesn't currently have any animals available for adoption."
          );
          setTimeout(() => {
            navigation.goBack();
          }, 1000);
        } else {
          console.log(response.data.animals);
          setResults(response.data.animals);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
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

export default ShelterListScreen;
