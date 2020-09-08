import React, { useEffect, useState, useCallback } from "react";
import MapView, { Marker } from "react-native-maps";
import { View, Text, Dimensions, AsyncStorage, StyleSheet } from "react-native";
import petfinder from "../api/petfinder";
import * as Location from "expo-location";

//TODO: Fix marker list to allow multiple markers on the mapview at once
//TODO: use 'Zoom to Specified Markers' to focus the map after markers are loaded

const MapsScreen = ({ route, navigation }) => {
  const [results, setResults] = useState([]);
  const [markers, setMarkers] = useState([]);

  let { location } = route.params;
  let lat = location?.lat;
  let long = location?.long;

  useEffect(() => {
    if (location == undefined) {
      alert("Couldn't find your location");
    } else {
      searchShelters();
    }
  }, [location]);

  useEffect(() => {
    if (markers.length <= 1) {
      console.log("Mapping new markers...");
      addMarkers();
    }
  }, [results]);

  const addMarker = (newMarker) => setMarkers([...markers, newMarker]);
  const mapMarkers = () => {
    return markers.map(() => {});
  };

  const searchShelters = async () => {
    petfinder
      .get(`organizations?location=${lat},${long}&limit=5`, {
        headers: {
          Authorization: `Bearer ${(
            await AsyncStorage.getItem("token")
          ).toString()}`,
        },
      })
      .then((response) => {
        console.log(response.data.organizations[0]);
        setResults(response.data.organizations);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
        }
      });
  };

  const addMarkers = () => {
    results.map((org) => {
      Location.geocodeAsync(org.address.postcode).then((coords) => {
        console.log(
          org.name + ": " + coords[0].latitude + ", " + coords[0].longitude
        );
        addMarker(
          <Marker
            key={org.id}
            coordinate={{
              latitude: coords[0].latitude,
              longitude: coords[0].longitude,
            }}
            title={org.name}
          ></Marker>
        );
      });
    });
  };

  return (
    <View>
      <MapView
        style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
        }}
        initialRegion={{
          latitude: lat,
          longitude: long,
          latitudeDelta: 0.05,
          longitudeDelta: 0.1,
        }}
      >
        {mapMarkers()}
      </MapView>
      <View
        style={{
          height: Dimensions.get("window").height * 0.25,
          width: Dimensions.get("window").width * 0.9,
          position: "absolute",
          bottom: Dimensions.get("window").height * 0.1,
          left: Dimensions.get("window").width * 0.05,
          backgroundColor: "white",
          borderRadius: 15,
        }}
      >
        <Text style={styles.titleStyle}>{results[0]?.name}</Text>
        <Text style={styles.subtitleStyle}>
          {results[0]?.address?.address1}, {results[0]?.address?.city},{" "}
          {results[0]?.address?.state}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  titleStyle: {
    padding: 10,
    fontSize: 22,
    textAlign: "center",
    fontWeight: "bold",
  },
  subtitleStyle: {
    padding: 10,
    fontSize: 18,
    textAlign: "center",
  },
});

export default MapsScreen;
