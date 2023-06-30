import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Alert,
} from "react-native";
import { Text } from "react-native-elements";
import _uniqBy from 'lodash/uniqBy';
import * as Location from 'expo-location';
import { storage } from '../utils/storage';
import ListComponent from "../components/ListComponent";
import SearchModal from "../components/SearchModal";
import SearchHeader from "../components/SearchHeader";
import { searchApi } from "../api/petfinder";
import { useInfiniteQuery } from "@tanstack/react-query";
import resolveCoords from "../api/location";

const ListScreen = ({ navigation }) => {
  const [gpsLocation, setGpsLocation] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    distance: 150,
    age: [],
    type: 'Dog',
    breed: [],
    location: null
  });
  const [pagination, setPagination] = useState({
    count_per_page: 20,
    total_count: 1,
    current_page: 1,
    total_pages: 1,
  });
  const [animals, setAnimals] = useState([]);
  const flatListRef = useRef();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied. Try again.");
      }

      let location2 = await Location.getCurrentPositionAsync({});
      if(location2) {
        setGpsLocation({ latitude: location2.coords.latitude, longitude: location2.coords.longitude });
        setSearchFilters((prevFilters) => ( { ...prevFilters, location: { latitude: location2.coords.latitude, longitude: location2.coords.longitude } }));
      }
      
    })();
  }, []);

  const updateFilters = async (filters) => {
    filters.location = await resolveCoords(gpsLocation, filters.customLocation);
    setSearchFilters(filters);
    setModalVisible(false);
  }

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const { data: results, isLoading, refetch, fetchNextPage } = useInfiniteQuery({ 
    queryKey: ['getPets', searchFilters], 
    queryFn: ({ pageParam = 1 }) => searchApi({ pageParam, ...searchFilters }),
    getNextPageParam: (lastPage) => (lastPage?.data?.pagination?.current_page + 1) || 1,
    placeholderData: (() => {
      return storage.getString("lastresults") ? (JSON.parse(storage.getString("lastresults"))) : null
    }),
    onSuccess: (data) => {
      if (data?.pages?.[0].data?.animals) {
        storage.set('lastresults', JSON.stringify(data));
        storage.set('lastsearch', JSON.stringify(searchFilters));
      }
    },
    enabled: !!searchFilters.location && !!searchFilters.location.latitude
  });

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Nearby Pets for Adoption",
      headerTitleStyle: { color: "white" },
    });
  }, []);

  useEffect(() => {
    if (results?.pages?.[0]?.data?.animals) {
      const relevantData = results.pages.map((page) => page?.data?.animals);
      setPagination(results.pages[results.pages.length - 1].data?.pagination);
      setAnimals(_uniqBy(relevantData.flat(1), 'id'));
    }
  }, [results])

  const setFiltersFromStorage = () => {
    let temp2 = JSON.parse(storage.getString("lastsearch"));
    if ((temp2) != null) {
      setCustomLocation(temp2.location);
      setAge(temp2.age);
      setDistance(temp2.distance);
      setType(temp2.type);
      setBreed(temp2.breed);
    } else {
      setType("Dog");
      setModalVisible(true);
      setTimeout(() => {
        Alert.alert(
          "Search Filters",
          "Use these filters to help narrow down your search. When you're ready, click 'Search'. "
        );
      }, 750);
    }
  }

  return (
    <View style={{ justifyContent: "flex-start", flex: 1, borderWidth: 0 }}>
      <View
        style={{
          backgroundColor: "white",
          borderColor: "lightgrey",
          borderWidth: 0,
        }}
      >
        <SearchHeader
          onPress={() => toggleModal()}
          location={{
            lat: searchFilters.location?.latitude,
            long: searchFilters.location?.longitude,
          }}
        />
      </View>
      <View style={{ flex: 1 }}>
        {isLoading 
        ? <Text style={styles.resultStyle}>Loading...</Text>
        : <Text style={styles.resultStyle}>{pagination.total_count} results</Text>}
        <ListComponent
          results={animals}
          hasMoreResults={pagination.current_page < pagination.total_pages}
          loadMoreResults={() => fetchNextPage()}
          refresh={refetch}
          ref={flatListRef}
        />
      </View>
      <SearchModal isVisible={isModalVisible} onSaveChanges={updateFilters} />
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
});
export default ListScreen;
