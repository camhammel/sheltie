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
    alignSelf: "center",
  },
});
