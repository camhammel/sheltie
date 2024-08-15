import sheltieApi from './sheltie';

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

  return sheltieApi
    .get(`petfinder/animals?${new URLSearchParams(filtered).toString()}`)
};

export async function getShelterAnimals({ id, pageParam = 1}) {
  const this_search = {
    limit: 20,
    organization: id,
    page: pageParam
  };

  let filtered = Object.fromEntries(Object.entries(this_search).filter(([_, v]) => v != null && v != [] && v != ''));

  return sheltieApi
    .get(`petfinder/animals?${new URLSearchParams(filtered).toString()}`)
};

export default sheltieApi;
