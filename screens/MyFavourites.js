import React from "react";
import ListComponent from "../components/ListComponent";

const MyFavourites = () => {
  const searchFavs = async (favIds) => {
    update_token();
    console.log(
      "Token value in storage is: " +
        (await AsyncStorage.getItem("token")).toString()
    );

    for (i = 0; i < favIds.length; i++) {
      petfinder
        .get(`animals/${favIds[i]}`, {
          headers: {
            Authorization: `Bearer ${(
              await AsyncStorage.getItem("token")
            ).toString()}`,
          },
        })
        .then((response) => {
          setResults(...results, response.data);
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
    }
  };

  return <ListComponent />;
};

export default MyFavourites;
