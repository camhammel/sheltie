import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Linking,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, Text, Divider } from "react-native-elements";
import Icon from "react-native-vector-icons/Entypo";
import FAIcon from "react-native-vector-icons/FontAwesome";
import { COLORS } from "../assets/colors";
import petfinder from "../api/petfinder";
import { navigationRef } from "../navigationRef";

const ShelterInfo = ({ organization_id, pet_name }) => {
  const [shelter, setShelter] = useState(null);
  let isSubscribed = true;

  useEffect(() => {
    (async () => {
      await getShelterDetails();
    })();
    return () => (isSubscribed = false);
  }, []);

  const shelterAddress = () => {
    return (
      <>
        {shelter.address.address1 != null
          ? shelter.address.address1 + " "
          : null}
        {shelter.address.city != null ? shelter.address.city + ", " : null}
        {shelter.address.state != null ? shelter.address.state : null}
      </>
    );
  };

  const getShelterDetails = async () => {
    petfinder
      .get(`organizations/${organization_id}`, {
        headers: {
          Authorization: `Bearer ${(
            await AsyncStorage.getItem("token")
          ).toString()}`,
        },
      })
      .then((response) => {
        if (isSubscribed) {
          setShelter(response.data.organization);
          doneLoading = true;
        }
      })
      .catch(function (error) {
        if (error.response) {
        }
      });
  };

  return (
    <View style={styles.container}>
      <Divider
        style={{
          backgroundColor: COLORS.primary,
          width: Dimensions.get("window").width - 50,
          alignSelf: "center",
          height: 1,
          marginBottom: 20,
        }}
      />
      <Text h3 style={{ textAlign: "center", paddingHorizontal: 10 }}>
        {shelter ? shelter.name : null}
      </Text>
      <Text
        style={{
          textAlign: "center",
          fontSize: 18,
          color: COLORS.darkgrey,
          marginTop: 5,
          marginBottom: 10,
        }}
      >
        {shelter ? shelterAddress() : null}
      </Text>
      {shelter?.email && shelter?.email?.trim() ? (
        <Button
          title={shelter?.email}
          buttonStyle={styles.buttonStyle}
          titleStyle={styles.titleStyle}
          type="solid"
          icon={
            <Icon
              name="mail"
              size={18}
              color={"white"}
              style={{ alignSelf: "center" }}
            />
          }
          onPress={() => {
            Linking.openURL(
              "mailto: " +
                shelter?.email +
                "?subject=Inquiring About " +
                pet_name
            );
          }}
        />
      ) : null}
      {shelter?.phone && shelter?.phone?.trim() ? (
        <Button
          title={shelter?.phone}
          buttonStyle={styles.buttonStyle}
          titleStyle={styles.titleStyle}
          type="solid"
          icon={
            <Icon
              name="phone"
              size={18}
              color={"white"}
              style={{ alignSelf: "center" }}
            />
          }
          onPress={() => {
            Linking.openURL("tel:" + shelter?.phone);
          }}
        />
      ) : null}
      <Button
        title="View Pets"
        buttonStyle={styles.viewButtonStyle}
        titleStyle={styles.viewTitleStyle}
        type="outline"
        icon={
          <FAIcon
            name="paw"
            size={18}
            color={COLORS.primary}
            style={{ alignSelf: "center" }}
          />
        }
        onPress={() => {
          navigationRef?.current?.navigate("ShelterList", { item: shelter });
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  overlay: {
    backgroundColor: "rgba(0,0,0,0.2)",
    flex: 1,
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "white",
    paddingTop: 12,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    marginTop: 20,
    width: Dimensions.get("screen").width,
    maxWidth: Dimensions.get("screen").width,
  },
  buttonStyle: {
    alignSelf: "center",
    marginTop: 10,
    marginHorizontal: 20,
    borderRadius: 25,
    paddingHorizontal: 20,
    backgroundColor: COLORS.primary,
  },
  titleStyle: {
    paddingLeft: 5,
    paddingRight: 10,
  },
  viewButtonStyle: {
    alignSelf: "center",
    marginTop: 10,
    marginHorizontal: 20,
    borderRadius: 25,
    paddingHorizontal: 20,
    borderColor: COLORS.primary,
  },
  viewTitleStyle: {
    paddingLeft: 5,
    paddingRight: 10,
    color: COLORS.primary,
  },
});

export default ShelterInfo;
