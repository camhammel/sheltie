import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  ActivityIndicator,
} from "react-native";
import { ListItem } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { Asset } from "expo-asset";
import { COLORS } from "../assets/colors";

const defaultURI = Asset.fromModule(require("../assets/default.png")).uri;
let isLoading = false;
let isRefreshing = false;

const ListComponent = ({ results, loadMoreResults, refresh }) => {
  const navigation = useNavigation();
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const renderItem = ({ item }) => (
    <ListItem
      title={capitalizeFirstLetter(item.name.toLowerCase())}
      titleStyle={styles.titleStyle}
      id={item.id}
      subtitle={
        item.breeds.mixed ? item.breeds.primary + " Mix" : item.breeds.primary
      }
      subtitleStyle={{ color: "grey" }}
      leftAvatar={{
        source: {
          uri: item?.photos?.[0]?.small ?? defaultURI,
        },
        size: "large",
      }}
      bottomDivider
      chevron
      onPress={() => {
        navigation.navigate("PetDetail", {
          item,
          name: item.name,
          breed: item.breeds.primary,
        });
      }}
    />
  );

  if (loadMoreResults != null) {
    return (
      <View style={styles.container}>
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          onEndReachedThreshold={0.5}
          onEndReached={async () => {
            if (results.length >= 50) {
              if (!isLoading) {
                isLoading = true;
                await loadMoreResults();
                isLoading = false;
              }
            }
          }}
          ListFooterComponent={
            isLoading ? <ActivityIndicator size="small" /> : null
          }
          onRefresh={async () => {
            if (!isRefreshing) {
              isRefreshing = true;
              await refresh();
              isRefreshing = false;
            }
          }}
          refreshing={isRefreshing}
        />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  titleStyle: {
    fontWeight: "bold",
    color: COLORS.primary,
    fontSize: 18,
  },
  container: {
    flex: 1,
    marginTop: 0,
  },
  item: {
    backgroundColor: "#ffffff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
});

export default ListComponent;
