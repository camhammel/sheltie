import React, { useEffect, useState, useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import { View, Dimensions, AsyncStorage, StyleSheet } from "react-native";
import { Card, Text, Button } from "react-native-elements";
import petfinder from "../api/petfinder";
import * as Location from "expo-location";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { COLORS } from "../assets/colors";

//TODO: use 'Zoom to Specified Markers' to focus the map after markers are loaded

const MapsScreen = ({ route }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState("false");
  let mapRef = useRef();
  let carRef = useRef();
  const [markers, setMarkers] = useState([]);

  const [page, setPage] = useState(0);

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

  const searchShelters = async () => {
    petfinder
      .get(`organizations?location=${lat},${long}&limit=10&sort=distance`, {
        headers: {
          Authorization: `Bearer ${(
            await AsyncStorage.getItem("token")
          ).toString()}`,
        },
      })
      .then((response) => {
        //console.log(response.data.organizations[0]);
        if (response?.data?.organizations)
          setResults(response.data.organizations);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
        }
      });
  };

  useEffect(() => {
    addMarkers();
  }, [results]);

  useEffect(() => {
    console.log("Total markers:" + markers.length);
    console.log("First marker key: " + markers[0]?.key);
    console.log(
      "First marker coords: " +
        markers[0]?.coordinate?.latitude +
        ", " +
        markers[0]?.coordinate?.longitude
    );
  }, [markers]);

  const addMarkers = async () => {
    if (loading == "false") {
      setLoading("true");
      results.map(async (org, index) => {
        let coords = await Location.geocodeAsync(org.address.postcode);
        console.log(
          index +
            ": " +
            org.name +
            ": " +
            coords[0].latitude +
            "," +
            coords[0].longitude
        );
        setMarkers((markers) => [
          ...markers,
          {
            key: index + "",
            coordinate: {
              latitude: coords[0].latitude,
              longitude: coords[0].longitude,
            },
            title: org.name,
          },
        ]);
      });
    }
    setLoading("false");
  };

  const renderItem = ({ item }) => {
    return (
      <Card
        style={{
          width: Dimensions.get("screen").width,
          backgroundColor: "white",
          flex: 1,
        }}
        containerStyle={{
          backgroundColor: "white",
          flex: 1,
        }}
      >
        <View
          style={{
            justifyContent: "space-evenly",
            height: Dimensions.get("screen").width * 0.4,
          }}
        >
          <Text h4>{item.name}</Text>
          <Text h6>{item.email}</Text>
          <Button type="solid" title="View Pets" style={{ marginTop: 10 }} />
        </View>
      </Card>
    );
  };

  return (
    <View>
      <MapView
        ref={(mapView) => {
          mapRef = mapView;
        }}
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
        showsUserLocation
      >
        {markers[0]?.key
          ? markers.map((mark) => (
              <Marker
                key={mark.key}
                coordinate={mark.coordinate}
                title={mark.title}
                onPress={() => {
                  mapRef?.animateToRegion(mark.coordinate, 500);
                  carRef?.snapToItem(mark.key);
                }}
              />
            ))
          : null}
      </MapView>
      <View style={styles.mapOverlayStyle}>
        <Carousel
          sliderWidth={Dimensions.get("window").width}
          sliderHeight={Dimensions.get("window").width}
          itemWidth={Dimensions.get("window").width}
          data={results}
          renderItem={renderItem}
          pagingEnabled={true}
          onSnapToItem={(index) => {
            setPage(index);
            //find way to animate to marker by key:
            //mapRef?.animateToRegion(mark.coordinate, 500);
          }}
          itemHeight={Dimensions.get("window").width * 0.7}
          ref={(carousel) => {
            carRef = carousel;
          }}
        />
        <Pagination
          dotsLength={results.length}
          activeDotIndex={page}
          inactiveDotColor={COLORS.primarylight}
          dotColor={COLORS.primary}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
          containerStyle={{
            paddingVertical: 0,
            paddingTop: 20,
            marginBottom: 20,
          }}
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
