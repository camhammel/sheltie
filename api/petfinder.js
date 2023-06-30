import axios from "axios";
import { storage } from "../utils/storage";


const petfinderApi = axios.create({
  baseURL: "https://api.petfinder.com/v2/",
});

petfinderApi.interceptors.request.use(
  async config => {
    const token = storage.getString('token')
    config.headers = { 
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    }
    return config;
  },
  error => {
    Promise.reject(error)
})

petfinderApi.interceptors.response.use((response) => {
  return response
}, async function (error) {
  const originalRequest = error.config;
  if (error.response.status === 403 && !originalRequest._retry) {
    originalRequest._retry = true;
    const access_token = await retrieveToken();            
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
    return petfinderApi(originalRequest);
  }
  return Promise.reject(error);
})

export default petfinderApi;

export async function retrieveToken() {
  return petfinderApi
    .post({
      url: "oauth2/token",
      data: {
        grant_type: "client_credentials",
        client_id: process.env.PETFINDER_KEY,
        client_secret: process.env.PETFINDER_SECRET,
      },
    })
    .then(async (response) => {
      if (response?.data?.access_token) {
        storage.set(
          "token",
          response.data.access_token
        );
        return response.data.access_token;
      } else {
        console.error('could not retrieve access token from petfinder API', response);
      }
    })
    .catch((error) => {
      console.error('error', error);
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