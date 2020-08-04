import axios from "axios";

export default axios.create({
  baseURL: "https://api.petfinder.com/v2/",
});
