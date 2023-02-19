import React, { useEffect, useState, useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import { View, Dimensions, StyleSheet } from "react-native";
import { Card, Text, Button } from "react-native-elements";
import petfinder from "../api/petfinder";
import * as Location from "expo-location";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { COLORS } from "../assets/colors";
import * as RootNavigation from "../navigationRef";
import { storage } from "../utils/storage";

//TODO: use 'Zoom to Specified Markers' to focus the map after markers are loaded

function find(arr, ind) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].key == ind) return i;
  }
  return 0;
}

const MapsScreen = ({ route }) => {
  const [results, setResults] = useState([]);
  const [loadingMarkers, setLoadingMarkers] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  let mapRef = useRef();
  let carRef = useRef();
  const [markers, setMarkers] = useState([]);

  const [page, setPage] = useState(0);

  let { location } = route.params;
  let lat = location?.lat;
  let long = location?.long;

  useEffect(() => {
    if (location == null || location == undefined) {
      alert("Couldn't find your location");
    } else if (results.length < 1 && !loadingSearch) {
      setLoadingSearch(true);
      searchShelters();
    } else {
      console.log("Location changed");
    }
  }, []);

  const searchShelters = async () => {
    petfinder
      .get(`organizations?location=${lat},${long}&limit=5&sort=distance`, {
        headers: {
          Authorization: `Bearer ${storage.getString('token')}`,
        },
      })
      .then((response) => {
        //console.log(response.data.organizations[0]);
        if (response.data.organizations) {
          setResults(response.data.organizations);
        }
        setLoadingSearch(false);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
        }
        setLoadingSearch(false);
      });
  };

  useEffect(() => {
    addMarkers();
  }, [results]);

  useEffect(() => {
    console.log("Total markers:" + markers.length);
    //if (markers.length != results.length && !loadingMarkers)
    //addMarkers();
  }, [markers]);

  const addMarkers = () => {
    if (loadingMarkers == false) {
      setLoadingMarkers(true);
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
            key: index,
            coordinate: {
              latitude: coords[0].latitude,
              longitude: coords[0].longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.06,
            },
            address: {
              address1: org.address?.address1,
              address2: org.address?.address2,
              city: org.address?.city,
              state: org.address?.state,
            },
            title: org.name,
          },
        ]);
      });
      setLoadingMarkers(false);

      console.log(
        "markers: " + markers.length + ", results: " + results.length
      );
    }
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
          <Text h5 style={{ fontWeight: "bold" }}>
            {item.name}
          </Text>
          <Text>
            {item.address?.address1 ? item.address?.address1 + ", " : null}
            {item.address?.address2 ? item.address?.address2 + ", " : null}
            {item.address?.city ? item.address?.city + ", " : null}
            {item.address?.state ? item.address?.state : null}
          </Text>
          <Button
            type="solid"
            title="View Pets"
            style={{ marginTop: 10 }}
            onPress={() => {
              RootNavigation.navigate("ShelterList", { item });
            }}
          />
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
          latitudeDelta: 0.2,
          longitudeDelta: 0.4,
        }}
        showsUserLocation
      >
        {markers.map((mark) => (
          <Marker
            key={mark.key}
            coordinate={mark.coordinate}
            title={mark.title}
            onPress={() => {
              //setPage(mark.key);
              mapRef?.animateToRegion(mark.coordinate, 500);
              carRef?.snapToItem(mark.key);
            }}
            pinColor={COLORS.primarylight}
          />
        ))}
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
            mapRef?.animateToRegion(
              markers[find(markers, index)].coordinate,
              500
            );
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
