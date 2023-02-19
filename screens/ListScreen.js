import React, { useState, useEffect, useRef } from "react";
import { storage } from '../utils/storage';
import {
  View,
  StyleSheet,
  Alert,
} from "react-native";
import { Text } from "react-native-elements";
import Location from 'expo-location';
import ListComponent from "../components/ListComponent";
import SearchHeader from "../components/SearchHeader";
import petfinder from "../api/petfinder";

const ListScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [results, setResults] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const flatListRef = useRef();

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    if (customLocation != "") {
      navigation.setOptions({
        headerTitle: "Pets near " + customLocation,
        headerTitleStyle: { color: "white" },
      });
    } else {
      navigation.setOptions({
        headerTitle: "Nearby Pets for Adoption",
        headerTitleStyle: { color: "white" },
      });
    }
    if (
      (!results || results.length <= 0) &&
      (location != null || customLocation != "")
    ) {
    }
  }, [location, customLocation]);

  const setFiltersFromStorage = () => {
    let temp2 = JSON.parse(storage.getString("lastsearch"));
    if ((temp2) != null) {
      setCustomLocation(temp2.customLocation);
      setAge(temp2.age);
      setDistance(temp2.distance);
      setType(temp2.type);
      setBreed(temp2.breed);
    } else {
      setType("Dog");
      setModalVisible(true);
      setTimeout(() => {
        Alert.alert(
          "Search Filters",
          "Use these filters to help narrow down your search. When you're ready, click 'Search'. "
        );
      }, 750);
    }
  }

  useEffect(() => {
    (async () => {
      let temp = JSON.parse(storage.getString("lastpets"));
      setResults(temp);

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied. Try again.");
      }

      let location2 = await Location.getLastKnownPositionAsync({});
      if (location2 !== null)
        setLocation(location2);

      
    })();
  }, []);

  return (
    <View style={{ justifyContent: "flex-start", flex: 1, borderWidth: 0 }}>
      <View
        style={{
          backgroundColor: "white",
          borderColor: "lightgrey",
          borderWidth: 0,
        }}
      >
        <SearchHeader
          onPress={() => toggleModal()}
          location={{
            lat: location?.coords?.latitude,
            long: location?.coords?.longitude,
          }}
        />
      </View>
      <View style={{ flex: 1 }}>
        {results ? (
          <Text style={styles.resultStyle}>{results.length} results</Text>
        ) : null}
        <ListComponent
          results={results}
          loadMoreResults={loadMoreResults}
          refresh={searchApi}
          ref={flatListRef}
        />
      </View>
      <SearchModal isVisible={isModalVisible}/>
    </View>
  );
};

const styles = StyleSheet.create({
  resultStyle: {
    height: 30,
    backgroundColor: "white",
    textAlign: "center",
    fontSize: 16,
    color: "grey",
    paddingTop: 5,
  },
});
export default ListScreen;
