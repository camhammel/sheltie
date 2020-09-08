import React, { useEffect, useState, useCallback } from "react";
import MapView, { Marker } from "react-native-maps";
import { View, Dimensions, AsyncStorage, StyleSheet } from "react-native";
import { Card, Text, Button } from "react-native-elements";
import petfinder from "../api/petfinder";
import * as Location from "expo-location";
import ShelterInfo from "../components/ShelterInfo";
import { FlatList } from "react-native-gesture-handler";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { COLORS } from "../assets/colors";

//TODO: Fix marker list to allow multiple markers on the mapview at once
//TODO: use 'Zoom to Specified Markers' to focus the map after markers are loaded

const MapsScreen = ({ route, navigation }) => {
  const [results, setResults] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [page, setPage] = useState(0);

  let { location } = route.params;
  let lat = location?.lat;
  let long = location?.long;

  // const mapMarkers = () => {
  //   return markers.map((m) => {
  //     <Marker coordinate={m?.coordinate} title={m?.title} key={m?.key} />;
  //   });
  // };

  useEffect(() => {
    if (location == undefined) {
      alert("Couldn't find your location");
    } else {
      searchShelters();
    }
  }, [location]);

  const searchShelters = async () => {
    petfinder
      .get(`organizations?location=${lat},${long}&limit=10`, {
        headers: {
          Authorization: `Bearer ${(
            await AsyncStorage.getItem("token")
          ).toString()}`,
        },
      })
      .then((response) => {
        console.log(response.data.organizations[0]);
        if (response.data.organizations)
          setResults(response.data.organizations);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
        }
      });
  };

  useEffect(() => {
    if (markers.length <= 1) {
      console.log("Mapping new markers...");
      addMarkers();
    }
  }, [results]);

  const addMarker = (newMarker) => {
    setMarkers([...markers, newMarker]);
  };

  const addMarkers = () => {
    results.map((org, index) => {
      Location.geocodeAsync(org?.address?.postcode).then((coords) => {
        console.log(
          org.name + ": " + coords[0].latitude + ", " + coords[0].longitude
        );
        addMarker(
          <Marker
            key={index + ""}
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

  const renderItem = ({ item }) => {
    return (
      <Card
        style={{
          width: Dimensions.get("screen").width,
          height: Dimensions.get("screen").width,
        }}
      >
        <Text h4>{item.name}</Text>
        <Text h6>{item.email}</Text>
        <Button type="solid" title="View Pets" style={{ marginTop: 10 }} />
        {/* <ShelterInfo organization_id={item?.id} pet_name={item?.name} /> */}
      </Card>
    );
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
        {markers}
      </MapView>
      <View style={styles.mapOverlayStyle}>
        {/* <Text style={styles.titleStyle}>{results[0]?.name}</Text>
        <Text style={styles.subtitleStyle}>
          {results[0]?.address?.address1}, {results[0]?.address?.city},{" "}
          {results[0]?.address?.state}
        </Text> */}
        <Carousel
          sliderWidth={Dimensions.get("window").width}
          sliderHeight={Dimensions.get("window").width}
          itemWidth={Dimensions.get("window").width}
          data={results}
          renderItem={renderItem}
          //hasParallaxImages={true}
          pagingEnabled={true}
          onSnapToItem={(index) => setPage(index)}
        />
        <Pagination
          dotsLength={results.length}
          activeDotIndex={page}
          inactiveDotColor={COLORS.primarylight}
          dotColor={COLORS.primary}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
          containerStyle={{ paddingVertical: 0, paddingTop: 20 }}
        />
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
  mapOverlayStyle: {
    height: Dimensions.get("window").height * 0.3,
    width: Dimensions.get("window").width,
    position: "absolute",
    bottom: Dimensions.get("window").height * 0.1,
    left: Dimensions.get("window").width * 0.001,
    backgroundColor: "transparent",
  },
});

export default MapsScreen;
