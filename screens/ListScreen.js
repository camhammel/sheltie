import React, { useState, useEffect, useContext } from "react";
import { View, Text, AsyncStorage } from "react-native";
import ListComponent from "../components/ListComponent";
import SearchHeader from "../components/SearchHeader";
import petfinder, { setToken } from "../api/petfinder";
import { Context as TokenContext } from "../context/TokenContext";

const ListScreen = ({ navigation }) => {
  const { update_token } = useContext(TokenContext);
  const [term, setTerm] = useState("");
  const [results, setResults] = useState([]);

  const searchApi = async () => {
    console.log("Got here...");
    update_token();
    console.log("Got here too...");
    console.log(
      "Token value in storage is: " +
        (await AsyncStorage.getItem("token")).toString()
    );

    console.log(
      "Retrieved this: " + (await AsyncStorage.getItem("token")).toString()
    );
    petfinder
      .get("animals?type=dog&limit=20&location=32312", {
        headers: {
          Authorization: `Bearer ${(
            await AsyncStorage.getItem("token")
          ).toString()}`,
        },
      })
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
        <Text>
          We have found {results.length} results for {term}.
        </Text>
        <ListComponent results={results} />
      </View>
    </View>
  );
};

export default ListScreen;
