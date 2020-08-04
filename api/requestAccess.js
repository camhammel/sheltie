import axios from "axios";
import { AsyncStorage } from "react-native";

const requestAccess = async () => {
  await retrieveToken();
};

async function retrieveToken() {
  const instance = axios.create();

  instance
    .request(tokenConfig)
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
    })
    .then(async (response) => {
      //console.log("WOO: " + response.data.access_token.toString());
      await AsyncStorage.setItem(
        "token",
        response.data.access_token.toString()
      );
    });

  return;
}

const tokenConfig = {
  baseURL: "https://api.petfinder.com/v2/",
  url: "oauth2/token",
  method: "post",
  data: {
    grant_type: "client_credentials",
    client_id: "***REMOVED***",
    client_secret: "***REMOVED***",
  },
};

export default requestAccess;
