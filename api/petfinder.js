import axios from "axios";
import { storage } from "../utils/storage";

let prodkey = "***REMOVED***";
let prodsecret = "***REMOVED***";

export default axios.create({
  baseURL: "https://api.petfinder.com/v2/",
});

export function getId() {
  if (__DEV__) {
    return { key: prodkey, secret: prodsecret };
  } else {
    return { key: prodkey, secret: prodsecret };
  }
}

export async function searchApi({ location, type, age, distance, breed, page}) {
  let search = "";
  

  const this_search = {
    location,
    type,
    age,
    distance,
    breed,
  };

  search = `animals?type=${type}&limit=50&location=${location.latitude},${location.longitude}&sort=distance&age=${age}&distance=${distance}&breed=${breed}&page=${page}`;

  return petfinder
    .get(search, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      
      storage.set(
        "lastpets",
        JSON.stringify(response.data.animals)
      );
      storage.set("lastsearch", JSON.stringify(this_search));
      return (response.data.animals);
    })
    .catch(async function (error) {
      if (error.response.data.status == 401) {
        requestAccess();
      }
      return error;
    });
};