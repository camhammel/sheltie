import { StyleSheet } from "react-native";
import { COLORS } from "../assets/colors";

export const styles = StyleSheet.create({
  authBackgroundStyle: {
    flex: 1,
    opacity: 0.5,
    resizeMode: "cover",
    tintColor: "pink",
  },
  inputStyle: {
    backgroundColor: "transparent",
    borderRadius: 8,
    paddingHorizontal: 10,
    color: COLORS.white,
    opacity: 1,
  },
  containerStyle: {
    borderRadius: 8,
    marginHorizontal: 35,
    paddingTop: 5,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderColor: COLORS.white,
    opacity: 0.65,
    alignSelf: "center",
  },
  // labelStyle: {
  //   color: COLORS.white,
  //   marginLeft: 10,
  //   marginBottom: 5,
  //   marginTop: 5,
  //   opacity: 0.8,
  //   marginHorizontal: 25,
  // },
});
