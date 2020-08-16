import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { SearchBar, Button } from "react-native-elements";
import * as RootNavigation from "../navigationRef";
import Icon from "react-native-vector-icons/Entypo";
import FAIcon from "react-native-vector-icons/FontAwesome";
import { COLORS } from "../assets/colors";

const SearchHeader = ({ onPress }) => {
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
        <Button
          type="outline"
          title={"Search Filters"}
          titleStyle={{ color: "grey", paddingLeft: 10 }}
          buttonStyle={styles.signoutButtonStyle}
          onPress={() => {
            onPress();
          }}
          icon={
            <FAIcon
              name="filter"
              size={20}
              color={COLORS.primary}
              style={{ alignSelf: "center" }}
            />
          }
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
            borderColor: COLORS.primary,
            borderWidth: 1,
            marginRight: 5,
          }}
          icon={
            <Icon
              name="map"
              size={20}
              color={COLORS.primary}
              borderWidth={1}
              borderColor={COLORS.primary}
            />
          }
        ></Button>
        <Button
          buttonStyle={{
            backgroundColor: "#ffffff",
            borderColor: COLORS.primary,
            borderWidth: 1,
            marginRight: 5,
          }}
          icon={
            <Icon
              name="user"
              size={20}
              color={COLORS.primary}
              borderWidth={1}
              borderColor={COLORS.white}
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
  signoutButtonStyle: {
    borderColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: 30,
    marginHorizontal: 2,
  },
});

export default SearchHeader;
