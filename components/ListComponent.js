import React, { useState } from "react";
import { View, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { ListItem } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { Asset } from "expo-asset";
import { COLORS } from "../assets/colors";

const defaultURI = Asset.fromModule(require("../assets/default.png")).uri;
let isRefreshing = false;

const ListComponent = React.forwardRef(
  ({ results, loadMoreResults, refresh }, ref) => {
    const [
      onEndReachedCalledDuringMomentum,
      setOnEndReachedCalledDuringMomentum,
    ] = useState(true);

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
            id: item.id,
            name: item.name,
            breed: item.breeds.primary,
          });
        }}
      />
    );

    const _loadMoreData = () => {
      if (!onEndReachedCalledDuringMomentum) {
        setOnEndReachedCalledDuringMomentum(true);

        setTimeout(() => {
          console.log("Got here...");
          loadMoreResults();
        }, 500);
      }
    };

    const _onMomentumScrollBegin = () => {
      setOnEndReachedCalledDuringMomentum(false);
    };

    const _renderSearchResultsFooter = () => {
      return onEndReachedCalledDuringMomentum ? (
        <View
          style={{ marginBottom: 30, marginTop: -50, alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : null;
    };

    if (loadMoreResults != null) {
      return (
        <View style={styles.container}>
          <FlatList
            data={results}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.01}
            onEndReached={() => {
              if (results.length >= 50) {
                _loadMoreData();
              }
            }}
            onMomentumScrollBegin={() => {
              _onMomentumScrollBegin();
            }}
            ListFooterComponent={_renderSearchResultsFooter()}
            onRefresh={async () => {
              if (!isRefreshing) {
                isRefreshing = true;
                await refresh();
                isRefreshing = false;
              }
            }}
            refreshing={isRefreshing}
            ref={ref}
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
  }
);

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
