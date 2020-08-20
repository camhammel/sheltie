import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Linking,
  Dimensions,
  AsyncStorage,
} from "react-native";
import { Button, Text, Divider } from "react-native-elements";
import Icon from "react-native-vector-icons/Entypo";
import { COLORS } from "../assets/colors";
import petfinder from "../api/petfinder";

const ShelterInfo = ({ results }) => {
  const [shelter, setShelter] = useState(null);
  let doneLoading = false;

  useEffect(() => {
    (async () => {
      getShelterDetails();
    })();
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
      .get(`organizations/${results.organization_id}`, {
        headers: {
          Authorization: `Bearer ${(
            await AsyncStorage.getItem("token")
          ).toString()}`,
        },
      })
      .then((response) => {
        setShelter(response.data.organization);
        console.log("Found org: " + JSON.stringify(response.data.organization));
        doneLoading = true;
      })
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          //console.log(error.response.status);
          //console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
        //console.log(error.config);
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
      {results.contact.email && results.contact.email.trim() ? (
        <Button
          title={results.contact.email}
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
                results.contact.email +
                "?subject=Inquiring About " +
                results.name
            );
          }}
        />
      ) : null}
      {results.contact.phone && results.contact.phone.trim() ? (
        <Button
          title={results.contact.phone}
          buttonStyle={styles.buttonStyle}
          containerStyle={{ marginBottom: 40 }}
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
            Linking.openURL("tel:" + results.contact.phone);
          }}
        />
      ) : null}
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
});

export default ShelterInfo;
