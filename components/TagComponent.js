import React from "react";
import { View, StyleSheet } from "react-native";
import Tags from "react-native-tags";
import { COLORS } from "../assets/colors";
import Spacer from "./Spacer";

const TagComponent = ({ tags }) => {
  return (
    <Spacer margin={10}>
      <Tags
        initialTags={tags}
        readonly
        deleteTagOnPress={false}
        tagContainerStyle={styles.containerStyle}
        tagTextStyle={styles.tagTextStyle}
      />
    </Spacer>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    borderColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: COLORS.extralight,
    color: COLORS.light,
  },
  tagTextStyle: {
    color: COLORS.primary,
  },
});
export default TagComponent;
