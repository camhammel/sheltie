import React, { useState, useLayoutEffect, useEffect, useContext } from "react";
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
import { HeaderBackButton } from "@react-navigation/elements";
import { useQuery } from "@tanstack/react-query";
import AppSkeleton from "../components/Skeleton";

const screenWidth = Math.round(Dimensions.get("window").width);

function capitalizeFirstLetter(string = "") {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const PetDetailScreen = ({ route, navigation }) => {
  const { addfav, checkfav, removefav } = useContext(Context);
  const [page, setPage] = useState(0);
  const [email, setEmail] = useState("");
  const { id } = route.params;
  const [favourited, setFavourited] = useState(false);
  const [guest, setGuest] = useState("true");

  useLayoutEffect(() => {
    (async () => {
      if (!navigation.canGoBack()) {
        navigation.setOptions({
          headerTitleStyle: { color: "transparent" },
          headerLeft: (props) => (
            <HeaderBackButton
              {...props}
              label="Back"
              onPress={() =>
                navigation.reset({
                  index: 0,
                  routes: [{ name: "List" }],
                })
              }
            />
          ),
        });
      } else {
        navigation.setOptions({
          headerTitleStyle: { color: "transparent" },
          headerBackTitle: "Back",
        });
      }
      if (storage.getBoolean("guest")) {
        setGuest("true");
      } else {
        setGuest("false");
        setEmail(storage.getString("email"));
      }
    })();
  }, [route.params.id]);

  useLayoutEffect(() => {
    (async () => {
      if (email && id) setFavourited(await checkfav({ email, petid: id }));
    })();
  }, [email]);

  const {
    data: results,
    isError,
    error,
  } = useQuery({
    queryKey: ["getPet", id],
    queryFn: () => petfinder.get(`petfinder/animals/${id}`),
    select: (data) => {
      return data?.data?.animal;
    },
    enabled: !!id,
  });

  useEffect(() => {
    updateHeader(results?.name);
  }, [results]);

  useEffect(() => {
    if (isError) {
      handleFetchPetError();
    }
  }, [isError]);

  async function handleFetchPetError() {
    console.error("Failed to fetch pet details", error);
    Alert.alert(
      "Error",
      "Failed to fetch pet details. This pet may no longer be available."
    );
    await navigation.navigate("List");
  }

  const updateHeader = (name = "") => {
    navigation.setOptions({
      headerTitle: capitalizeFirstLetter(name.toLowerCase()),
      headerTitleStyle: {
        color: "white",
        fontFamily: "Yellowtail",
        fontSize: 28,
        paddingVertical: 5,
        paddingHorizontal: 15,
      },
    });
  };

  const onShare = async () => {
    try {
      await Share.share({
        message: `I was browsing Sheltie and found ${results.name}!`,
        title: `Meet ${results.name}`,
        url:
          Platform.OS === "ios"
            ? `https://sheltie.app/pet/${results.id}`
            : undefined,
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
      {results && results !== undefined ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          backgroundColor="white"
        >
          {results.photos?.length > 0 && (
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
          )}
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
                      const { id, name, breeds, photos: allPhotos } = results;
                      const photos = [{ small: allPhotos[0].small }];
                      {
                        favourited
                          ? removefav({ email, petid: id })
                          : addfav({
                              email,
                              pet: { id, name, breeds, photos },
                            });
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
                {results.breeds?.primary} {results.breeds?.mixed ? "Mix" : null}
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
                {results.contact?.address.city},{" "}
                {results.contact?.address.state}
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
            <Attribute type="declawed" value={results.attributes?.declawed} />
            <Attribute
              type="spayed"
              value={results.attributes?.spayed_neutered}
              gender={results.gender}
            />
            <Attribute
              type="house_trained"
              value={results.attributes?.house_trained}
            />
            <Attribute type="shots" value={results.attributes?.shots_current} />
            <ShelterInfo
              organization_id={results.organization_id}
              pet_name={results.name}
            />
            <View style={{ marginBottom: 40 }} />
          </View>
        </ScrollView>
      ) : (
        <View style={{ margin: 16, maxHeight: "100%" }}>
          <View style={{ marginHorizontal: 16 }}>
            <AppSkeleton
              height={styles.item.height + 60}
              style={{ borderRadius: 16 }}
            />
          </View>
          <AppSkeleton
            height={8}
            width="50%"
            style={{ alignSelf: "center", marginTop: 8 }}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              marginTop: 32,
            }}
          >
            <AppSkeleton height={48} width="60%" />
            <AppSkeleton height={48} width="20%" />
          </View>
          <AppSkeleton height={24} width="60%" style={{ marginTop: 8 }} />
          <AppSkeleton height={24} width="40%" style={{ marginTop: 8 }} />
          <AppSkeleton height="100%" width="100%" style={{ marginTop: 16 }} />
        </View>
      )}
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
    borderRadius: 16,
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
