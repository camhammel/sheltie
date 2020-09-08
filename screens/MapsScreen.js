import React, { useEffect, useState, useCallback } from "react";
import MapView, { Marker } from "react-native-maps";
import { View, Text, Dimensions, AsyncStorage, StyleSheet } from "react-native";
import petfinder from "../api/petfinder";
import * as Location from "expo-location";

//TODO: pass in current location from ListScreen to set initialRegion
//TODO: use 'Zoom to Specified Markers' to focus the map after markers are loaded

const MapsScreen = ({ route, navigation }) => {
  const [shelters, setShelters] = useState([{}]);
  const [markers, setMarkers] = useState([{}]);

  let { location } = route.params;
  let lat = location?.lat;
  let long = location?.long;
  let results = [];

  useEffect(() => {
    if (location == undefined) {
      alert("Couldn't find your location");
    } else {
      searchShelters();
    }
  }, [location]);

  useEffect(() => {
    //TODO: REPEAT FOR EACH SHELTER IN LIST
    Location.geocodeAsync(shelters[0]?.address?.postcode).then((coords) => {
      console.log(coords[0]?.latitude);
      () => {
        setMarkers([
          ...markers,
          <Marker
            coordinate={{
              latitude: coords[0]?.latitude,
              longitude: coords[0]?.longitude,
            }}
            title={shelters[0]?.name}
            identifier={shelters[0]?.id}
          />,
        ]);
      };
    });
  }, [shelters]);

  //TODO: Retrieve lats and longs from shelter addresses using the Expo Geocoding library
  //TODO: Create 'markers' in state as an array of Marker objects from latitude and longitude provided by shelter call

  const searchShelters = async () => {
    petfinder
      .get(`organizations?location=${lat},${long}`, {
        headers: {
          Authorization: `Bearer ${(
            await AsyncStorage.getItem("token")
          ).toString()}`,
        },
      })
      .then((response) => {
        console.log(response.data.organizations[0]);
        results.push(response.data.organizations);
        setShelters(response.data.organizations);
        //triggerUpdate = !triggerUpdate;
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
        }
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
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0922,
        }}
      >
        {markers.map((marker) => (
          <Marker coordinate={marker.coordinate} title={marker.title} />
        ))}
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
        <Text style={styles.titleStyle}>{shelters[0]?.name}</Text>
        <Text style={styles.subtitleStyle}>
          {shelters[0]?.address?.address1}, {shelters[0]?.address?.city},{" "}
          {shelters[0]?.address?.state}
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
