import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getId } from "../api/petfinder";

const requestAccess = async () => {
  await retrieveToken();
};

const tokenConfig = {
  baseURL: "https://api.petfinder.com/v2/",
  url: "oauth2/token",
  method: "post",
  data: {
    grant_type: "client_credentials",
    client_id: getId().key,
    client_secret: getId().secret,
  },
};

async function retrieveToken() {
  const instance = axios.create();

  instance
    .request(tokenConfig)
    .then(async (response) => {
      if (response?.data?.access_token) {
        await AsyncStorage.setItem(
          "token",
          response.data.access_token.toString()
        );
      } else {
        throw new Error('Could not retrieve access token from petfinder API');
      }
    })
    .catch(function (error) {
      console.error('error', error);
    });

  return;
}



export default requestAccess;
