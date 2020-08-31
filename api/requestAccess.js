import axios from "axios";
import { AsyncStorage } from "react-native";

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
    client_id: "nsXm6KGU9kjoE0RmMA6AKQ619QCPLaw476gllTP0zo7X2hn7s4",
    client_secret: "hG21DtswYAgt8102n1JzfPtIHIRORqjHQYoYAQ6h",
  },
};

export default requestAccess;
