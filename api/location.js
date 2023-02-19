import * as Location from "expo-location";

export default async function resolveCoords(location, customLocationString) {

  if (customLocation) {
    return Location.geocodeAsync(customLocationString)
    .then((cust) => {
      if (cust[0]?.latitude) {
        return cust[0];
      } else {
        throw new Error('No location found');
      }
    }).catch((err) => {
        return null;
    });
  } else {
    return location.coords;
  }
}