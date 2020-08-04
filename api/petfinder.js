import axios from "axios";
import { AsyncStorage } from "react-native";

export const setToken = async () => {
  let my_token = await AsyncStorage.getItem("token");
  // axios.interceptors.request.use(function (config) {
  //   axios.default.headers["Authorization"] = `Bearer ${my_token}`;
  //   axios.default.baseURL = "https://api.petfinder.com/v2/";
  //   return config;
  // });
  return axios;
};

export default axios.create({
  baseURL: "https://api.petfinder.com/v2/",
});
