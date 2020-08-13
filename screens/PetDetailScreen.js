import React, { useState, useEffect, useContext } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  AsyncStorage,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Text } from "react-native-elements";
import { Asset } from "expo-asset";
import petfinder from "../api/petfinder";
import sheltieApi from "../api/sheltie";
import Spacer from "../components/Spacer";
import TagComponent from "../components/TagComponent";
import { COLORS } from "../assets/colors";
import NavLink from "../components/NavLink";
import Carousel, {
  Pagination,
  ParallaxImage,
} from "react-native-snap-carousel";
import Icon from "react-native-vector-icons/Entypo";
import NameGender from "../components/NameGender";
import FAIcon from "react-native-vector-icons/FontAwesome";
import Attribute from "../components/Attribute";
import { Context } from "../context/AuthContext";

const defaultURI = Asset.fromModule(require("../assets/logo.png")).uri;

const screenWidth = Math.round(Dimensions.get("window").width);

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const PetDetailScreen = ({ route, navigation }) => {
  const { togglefav, checkfav } = useContext(Context);
  const [results, setResults] = useState(null);
  const [page, setPage] = useState(0);
  const [email, setEmail] = useState("");
  const { item } = route.params;
  const [favourited, setFavourited] = useState(false);

  useEffect(() => {
    (async () => {
      detailApi(item.id);
      setEmail(await AsyncStorage.getItem("email"));
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setFavourited(await checkfav({ email, petid: item.id }));
    })();
  }, [email]);

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
      <View
        style={{ width: screenWidth - 60, height: screenWidth, marginTop: 10 }}
      >
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
          backgroundColor="white"
        >
          <View style={{ backgroundColor: COLORS.white }}>
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
              inactiveDotColor={COLORS.primarylight}
              dotColor={COLORS.primary}
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.6}
              containerStyle={{ paddingVertical: 0, paddingTop: 20 }}
            />
          </View>
          <View>
            <View
              style={{ justifyContent: "space-between", flexDirection: "row" }}
            >
              <NameGender name={results.name} gender={results.gender} />
              <View style={{ flexDirection: "row", alignSelf: "flex-end" }}>
                <Icon
                  name="share"
                  size={40}
                  color={COLORS.primarylight}
                  style={{ marginLeft: 15 }}
                />
                <TouchableOpacity
                  onPress={() => {
                    console.log("Heart Pressed");
                    togglefav({ email, petid: results.id });
                    setFavourited(!favourited);
                  }}
                >
                  <Icon
                    name={favourited ? "heart" : "heart-outlined"}
                    size={40}
                    color={COLORS.primarylight}
                    style={{ marginHorizontal: 20 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ flexDirection: "row", marginTop: 5 }}>
              <FAIcon
                name="paw"
                size={30}
                color={COLORS.primarylight}
                style={{ marginLeft: 15, alignSelf: "center" }}
              />
              <Text style={{ fontSize: 20, marginLeft: 8 }}>
                {results.breeds.primary} {results.breeds.mixed ? "Mix" : null}
              </Text>
            </View>
            <View style={{ flexDirection: "row", marginTop: 5 }}>
              <Icon
                name="location-pin"
                size={30}
                color={COLORS.primarylight}
                style={{ marginLeft: 15, alignSelf: "center" }}
              />
              <Text style={{ fontSize: 20, marginLeft: 5 }}>
                {results.contact.address.city}, {results.contact.address.state}
              </Text>
            </View>
            <TagComponent tags={results.tags} />
            <Spacer>
              <Text
                style={{
                  fontSize: 16,
                  marginLeft: 10,
                  color: COLORS.darkgrey,
                }}
              >
                {results.description.replace(/&amp;#39;/g, "'")}
              </Text>
            </Spacer>
            <Text
              style={{
                margin: 5,
                marginLeft: 15,
                marginTop: 10,
                fontWeight: "bold",
                fontSize: 18,
                color: COLORS.primary,
              }}
            >
              ATTRIBUTES
            </Text>
            <Attribute type="size" value={results.size} />
            <Attribute type="age" value={results.age} />
            <Attribute type="declawed" value={results.attributes.declawed} />
            <Attribute
              type="spayed"
              value={results.attributes.spayed_neutered}
              gender={results.gender}
            />
            <Attribute
              type="house_trained"
              value={results.attributes.house_trained}
            />
            <Attribute type="shots" value={results.attributes.shots_current} />
            <NavLink
              text={`Find out more about ${capitalizeFirstLetter(
                results.name.toLowerCase()
              )} here via Petfinder.com`}
              routeName={results.url}
            />
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
    //backgroundColor: COLORS.extralight,
    borderRadius: 10,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "contain",
    borderRadius: 10,
  },
  genderStyle: {
    height: 30,
    width: 50,
    resizeMode: "contain",
    alignSelf: "center",
  },
});

export default PetDetailScreen;
