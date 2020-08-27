import React, { useState, useContext, useEffect, useRef } from "react";
import {
  View,
  AsyncStorage,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { Text, Button, Input } from "react-native-elements";
import ListComponent from "../components/ListComponent";
import SearchHeader from "../components/SearchHeader";
import petfinder from "../api/petfinder";
import { Context as TokenContext } from "../context/TokenContext";
import * as Location from "expo-location";
import { COLORS } from "../assets/colors";
import Modal from "react-native-modal";
import MySlider from "../components/MySlider";
import DropDownPicker from "react-native-dropdown-picker";

//TODO: fix initial loading bug

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const ListScreen = ({ navigation }) => {
  const { update_token } = useContext(TokenContext);
  const [searchReq, setSearchReq] = useState("");
  const [distance, setDistance] = useState(150);
  const [age, setAge] = useState([]);
  const [type, setType] = useState("");
  const [breed, setBreed] = useState([]);
  const [breedOptions, setBreedOptions] = useState([]);
  const [location, setLocation] = useState(null);
  const [customLocation, setCustomLocation] = useState("");
  const [CustomLocationErrorMessage, setCustomLocationErrorMessage] = useState(
    ""
  );
  const [results, setResults] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isTypeVisible, setTypeVisible] = useState(false);
  const [isBreedVisible, setBreedVisible] = useState(false);
  const [isAgeVisible, setAgeVisible] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [nextPage, setNextPage] = useState(2);
  const flatListRef = useRef();
  const customLocationRef = useRef();

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    (async () => {
      setBreed([]);
      await getBreedOptions();
    })();
  }, [type]);

  const searchApi = async () => {
    setNextPage(2);
    let search = "";

    if (type != "") {
      if (customLocation != "") {
        setSearchReq(
          `animals?type=${type}&limit=50&location=${customLocation}&sort=distance&age=${age}&distance=${distance}&breed=${breed}`
        );
        search = `animals?type=${type}&limit=50&location=${customLocation}&sort=distance&age=${age}&distance=${distance}&breed=${breed}`;
      } else {
        setSearchReq(
          `animals?type=${type}&limit=50&location=${location.coords.latitude},${location.coords.longitude}&sort=distance&age=${age}&distance=${distance}&breed=${breed}`
        );
        search = `animals?type=${type}&limit=50&location=${location.coords.latitude},${location.coords.longitude}&sort=distance&age=${age}&distance=${distance}&breed=${breed}`;
      }
      const this_search = {
        customLocation,
        type,
        age,
        distance,
        breed,
      };

      console.log(
        "GET: Age: " +
          age +
          ", Type: " +
          type +
          ", Breeds: " +
          breed +
          ", Location: " +
          customLocation
      );

      petfinder
        .get(search, {
          headers: {
            Authorization: `Bearer ${(
              await AsyncStorage.getItem("token")
            ).toString()}`,
          },
        })
        .then((response) => {
          setResults(response.data.animals);
          AsyncStorage.setItem(
            "lastpets",
            JSON.stringify(response.data.animals)
          );
          AsyncStorage.setItem("lastsearch", JSON.stringify(this_search));
        })
        .catch(function (error) {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", error.message);
          }
          //setSearchError(error.status);
          if (error.response.data.status == 401) {
            update_token();
          } else if (error.response.data.status == 400) {
            setCustomLocationErrorMessage(
              "Invalid location. Be sure to use the [city, state] format, such as Orlando, FL"
            );
            setTimeout(() => {
              setModalVisible(true);
              customLocationRef?.current?.focus();
            }, 500);
          }

          //console.log(error.config);
        });
      flatListRef.current?.scrollToOffset({ x: 0, y: 0, animated: true });
    } else {
      setTimeout(() => {
        if (type == "") {
          setType("Dog");
          setBreed([]);
        }
      }, 1500);
    }
  };

  useEffect(() => {
    update_token();
    if (customLocation != "") {
      navigation.setOptions({
        headerTitle: "Pets near " + customLocation,
        headerTitleStyle: { color: "black" },
      });
    } else {
      navigation.setOptions({
        headerTitle: "Nearby Pets for Adoption",
        headerTitleStyle: { color: "black" },
      });
    }
    if (
      (!results || results.length <= 0) &&
      (location != null || customLocation != "")
    ) {
      console.log("Condition Met");
      setTimeout(async () => {
        //searchApi();
      }, 800);
    }
  }, [location, customLocation]);

  useEffect(() => {
    (async () => {
      let temp = JSON.parse(await AsyncStorage.getItem("lastpets"));
      setResults(temp);

      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied. Try again.");
        const { newstatus } = await Permissions.askAsync(Permissions.LOCATION);
        if (!newstatus === "granted") {
          throw new Error("Location permissions not granted.");
        }
      }

      let location2 = await Location.getCurrentPositionAsync({});
      console.log(
        "location: " +
          location2.coords.latitude +
          "," +
          location2.coords.longitude
      );
      setLocation(location2);

      let temp2 = JSON.parse(await AsyncStorage.getItem("lastsearch"));
      if ((await temp2) != null) {
        console.log();
        setCustomLocation(temp2.customLocation);
        setInputVal(temp2.customLocation);
        setAge(temp2.age);
        setDistance(temp2.distance);
        setType(temp2.type);
        setBreed(temp2.breed);
        console.log(
          "Initial GET: Age: " +
            age +
            ", Type: " +
            type +
            ", Breeds: " +
            breed +
            ", Location: " +
            customLocation
        );
      } else {
        console.log("Got here");
        //setType("Dog");
        //setDistance(150);
        //setAge([]);
        //setBreed([]);
        //setCustomLocation("");
        //setInputVal("");
        searchApi();
      }

      //getBreedOptions();
      //searchApi();
    })();
  }, []);

  const loadMoreResults = async () => {
    if (!loadingMore) {
      setLoadingMore(true);
      console.log("rendering page " + nextPage + "...");
      retrieveNewPage();
      setNextPage(nextPage + 1);
      setLoadingMore(false);
    }
  };

  const retrieveNewPage = async () => {
    const newpagesearch = searchReq.concat(`&page=${nextPage}`);

    petfinder
      .get(newpagesearch, {
        headers: {
          Authorization: `Bearer ${(
            await AsyncStorage.getItem("token")
          ).toString()}`,
        },
      })
      .then((response) => {
        let temp3 = results;
        for (let item of response.data.animals) {
          if (!temp3.includes(item)) {
            temp3.push(item);
          }
        }
        setResults(temp3);
      })
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          //console.log(error.response.status);
          //console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
        //console.log(error.config);
      });
  };

  const getBreedOptions = async () => {
    if (type != "") {
      var breedSearch = `types/${type}/breeds`;

      petfinder
        .get(breedSearch, {
          headers: {
            Authorization: `Bearer ${(
              await AsyncStorage.getItem("token")
            ).toString()}`,
          },
        })
        .then((response) => {
          const my_breeds = response.data.breeds.map((breed1) => {
            return {
              label: breed1.name,
              value: breed1.name,
            };
          });
          setBreedOptions(my_breeds);
        })
        .catch(function (error) {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            //console.log(error.response.status);
            //console.log(error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", error.message);
          }
          //console.log(error.config);
        });
    } else {
      setTimeout(async () => {
        if (type == "") {
          var breedSearch = `types/dog/breeds`;

          petfinder
            .get(breedSearch, {
              headers: {
                Authorization: `Bearer ${(
                  await AsyncStorage.getItem("token")
                ).toString()}`,
              },
            })
            .then((response) => {
              const my_breeds = response.data.breeds.map((breed1) => {
                return {
                  label: breed1.name,
                  value: breed1.name,
                };
              });
              setBreedOptions(my_breeds);
            })
            .catch(function (error) {
              if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                //console.log(error.response.status);
                //console.log(error.response.headers);
              } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
              } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error", error.message);
              }
              //console.log(error.config);
            });
        }
      }, 500);
    }
  };

  return (
    <View style={{ justifyContent: "flex-start", flex: 1, borderWidth: 0 }}>
      <Modal
        isVisible={isModalVisible}
        hasBackdrop={true}
        backdropOpacity={0.5}
      >
        <View
          onStartShouldSetResponder={() => {
            setAgeVisible(false);
            setBreedVisible(false);
            setTypeVisible(false);
          }}
          style={{
            borderRadius: 15,
            height: useWindowDimensions().height * 0.85,
            backgroundColor: "white",
          }}
        >
          <ScrollView>
            <Text
              h3
              style={{
                textAlign: "center",
                marginTop: 15,
                marginBottom: 25,
                color: "grey",
                fontWeight: "bold",
              }}
            >
              Search Filters
            </Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.labelStyle}>CUSTOM LOCATION</Text>
              <Input
                inputStyle={{
                  marginLeft: 10,
                  marginTop: 0,
                  marginBottom: 0,
                  fontSize: 18,
                  color: COLORS.darkgrey,
                }}
                inputContainerStyle={styles.inputContainerStyle}
                placeholder="Use Current Location"
                leftIcon={{
                  type: "font-awesome",
                  name: "globe",
                  color: COLORS.primary,
                }}
                leftIconContainerStyle={{ marginLeft: 10 }}
                onEndEditing={() => {
                  setCustomLocation(inputVal);
                }}
                defaultValue={customLocation ? customLocation : ""}
                textContentType="addressCityAndState"
                clearButtonMode="always"
                onChangeText={(text) => {
                  setInputVal(text);
                  setCustomLocationErrorMessage("");
                }}
                errorMessage={CustomLocationErrorMessage}
                errorStyle={{
                  marginLeft: 15,
                  marginBottom: 10,
                }}
                value={inputVal}
                ref={customLocationRef}
              />
              <MySlider distance={distance} setDistance={setDistance} />
              <Text style={styles.labelStyle}>AGE</Text>
              <DropDownPicker
                items={[
                  {
                    label: "Baby",
                    value: "Baby",
                  },
                  {
                    label: "Young",
                    value: "Young",
                  },
                  {
                    label: "Adult",
                    value: "Adult",
                  },
                  {
                    label: "Senior",
                    value: "Senior",
                  },
                ]}
                defaultValue={age}
                placeholder="Any age"
                multiple={true}
                multipleText={age.join(", ")}
                min={0}
                max={4}
                containerStyle={{ height: 40, marginHorizontal: 10 }}
                style={{ backgroundColor: "#fafafa" }}
                itemStyle={{
                  justifyContent: "flex-start",
                }}
                dropDownStyle={{ backgroundColor: "#fafafa", marginBottom: 40 }}
                onChangeItem={(item) => setAge(item)}
                isVisible={isAgeVisible}
                onOpen={() => {
                  setAgeVisible(true);
                  setTypeVisible(false);
                  setBreedVisible(false);
                }}
                onClose={() => setAgeVisible(false)}
                zIndex={5000}
              />
              <Text style={styles.labelStyle}>ANIMAL TYPE</Text>
              <DropDownPicker
                items={[
                  {
                    label: "Dog",
                    value: "Dog",
                  },
                  {
                    label: "Cat",
                    value: "Cat",
                  },
                  {
                    label: "Bird",
                    value: "Bird",
                  },
                  {
                    label: "Rabbit",
                    value: "Rabbit",
                  },
                ]}
                defaultValue={type}
                containerStyle={{ height: 40, marginHorizontal: 10 }}
                style={{ backgroundColor: "#fafafa" }}
                itemStyle={{
                  justifyContent: "flex-start",
                }}
                dropDownStyle={{ backgroundColor: "#fafafa" }}
                onChangeItem={(item) => {
                  setType(item.value);
                  //setBreed([]);
                }}
                isVisible={isTypeVisible}
                onOpen={() => {
                  setTypeVisible(true);
                  setBreedVisible(false);
                  setAgeVisible(false);
                }}
                onClose={() => setTypeVisible(false)}
                zIndex={4000}
              />
              <Text style={styles.labelStyle}>ANIMAL BREEDS</Text>
              <DropDownPicker
                items={breedOptions ? breedOptions : ""}
                defaultValue={breed ? breed : ""}
                placeholder="Any breed"
                multiple={true}
                multipleText={breed.join(", ")}
                min={0}
                max={100}
                containerStyle={{ height: 40, marginHorizontal: 10 }}
                style={{ backgroundColor: "#fafafa" }}
                itemStyle={{
                  justifyContent: "flex-start",
                }}
                dropDownStyle={{ backgroundColor: "#fafafa", marginBottom: 40 }}
                onChangeItem={(item) => setBreed(item)}
                isVisible={isBreedVisible}
                onOpen={() => {
                  setBreedVisible(true);
                  setTypeVisible(false);
                  setAgeVisible(false);
                }}
                onClose={() => setBreedVisible(false)}
                zIndex={3000}
              />

              <View
                style={{
                  flex: 1,
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  title="Clear Search"
                  onPress={() => {
                    setCustomLocation("");
                    setInputVal("");
                    setDistance(150);
                    setBreed([]);
                    setAge([]);
                    setType("Dog");
                  }}
                  zIndex={2000}
                  containerStyle={{
                    marginTop: 20,
                    marginHorizontal: 20,
                  }}
                  buttonStyle={{
                    borderRadius: 15,
                    backgroundColor: "grey",
                  }}
                />
                <Button
                  title="Save"
                  onPress={() => {
                    if (customLocation == "") {
                      console.log(
                        "Age: " +
                          age +
                          ", Type: " +
                          type +
                          ", Breeds: " +
                          breed +
                          ", Location: " +
                          location
                      );
                    } else {
                      console.log(
                        "Age: " +
                          age +
                          ", Type: " +
                          type +
                          ", Breeds: " +
                          breed +
                          ", Location: " +
                          customLocation
                      );
                    }
                    searchApi();
                    toggleModal();
                  }}
                  zIndex={2000}
                  containerStyle={{
                    marginTop: 20,
                    marginBottom: 20,
                    marginHorizontal: 20,
                  }}
                  buttonStyle={{
                    borderRadius: 15,
                    backgroundColor: COLORS.primary,
                  }}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
      <View
        style={{
          backgroundColor: "white",
          borderColor: "lightgrey",
          borderWidth: 0,
        }}
      >
        <SearchHeader onPress={toggleModal} />
      </View>
      <View style={{ flex: 1 }}>
        {results ? (
          <Text style={styles.resultStyle}>{results.length} results</Text>
        ) : null}
        <ListComponent
          results={results}
          loadMoreResults={loadMoreResults}
          refresh={searchApi}
          ref={flatListRef}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  resultStyle: {
    height: 30,
    backgroundColor: "white",
    textAlign: "center",
    fontSize: 16,
    color: "grey",
    paddingTop: 5,
  },
  labelStyle: {
    fontWeight: "bold",
    fontSize: 20,
    color: COLORS.primary,
    marginLeft: 15,
    marginBottom: 5,
    marginTop: 20,
  },
  inputStyle: {
    //backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 10,
    color: COLORS.darkgrey,
  },
  inputContainerStyle: {
    borderRadius: 8,
    //marginHorizontal: 5,
    //padding: 5,
    borderBottomWidth: 0,
  },
  inputLabelStyle: {
    marginLeft: 10,
    marginBottom: 5,
    marginTop: 5,
  },
});
export default ListScreen;
