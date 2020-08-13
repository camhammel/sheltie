import React, { useState, useContext, useEffect } from "react";
import { View, Text, AsyncStorage, StyleSheet } from "react-native";
import ListComponent from "../components/ListComponent";
import SearchHeader from "../components/SearchHeader";
import petfinder from "../api/petfinder";
import { Context as TokenContext } from "../context/TokenContext";
import * as Location from "expo-location";
import { COLORS } from "../assets/colors";

const ListScreen = ({ navigation }) => {
  const { update_token } = useContext(TokenContext);
  const [term, setTerm] = useState("");
  const [location, setLocation] = useState(null);
  const [results, setResults] = useState([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
      }

      let location = await Location.getCurrentPositionAsync({});
      console.log(
        "location: " +
          location.coords.latitude +
          "," +
          location.coords.longitude
      );
      setLocation(location);
      //searchApi();
    })();
  }, []);

  useEffect(() => {
    searchApi();
  }, [location]);

  const searchApi = async () => {
    update_token();
    console.log(
      "Token value in storage is: " +
        (await AsyncStorage.getItem("token")).toString()
    );

    petfinder
      .get(
        `animals?&limit=50&location=${location.coords.latitude},${location.coords.longitude}&sort=distance`,
        {
          headers: {
            Authorization: `Bearer ${(
              await AsyncStorage.getItem("token")
            ).toString()}`,
          },
        }
      )
      .then((response) => {
        setResults(response.data.animals);
        console.log(response.data.animals);
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
    <View style={{ justifyContent: "flex-start", flex: 1, borderWidth: 0 }}>
      <View
        style={{
          backgroundColor: "white",
          borderColor: "lightgrey",
          borderWidth: 0,
        }}
      >
        <SearchHeader searchApi={searchApi} term={term} setTerm={setTerm} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.resultStyle}>{results.length} results found</Text>
        <ListComponent results={results} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  resultStyle: {
    backgroundColor: "#ffffff",
    paddingLeft: 10,
    paddingVertical: 5,
    color: "grey",
    fontSize: 16,
    textAlign: "center",
    borderBottomColor: "grey",
    borderBottomWidth: 1,
  },
});
export default ListScreen;
