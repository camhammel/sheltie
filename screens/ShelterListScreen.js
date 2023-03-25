import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { View } from "react-native";
import { getShelterAnimals } from "../api/petfinder";
import ListComponent from "../components/ListComponent";

const ShelterListScreen = ({ navigation, route }) => {
  let { item } = route.params;
  const shelterId = item.id;

  useEffect(() => {
    navigation.setOptions({
      headerTitleStyle: { color: "white" },
      headerBackTitle: "Back",
      headerTitle: item?.name,
    });
  }, []);

  const { data: results, isLoading, refetch, fetchNextPage } = useInfiniteQuery({ 
    queryKey: ['getShelterPets', { shelterId }], 
    queryFn: ({ pageParam = 1 }) => getShelterAnimals({ pageParam, id: shelterId }),
    getNextPageParam: (lastPage) => (lastPage?.data?.pagination?.current_page + 1) || 1,
    select: (data) => data.pages.flatMap((page) => page.data.animals)
  });

  return (
    <View style={{ flex: 1 }}>
      <ListComponent
        results={results}
        loading={isLoading}
        refresh={() => {refetch()}}
        loadMoreResults={() => {fetchNextPage()}}
        isStatic={true}
      />
    </View>
  );
};

export default ShelterListScreen;
