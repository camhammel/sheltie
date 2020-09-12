import axios from "axios";
import { AsyncStorage } from "react-native";
import { getId } from "../api/petfinder";

const requestAccess = async () => {
  await retrieveToken();
};

async function retrieveToken() {
  const instance = axios.create();

  instance
    .request(tokenConfig)
    .catch(function (error) {})
    .then(async (response) => {
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
    client_id: getId().key,
    client_secret: getId().secret,
  },
};

export default requestAccess;
