import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Text,
} from "react-native";
import { ListItem } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";

const ListComponent = () => {
  const navigation = useNavigation();

  const DATA = [
    {
      id: "1",
      title: "Sparky",
      breed: "Golden Retriever",
      src: require("../assets/retriever.jpg"),
    },
    {
      id: "2",
      title: "Tucker",
      breed: "Siberian Husky",
      src: require("../assets/husky.jpg"),
    },
    {
      id: "3",
      title: "Toto",
      breed: "Pomeranian",
      src: require("../assets/pomeranian.jpg"),
    },
  ];

  const renderItem = ({ item }) => (
    <ListItem
      title={item.title}
      titleStyle={{ fontWeight: "bold", color: "#FE96BE" }}
      id={item.id}
      subtitle={item.breed}
      subtitleStyle={{ color: "grey" }}
      leftAvatar={{ source: item.src, size: "large" }}
      bottomDivider
      chevron
      onPress={() => {
        navigation.navigate("PetDetail", {
          item,
          name: item.title,
          breed: item.breed,
        });
      }}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
  title: {
    fontSize: 32,
  },
});

export default ListComponent;
