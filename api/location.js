import * as Location from "expo-location";

export default async function resolveCoords(location, customLocationString) {
  if (customLocationString && customLocationString !== '') {
    return Location.geocodeAsync(customLocationString)
    .then((cust) => {
      if (cust[0]?.latitude) {
        return{ latitude: cust[0].latitude, longitude: cust[0].longitude };
      } else {
        throw new Error('No location found');
      }
    }).catch((err) => {
        return location;
    });
  } else {
    return location;
  }
}