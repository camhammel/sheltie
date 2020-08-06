import React, { useState, useEffect } from "react";
import {
  View,
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

const defaultURI = Asset.fromModule(require("../assets/logo.png")).uri;

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const PetDetailScreen = ({ route, navigation }) => {
  const [results, setResults] = useState(null);
  const screenWidth = Math.round(Dimensions.get("window").width);
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

  return (
    <View>
      {results ? (
        <View style={{ backgroundColor: "white" }}>
          <View>
            <Image
              source={{
                uri: results?.photos?.[0]?.large ?? defaultURI,
              }}
              style={{ height: screenWidth, width: screenWidth }}
            />
          </View>
          <View>
            <Text h4 style={{ marginHorizontal: 10, marginVertical: 10 }}>
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
                {results.description}
              </Text>
            </Spacer>
          </View>
        </View>
      ) : null}
    </View>
  );
};

export default PetDetailScreen;
