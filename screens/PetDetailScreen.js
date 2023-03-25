import React, { useState, useEffect, useContext } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Share,
  Platform,
  Alert,
} from "react-native";
import { Text } from "react-native-elements";
import petfinder from "../api/petfinder";
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
import ShelterInfo from "../components/ShelterInfo";
import { navigationRef } from "../navigationRef";
import { storage } from "../utils/storage";

const screenWidth = Math.round(Dimensions.get("window").width);

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const PetDetailScreen = ({ route, navigation }) => {
  const { addfav, checkfav, removefav } = useContext(Context);
  const [results, setResults] = useState(null);
  const [page, setPage] = useState(0);
  const [email, setEmail] = useState("");
  const { id } = route.params;
  const [favourited, setFavourited] = useState(false);
  const [guest, setGuest] = useState("true");
  let isSubscribed = true;

  useEffect(() => {
    (async () => {
      await detailApi(id);
      if (isSubscribed) {
        navigation.setOptions({
          headerTitleStyle: { color: "transparent" },
          headerBackTitle: "Back",
        });
      }
      if ((storage.getBoolean("guest")) && isSubscribed) {
        setGuest("true");
      } else {
        if (isSubscribed) {
          setGuest("false");
          setEmail(storage.getString("email"));
        }
      }
    })();
    return () => (isSubscribed = false);
  }, []);

  useEffect(() => {
    if (results?.name) {
      navigation.setOptions({
        headerTitle: capitalizeFirstLetter(results?.name?.toLowerCase()),
        headerTitleStyle: {
          color: "white",
          fontFamily: "Yellowtail",
          fontSize: 28,
          paddingVertical: 5,
          paddingHorizontal: 15,
        },
      });
    }
  }, [results]);

  useEffect(() => {
    (async () => {
      setFavourited(await checkfav({ email, petid: id }));
    })();
  }, [email]);

  const detailApi = async (id) => {
    petfinder
      .get(`animals/${id}`, {
        headers: {
          Authorization: `Bearer ${storage.getString('token')}`,
        },
      })
      .then((response) => {
        if (isSubscribed) {
          setResults(response.data.animal);
        }
      })
      .catch(function (error) {
        //setIsEmpty("true");
        if (error.response) {
        }
      });
  };

  const onShare = async () => {
    try {
      await Share.share({
        message: `I was browsing Sheltie and found ${results.name}!`,
        title: `Meet ${results.name}`,
        url: Platform.OS === "ios" ? `https://sheltie.app/pet/${results.id}` : undefined,
      });
    } catch (error) {
      alert(error.message);
    }
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
              style={{
                justifyContent: "space-between",
                flexDirection: "row",
              }}
            >
              <NameGender name={results.name} gender={results.gender} />
              <View
                style={{
                  flexDirection: "row",
                  alignSelf: "flex-end",
                  marginBottom: 5,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    onShare();
                  }}
                >
                  <Icon
                    name="share"
                    size={40}
                    color={COLORS.primarylight}
                    style={{ marginLeft: 15 }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    if (guest !== "true") {
                      {
                        favourited
                          ? removefav({ email, petid: results.id })
                          : addfav({ email, petid: results.id });
                      }
                      setFavourited(!favourited);
                    } else {
                      Alert.alert(
                        "Sorry!",
                        "Please sign in via the Account screen to use the favourites feature.",
                        [
                          {
                            text: "Cancel",
                            onPress: () => {},
                            style: "cancel",
                          },
                          {
                            text: "Sign in",
                            onPress: () => {
                              navigationRef.current.navigate("Signin");
                            },
                          },
                        ]
                      );
                    }
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
                {results.description
                  ? results.description
                      .replace(/&#039;/g, "'")
                      .replace(/&amp;#39;/g, "'")
                      .replace(/&amp;#34;/g, '"')
                      .replace(/&quot;/g, '"')
                  : null}
              </Text>

              <NavLink
                text={`Read more about ${capitalizeFirstLetter(
                  results.name.toLowerCase()
                )} here via Petfinder.com`}
                routeName={results.url}
                custStyle={{ marginBottom: 60 }}
              />
            </Spacer>
            <Text
              style={{
                margin: 5,
                marginLeft: 15,
                marginTop: -50,
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
            <ShelterInfo
              organization_id={results.organization_id}
              pet_name={results.name}
            />
            <View style={{ marginBottom: 40 }} />
          </View>
        </ScrollView>
      ) : null}
    </View>
  );
  //}
};

const styles = StyleSheet.create({
  item: {
    width: screenWidth - 60,
    height: screenWidth - 60,
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
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
