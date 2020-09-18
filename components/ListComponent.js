import React, { useState } from "react";
import { View, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { ListItem } from "react-native-elements";
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
          navigation.push("PetDetail", {
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

    if (loadMoreResults != null) {
      return (
        <View style={styles.container}>
          <FlatList
            data={results}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={isStatic ? 0 : 0.01}
            onEndReached={() => {
              if (results.length >= 50 && !isStatic) {
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
    } else {
      return (
        <View style={styles.container}>
          <FlatList
            data={results}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
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
