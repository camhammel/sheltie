import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  AsyncStorage,
  Image,
  Dimensions,
} from "react-native";
import { Text } from "react-native-elements";
import { Asset } from "expo-asset";
import petfinder from "../api/petfinder";
import Spacer from "../components/Spacer";
import TagComponent from "../components/TagComponent";
import { COLORS } from "../assets/colors";
import NavLink from "../components/NavLink";
import Carousel, {
  Pagination,
  ParallaxImage,
} from "react-native-snap-carousel";

const defaultURI = Asset.fromModule(require("../assets/logo.png")).uri;

const screenWidth = Math.round(Dimensions.get("window").width);

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const PetDetailScreen = ({ route, navigation }) => {
  const [results, setResults] = useState(null);
  const [page, setPage] = useState(0);
  const { item } = route.params;

  useEffect(() => {
    (async () => {
      detailApi(item.id);
    })();
  }, []);

  const detailApi = async (id) => {
    console.log(
      "Token value in storage is: " +
        (await AsyncStorage.getItem("token")).toString()
    );

    petfinder
      .get(`animals/${id}`, {
        headers: {
          Authorization: `Bearer ${(
            await AsyncStorage.getItem("token")
          ).toString()}`,
        },
      })
      .then((response) => {
        setResults(response.data.animal);
        console.log(response.data.animal);
      })
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          //console.log(error.response.status);
          //console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
        //console.log(error.config);
      });
  };

  const renderItem = ({ item, index }, parallaxProps) => {
    return (
      <View style={{ width: screenWidth - 60, height: screenWidth }}>
        <ParallaxImage
          source={{ uri: item.large }}
          containerStyle={styles.imageContainer}
          style={styles.image}
          parallaxFactor={0.4}
          {...parallaxProps}
        />
      </View>
    );
  };

  return (
    <View>
      {results ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: "white" }}
        >
          <View>
            <Carousel
              sliderWidth={screenWidth}
              sliderHeight={screenWidth}
              itemWidth={screenWidth - 60}
              data={results.photos}
              renderItem={renderItem}
              hasParallaxImages={true}
              pagingEnabled={true}
              onSnapToItem={(index) => setPage(index)}
            />
            <Pagination
              dotsLength={results.photos.length}
              activeDotIndex={page}
              animatedDuration={100}
              inactiveDotColor={COLORS.primarylight}
              dotColor={COLORS.primary}
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.6}
            />
          </View>
          <View>
            <Text
              h4
              style={{
                marginHorizontal: 10,
                marginVertical: 10,
              }}
            >
              {capitalizeFirstLetter(results.name.toLowerCase())}
            </Text>
            <Text style={{ fontSize: 18, marginLeft: 10 }}>
              {results.breeds.primary} {results.breeds.mixed ? "Mix" : null}
            </Text>
            <Text style={{ fontSize: 18, marginLeft: 10 }}>
              {results.contact.address.city}, {results.contact.address.state}
            </Text>
            <TagComponent tags={results.tags} />
            <Spacer>
              <Text
                style={{ fontSize: 16, marginLeft: 10, color: COLORS.primary }}
              >
                {results.description.replace(/&amp;#39;/g, "'")}
              </Text>
              <NavLink
                text="More information available here via Petfinder.com"
                routeName={results.url}
              />
            </Spacer>
          </View>
        </ScrollView>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    width: screenWidth - 60,
    height: screenWidth - 60,
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
    backgroundColor: "white",
    borderRadius: 10,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "contain",
  },
});

export default PetDetailScreen;
