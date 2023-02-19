import React, { useState } from "react";
import { View, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { Avatar, ListItem } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { Asset } from "expo-asset";
import { COLORS } from "../assets/colors";

const defaultURI = Asset.fromModule(require("../assets/default.png")).uri;

const ListComponent = React.forwardRef(
  ({ results, loadMoreResults, refresh, isStatic }, ref) => {
    const [
      onEndReachedCalledDuringMomentum,
      setOnEndReachedCalledDuringMomentum,
    ] = useState(true);
    const [isRefreshing, setRefreshing] = useState(false);

    const navigation = useNavigation();
    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const renderItem = ({ item }) => (
      <ListItem id={item.id} bottomDivider onPress={() => {
        navigation.navigate("PetDetail", {
          id: item.id,
          name: item.name,
          breed: item.breeds.primary,
        });
      }}>
        <Avatar
          source={{
            uri: item?.photos?.[0]?.small ?? defaultURI,
          }} size="large"/>
        <ListItem.Content>
          <ListItem.Title style={styles.titleStyle}>{capitalizeFirstLetter(item.name.toLowerCase())}</ListItem.Title>
          <ListItem.Subtitle style={{ color: "grey" }}>{
            item.breeds.mixed ? item.breeds.primary + " Mix" : item.breeds.primary
          }</ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
    );

    const _loadMoreData = () => {
      if (!onEndReachedCalledDuringMomentum) {
        setOnEndReachedCalledDuringMomentum(true);

        setTimeout(() => {
          loadMoreResults();
        }, 500);
      }
    };

    const _onMomentumScrollBegin = () => {
      setOnEndReachedCalledDuringMomentum(false);
    };

    const _renderSearchResultsFooter = () => {
      return onEndReachedCalledDuringMomentum && !isStatic ? (
        <View
          style={{ marginBottom: 30, marginTop: -50, alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : null;
    };

    return (
      <View style={styles.container}>
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={isStatic ? 0 : 0.01}
          onEndReached={() => {
            if (loadMoreResults != null && (results.length >= 50 && !isStatic)) {
              _loadMoreData();
            }
          }}
          onMomentumScrollBegin={() => {
            _onMomentumScrollBegin();
          }}
          ListFooterComponent={_renderSearchResultsFooter()}
          onRefresh={async () => {
            if (!isRefreshing && !isStatic) {
              setRefreshing(true);
              await refresh();
              setRefreshing(false);
            }
          }}
          refreshing={isStatic ? false : isRefreshing}
          ref={ref}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  titleStyle: {
    fontWeight: "bold",
    color: COLORS.primarylight,
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
