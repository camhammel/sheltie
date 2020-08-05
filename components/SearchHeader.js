import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { SearchBar, Button } from "react-native-elements";
import * as RootNavigation from "../navigationRef";
import Icon from "react-native-vector-icons/Entypo";

const SearchHeader = ({ searchApi, term, setTerm }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "white",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "lightgrey",
      }}
    >
      <View
        style={{
          flex: 6,
          backgroundColor: "white",
        }}
      >
        <SearchBar
          placeholder="Search..."
          onChangeText={setTerm}
          onSubmitEditing={searchApi}
          value={term}
          round
          lightTheme
          containerStyle={{
            backgroundColor: "white",
            borderWidth: 0,
            borderTopColor: "transparent",
            borderBottomColor: "transparent",
            borderStartColor: "white",
            borderEndColor: "white",
          }}
          inputContainerStyle={{
            height: 40,
            backgroundColor: "white",
            borderTopColor: "#FE96BE",
            borderBottomColor: "#FE96BE",
            borderLeftColor: "#FE96BE",
            borderRightColor: "#FE96BE",
            borderStartColor: "#FE96BE",
            borderEndColor: "#FE96BE",
            borderBottomWidth: 1,
            borderWidth: 1,
            borderRadius: 30,
          }}
          inputStyle={{
            color: "black",
          }}
          placeholderTextColor="grey"
          style={{
            borderBottomColor: "white",
            borderWidth: 1,
          }}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          flex: 2,
          justifyContent: "space-evenly",
          backgroundColor: "white",
          borderWidth: 0,
          borderTopColor: "lightgrey",
          borderBottomColor: "lightgrey",
          borderStartColor: "white",
          borderEndColor: "white",
          alignSelf: "center",
          paddingVertical: 9,
        }}
      >
        <Button
          buttonStyle={{
            backgroundColor: "#ffffff",
            borderColor: "#FE96BE",
            borderWidth: 1,
            marginRight: 5,
          }}
          icon={
            <Icon
              name="map"
              size={20}
              color="#FE96BE"
              borderWidth={1}
              borderColor="#FE96BE"
            />
          }
        ></Button>
        <Button
          buttonStyle={{
            backgroundColor: "#ffffff",
            borderColor: "#FE96BE",
            borderWidth: 1,
            marginRight: 5,
          }}
          icon={
            <Icon
              name="user"
              size={20}
              color="#FE96BE"
              borderWidth={1}
              borderColor="#FE96BE"
            />
          }
          onPress={() => RootNavigation.navigate("Account")}
        ></Button>
      </View>
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

export default SearchHeader;
