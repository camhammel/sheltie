import axios from "axios";
import dayjs from "dayjs";
import { storage } from "../utils/storage";
// import { PETFINDER_KEY, PETFINDER_SECRET } from '@env';
const PETFINDER_KEY = "***REMOVED***";
const PETFINDER_SECRET = "***REMOVED***";

const petfinderApi = axios.create({
  baseURL: "https://api.petfinder.com/v2/",
})

petfinderApi.interceptors.request.use(
  function(config) {
    if (storage) {
      const token = storage.getString('token');
      if (token) {
        config.headers = { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        }
      }
    }
    return config;
  },
  function(error) {
    console.log('error', error);
    Promise.reject(error)
});

petfinderApi.interceptors.response.use(undefined, async function(error) {
  const originalRequest = error?.config;
  if (error?.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    const access_token = await retrieveToken();
    petfinderApi.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
    return petfinderApi(originalRequest);
  }
  return Promise.reject(error);
})

export async function retrieveToken() {
  return await petfinderApi
    .post("oauth2/token", {
        grant_type: "client_credentials",
        client_id: PETFINDER_KEY,
        client_secret: PETFINDER_SECRET,
      },
    )
    .then(function(response) {
      if (response?.data?.access_token) {
        storage.set(
          "token",
          response.data.access_token
        );
        return response.data.access_token;
      }
    })
    .catch(function(error) {
      console.error('error when fetching token', error);
    });
}

export async function searchApi({ location, type, age, distance, breed, pageParam = 1}) {
  const this_search = {
    type,
    limit: 20,
    sort: 'distance',
    location: `${location.latitude},${location.longitude}`,
    age,
    distance,
    breed,
    page: pageParam
  };

  let filtered = Object.fromEntries(Object.entries(this_search).filter(([_, v]) => v != null && v != [] && v != ''));

  return petfinderApi
    .get(`animals?${new URLSearchParams(filtered).toString()}`)
};

export async function getShelterAnimals({ id, pageParam = 1}) {
  const this_search = {
    limit: 20,
    organization: id,
    page: pageParam
  };

  let filtered = Object.fromEntries(Object.entries(this_search).filter(([_, v]) => v != null && v != [] && v != ''));

  return petfinderApi
    .get(`animals?${new URLSearchParams(filtered).toString()}`)
};

export default petfinderApi;
