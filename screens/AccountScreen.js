import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  AsyncStorage,
  Image,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { Button, Text } from "react-native-elements";
import Spacer from "../components/Spacer";
import { Context as AuthContext } from "../context/AuthContext";
import Logo from "../assets/icon.png";
import { COLORS } from "../assets/colors";
import Icon from "react-native-vector-icons/Entypo";
import { TouchableOpacity } from "react-native-gesture-handler";
import Modal from "react-native-modal";
import * as Linking from "expo-linking";

const AccountScreen = ({ navigation }) => {
  const { signout, getfavs } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [guest, setGuest] = useState("true");

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    (async () => {
      setGuest(await AsyncStorage.getItem("guest"));
      setEmail(await AsyncStorage.getItem("email"));
    })();
  }, []);

  if (guest == "true") {
    return (
      <ScrollView
        style={styles.viewStyle}
        contentContainerStyle={{
          alignItems: "center",
          //justifyContent: "flex-start",
        }}
      >
        <Modal
          isVisible={isModalVisible}
          hasBackdrop={true}
          backdropOpacity={0.5}
        >
          <View
            style={{
              borderRadius: 15,
              height: 600,
              backgroundColor: "white",
              paddingHorizontal: 10,
            }}
          >
            <ScrollView>
              <Text
                style={{
                  fontSize: 22,
                  textAlign: "center",
                  fontWeight: "bold",
                  marginTop: 15,
                  marginBottom: 10,
                }}
              >
                Privacy Policy
              </Text>
              <Text>
                Cameron Hammel built the Sheltie app as a Free app. This service
                is provided by Cameron Hammel at no cost and is intended for use
                as is. This page is used to inform visitors regarding my
                policies with the collection, use, and disclosure of Personal
                Information if anyone decided to use my Service. If you choose
                to use my Service, then you agree to the collection and use of
                information in relation to this policy. The Personal Information
                that I collect is used for providing and improving the Service.
                I will not use or share your information with anyone except as
                described in this Privacy Policy. The terms used in this Privacy
                Policy have the same meanings as in our Terms and Conditions,
                which is accessible at Sheltie unless otherwise defined in this
                Privacy Policy. {"\n"}
                {"\n"}Information Collection and Use {"\n"}
                {"\n"}For a better experience, while using our Service, I may
                require you to provide us with certain personally identifiable
                information, including but not limited to email address. The
                information that I request will be retained on your device and
                is not collected by me in any way. {"\n"}
                {"\n"}Log Data {"\n"}
                {"\n"}I want to inform you that whenever you use my Service, in
                a case of an error in the app I collect data and information
                (through third party products) on your phone called Log Data.
                This Log Data may include information such as your device
                Internet Protocol (“IP”) address, device name, operating system
                version, the configuration of the app when utilizing my Service,
                the time and date of your use of the Service, and other
                statistics. {"\n"}
                {"\n"}Cookies{"\n"}
                {"\n"}Cookies are files with a small amount of data that are
                commonly used as anonymous unique identifiers. These are sent to
                your browser from the websites that you visit and are stored on
                your device's internal memory. This Service does not use these
                “cookies” explicitly. However, the app may use third party code
                and libraries that use “cookies” to collect information and
                improve their services. You have the option to either accept or
                refuse these cookies and know when a cookie is being sent to
                your device. If you choose to refuse our cookies, you may not be
                able to use some portions of this Service. {"\n"}
                {"\n"}Service Providers{"\n"}
                {"\n"}I may employ third-party companies and individuals due to
                the following reasons: To facilitate our Service; To provide the
                Service on our behalf; To perform Service-related services; or
                To assist us in analyzing how our Service is used. I want to
                inform users of this Service that these third parties have
                access to your Personal Information. The reason is to perform
                the tasks assigned to them on our behalf. However, they are
                obligated not to disclose or use the information for any other
                purpose. {"\n"}
                {"\n"}Security{"\n"}
                {"\n"}I value your trust in providing us your Personal
                Information, thus we are striving to use commercially acceptable
                means of protecting it. But remember that no method of
                transmission over the internet, or method of electronic storage
                is 100% secure and reliable, and I cannot guarantee its absolute
                security. {"\n"}
                {"\n"}Links to Other Sites{"\n"}
                {"\n"}This Service may contain links to other sites. If you
                click on a third-party link, you will be directed to that site.
                Note that these external sites are not operated by me.
                Therefore, I strongly advise you to review the Privacy Policy of
                these websites. I have no control over and assume no
                responsibility for the content, privacy policies, or practices
                of any third-party sites or services.
                {"\n"}
                {"\n"}Children’s Privacy{"\n"}
                {"\n"}These Services do not address anyone under the age of 13.
                I do not knowingly collect personally identifiable information
                from children under 13. In the case I discover that a child
                under 13 has provided me with personal information, I
                immediately delete this from our servers. If you are a parent or
                guardian and you are aware that your child has provided us with
                personal information, please contact me so that I will be able
                to do necessary actions. {"\n"}
                {"\n"}Changes to This Privacy Policy{"\n"}
                {"\n"}I may update our Privacy Policy from time to time. Thus,
                you are advised to review this page periodically for any
                changes. I will notify you of any changes by posting the new
                Privacy Policy on this page. This policy is effective as of
                2020-08-17 {"\n"}
                {"\n"}Contact Us{"\n"}
                {"\n"}If you have any questions or suggestions about my Privacy
                Policy, do not hesitate to contact me at help@sheltie.app.
              </Text>
              <Text
                style={{
                  fontSize: 22,
                  textAlign: "center",
                  fontWeight: "bold",
                  marginTop: 15,
                  marginBottom: 10,
                }}
              >
                Terms and Conditions
              </Text>
              <Text>
                By downloading or using the app, these terms will automatically
                apply to you – you should make sure therefore that you read them
                carefully before using the app. You’re not allowed to copy, or
                modify the app, any part of the app, or our trademarks in any
                way. You’re not allowed to attempt to extract the source code of
                the app, and you also shouldn’t try to translate the app into
                other languages, or make derivative versions. The app itself,
                and all the trade marks, copyright, database rights and other
                intellectual property rights related to it, still belong to
                Cameron Hammel. Cameron Hammel is committed to ensuring that the
                app is as useful and efficient as possible. For that reason, we
                reserve the right to make changes to the app or to charge for
                its services, at any time and for any reason. We will never
                charge you for the app or its services without making it very
                clear to you exactly what you’re paying for. The Sheltie app
                stores and processes personal data that you have provided to us,
                in order to provide my Service. It’s your responsibility to keep
                your phone and access to the app secure. We therefore recommend
                that you do not jailbreak or root your phone, which is the
                process of removing software restrictions and limitations
                imposed by the official operating system of your device. It
                could make your phone vulnerable to malware/viruses/malicious
                programs, compromise your phone’s security features and it could
                mean that the Sheltie app won’t work properly or at all. The app
                does use third party services that declare their own Terms and
                Conditions. You should be aware that there are certain things
                that Cameron Hammel will not take responsibility for. Certain
                functions of the app will require the app to have an active
                internet connection. The connection can be Wi-Fi, or provided by
                your mobile network provider, but Cameron Hammel cannot take
                responsibility for the app not working at full functionality if
                you don’t have access to Wi-Fi, and you don’t have any of your
                data allowance left. If you’re using the app outside of an area
                with Wi-Fi, you should remember that your terms of the agreement
                with your mobile network provider will still apply. As a result,
                you may be charged by your mobile provider for the cost of data
                for the duration of the connection while accessing the app, or
                other third party charges. In using the app, you’re accepting
                responsibility for any such charges, including roaming data
                charges if you use the app outside of your home territory (i.e.
                region or country) without turning off data roaming. If you are
                not the bill payer for the device on which you’re using the app,
                please be aware that we assume that you have received permission
                from the bill payer for using the app. Along the same lines,
                Cameron Hammel cannot always take responsibility for the way you
                use the app i.e. You need to make sure that your device stays
                charged – if it runs out of battery and you can’t turn it on to
                avail the Service, Cameron Hammel cannot accept responsibility.
                With respect to Cameron Hammel’s responsibility for your use of
                the app, when you’re using the app, it’s important to bear in
                mind that although we endeavour to ensure that it is updated and
                correct at all times, we do rely on third parties to provide
                information to us so that we can make it available to you.
                Cameron Hammel accepts no liability for any loss, direct or
                indirect, you experience as a result of relying wholly on this
                functionality of the app. At some point, we may wish to update
                the app. The app is currently available on Android & iOS – the
                requirements for both systems(and for any additional systems we
                decide to extend the availability of the app to) may change, and
                you’ll need to download the updates if you want to keep using
                the app. Cameron Hammel does not promise that it will always
                update the app so that it is relevant to you and/or works with
                the Android & iOS version that you have installed on your
                device. However, you promise to always accept updates to the
                application when offered to you, We may also wish to stop
                providing the app, and may terminate use of it at any time
                without giving notice of termination to you. Unless we tell you
                otherwise, upon any termination, (a) the rights and licenses
                granted to you in these terms will end; (b) you must stop using
                the app, and (if needed) delete it from your device. {"\n"}
                {"\n"}Changes to This Terms and Conditions{"\n"}
                {"\n"}I may update our Terms and Conditions from time to time.
                Thus, you are advised to review this page periodically for any
                changes. I will notify you of any changes by posting the new
                Terms and Conditions on this page. These terms and conditions
                are effective as of 2020-08-17 {"\n"}
                {"\n"}Contact Us{"\n"}
                {"\n"}If you have any questions or suggestions about my Terms
                and Conditions, do not hesitate to contact me at
                help@sheltie.app.
              </Text>
              <Button
                buttonStyle={{
                  backgroundColor: COLORS.primary,
                  marginTop: 15,
                  marginBottom: 20,
                }}
                title="Close"
                onPress={() => {
                  toggleModal();
                }}
              />
            </ScrollView>
          </View>
        </Modal>
        <Spacer>
          <Image
            source={Logo}
            style={{
              width: useWindowDimensions().width - 40,
              height: useWindowDimensions().height / 3,
              marginBottom: 20,
            }}
            resizeMode="contain"
          />
        </Spacer>
        <View style={{ flex: 6, justifyContent: "flex-start" }}>
          <Text
            style={{
              fontSize: 24,
              marginTop: 20,
              marginBottom: 5,
              color: COLORS.darkgrey,
              textAlign: "center",
              fontWeight: "normal",
            }}
          >
            You aren't signed in
          </Text>
          <Button
            containerStyle={{ marginBottom: 15 }}
            type="solid"
            title={"Sign In"}
            titleStyle={{ paddingLeft: 10 }}
            onPress={() => {
              navigation.navigate("Signin");
            }}
            linearGradientProps={{
              colors: [COLORS.primarylight, COLORS.primary],
              start: { x: 0.25, y: 0.1 },
              end: { x: 0.25, y: 1 },
            }}
            icon={
              <Icon
                name="login"
                size={18}
                color="white"
                style={{ alignSelf: "center" }}
              />
            }
            buttonStyle={{ marginHorizontal: 20, marginTop: 10 }}
          ></Button>
        </View>

        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL("mailto: help@sheltie.app");
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: "blue",
                marginBottom: 5,
              }}
            >
              Contact: help@sheltie.app
            </Text>
          </TouchableOpacity>
          <Text style={{ textAlign: "center", marginBottom: 5 }}>
            Powered by the Petfinder API
          </Text>
          <TouchableOpacity
            onPress={() => {
              toggleModal();
            }}
          >
            <Text
              style={{ textAlign: "center", color: "blue", marginBottom: 15 }}
            >
              Privacy Policy
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  } else {
    return (
      <ScrollView
        style={styles.viewStyle}
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Modal
          isVisible={isModalVisible}
          hasBackdrop={true}
          backdropOpacity={0.5}
        >
          <View
            style={{
              borderRadius: 15,
              height: 600,
              backgroundColor: "white",
              paddingHorizontal: 10,
            }}
          >
            <ScrollView>
              <Text
                style={{
                  fontSize: 22,
                  textAlign: "center",
                  fontWeight: "bold",
                  marginTop: 15,
                  marginBottom: 10,
                }}
              >
                Privacy Policy
              </Text>
              <Text>
                Cameron Hammel built the Sheltie app as a Free app. This service
                is provided by Cameron Hammel at no cost and is intended for use
                as is. This page is used to inform visitors regarding my
                policies with the collection, use, and disclosure of Personal
                Information if anyone decided to use my Service. If you choose
                to use my Service, then you agree to the collection and use of
                information in relation to this policy. The Personal Information
                that I collect is used for providing and improving the Service.
                I will not use or share your information with anyone except as
                described in this Privacy Policy. The terms used in this Privacy
                Policy have the same meanings as in our Terms and Conditions,
                which is accessible at Sheltie unless otherwise defined in this
                Privacy Policy. {"\n"}
                {"\n"}Information Collection and Use {"\n"}
                {"\n"}For a better experience, while using our Service, I may
                require you to provide us with certain personally identifiable
                information, including but not limited to email address. The
                information that I request will be retained on your device and
                is not collected by me in any way. {"\n"}
                {"\n"}Log Data {"\n"}
                {"\n"}I want to inform you that whenever you use my Service, in
                a case of an error in the app I collect data and information
                (through third party products) on your phone called Log Data.
                This Log Data may include information such as your device
                Internet Protocol (“IP”) address, device name, operating system
                version, the configuration of the app when utilizing my Service,
                the time and date of your use of the Service, and other
                statistics. {"\n"}
                {"\n"}Cookies{"\n"}
                {"\n"}Cookies are files with a small amount of data that are
                commonly used as anonymous unique identifiers. These are sent to
                your browser from the websites that you visit and are stored on
                your device's internal memory. This Service does not use these
                “cookies” explicitly. However, the app may use third party code
                and libraries that use “cookies” to collect information and
                improve their services. You have the option to either accept or
                refuse these cookies and know when a cookie is being sent to
                your device. If you choose to refuse our cookies, you may not be
                able to use some portions of this Service. {"\n"}
                {"\n"}Service Providers{"\n"}
                {"\n"}I may employ third-party companies and individuals due to
                the following reasons: To facilitate our Service; To provide the
                Service on our behalf; To perform Service-related services; or
                To assist us in analyzing how our Service is used. I want to
                inform users of this Service that these third parties have
                access to your Personal Information. The reason is to perform
                the tasks assigned to them on our behalf. However, they are
                obligated not to disclose or use the information for any other
                purpose. {"\n"}
                {"\n"}Security{"\n"}
                {"\n"}I value your trust in providing us your Personal
                Information, thus we are striving to use commercially acceptable
                means of protecting it. But remember that no method of
                transmission over the internet, or method of electronic storage
                is 100% secure and reliable, and I cannot guarantee its absolute
                security. {"\n"}
                {"\n"}Links to Other Sites{"\n"}
                {"\n"}This Service may contain links to other sites. If you
                click on a third-party link, you will be directed to that site.
                Note that these external sites are not operated by me.
                Therefore, I strongly advise you to review the Privacy Policy of
                these websites. I have no control over and assume no
                responsibility for the content, privacy policies, or practices
                of any third-party sites or services.
                {"\n"}
                {"\n"}Children’s Privacy{"\n"}
                {"\n"}These Services do not address anyone under the age of 13.
                I do not knowingly collect personally identifiable information
                from children under 13. In the case I discover that a child
                under 13 has provided me with personal information, I
                immediately delete this from our servers. If you are a parent or
                guardian and you are aware that your child has provided us with
                personal information, please contact me so that I will be able
                to do necessary actions. {"\n"}
                {"\n"}Changes to This Privacy Policy{"\n"}
                {"\n"}I may update our Privacy Policy from time to time. Thus,
                you are advised to review this page periodically for any
                changes. I will notify you of any changes by posting the new
                Privacy Policy on this page. This policy is effective as of
                2020-08-17 {"\n"}
                {"\n"}Contact Us{"\n"}
                {"\n"}If you have any questions or suggestions about my Privacy
                Policy, do not hesitate to contact me at help@sheltie.app.
              </Text>
              <Text
                style={{
                  fontSize: 22,
                  textAlign: "center",
                  fontWeight: "bold",
                  marginTop: 15,
                  marginBottom: 10,
                }}
              >
                Terms and Conditions
              </Text>
              <Text>
                By downloading or using the app, these terms will automatically
                apply to you – you should make sure therefore that you read them
                carefully before using the app. You’re not allowed to copy, or
                modify the app, any part of the app, or our trademarks in any
                way. You’re not allowed to attempt to extract the source code of
                the app, and you also shouldn’t try to translate the app into
                other languages, or make derivative versions. The app itself,
                and all the trade marks, copyright, database rights and other
                intellectual property rights related to it, still belong to
                Cameron Hammel. Cameron Hammel is committed to ensuring that the
                app is as useful and efficient as possible. For that reason, we
                reserve the right to make changes to the app or to charge for
                its services, at any time and for any reason. We will never
                charge you for the app or its services without making it very
                clear to you exactly what you’re paying for. The Sheltie app
                stores and processes personal data that you have provided to us,
                in order to provide my Service. It’s your responsibility to keep
                your phone and access to the app secure. We therefore recommend
                that you do not jailbreak or root your phone, which is the
                process of removing software restrictions and limitations
                imposed by the official operating system of your device. It
                could make your phone vulnerable to malware/viruses/malicious
                programs, compromise your phone’s security features and it could
                mean that the Sheltie app won’t work properly or at all. The app
                does use third party services that declare their own Terms and
                Conditions. You should be aware that there are certain things
                that Cameron Hammel will not take responsibility for. Certain
                functions of the app will require the app to have an active
                internet connection. The connection can be Wi-Fi, or provided by
                your mobile network provider, but Cameron Hammel cannot take
                responsibility for the app not working at full functionality if
                you don’t have access to Wi-Fi, and you don’t have any of your
                data allowance left. If you’re using the app outside of an area
                with Wi-Fi, you should remember that your terms of the agreement
                with your mobile network provider will still apply. As a result,
                you may be charged by your mobile provider for the cost of data
                for the duration of the connection while accessing the app, or
                other third party charges. In using the app, you’re accepting
                responsibility for any such charges, including roaming data
                charges if you use the app outside of your home territory (i.e.
                region or country) without turning off data roaming. If you are
                not the bill payer for the device on which you’re using the app,
                please be aware that we assume that you have received permission
                from the bill payer for using the app. Along the same lines,
                Cameron Hammel cannot always take responsibility for the way you
                use the app i.e. You need to make sure that your device stays
                charged – if it runs out of battery and you can’t turn it on to
                avail the Service, Cameron Hammel cannot accept responsibility.
                With respect to Cameron Hammel’s responsibility for your use of
                the app, when you’re using the app, it’s important to bear in
                mind that although we endeavour to ensure that it is updated and
                correct at all times, we do rely on third parties to provide
                information to us so that we can make it available to you.
                Cameron Hammel accepts no liability for any loss, direct or
                indirect, you experience as a result of relying wholly on this
                functionality of the app. At some point, we may wish to update
                the app. The app is currently available on Android & iOS – the
                requirements for both systems(and for any additional systems we
                decide to extend the availability of the app to) may change, and
                you’ll need to download the updates if you want to keep using
                the app. Cameron Hammel does not promise that it will always
                update the app so that it is relevant to you and/or works with
                the Android & iOS version that you have installed on your
                device. However, you promise to always accept updates to the
                application when offered to you, We may also wish to stop
                providing the app, and may terminate use of it at any time
                without giving notice of termination to you. Unless we tell you
                otherwise, upon any termination, (a) the rights and licenses
                granted to you in these terms will end; (b) you must stop using
                the app, and (if needed) delete it from your device. {"\n"}
                {"\n"}Changes to This Terms and Conditions{"\n"}
                {"\n"}I may update our Terms and Conditions from time to time.
                Thus, you are advised to review this page periodically for any
                changes. I will notify you of any changes by posting the new
                Terms and Conditions on this page. These terms and conditions
                are effective as of 2020-08-17 {"\n"}
                {"\n"}Contact Us{"\n"}
                {"\n"}If you have any questions or suggestions about my Terms
                and Conditions, do not hesitate to contact me at
                help@sheltie.app.
              </Text>
              <Button
                buttonStyle={{
                  backgroundColor: COLORS.primary,
                  marginTop: 15,
                  marginBottom: 20,
                }}
                title="Close"
                onPress={() => {
                  toggleModal();
                }}
              />
            </ScrollView>
          </View>
        </Modal>
        <Spacer>
          <Image
            source={Logo}
            style={{
              width: useWindowDimensions().width - 40,
              height: useWindowDimensions().height / 3,
              marginBottom: 20,
            }}
            resizeMode="contain"
          />
        </Spacer>

        <View>
          <Button
            containerStyle={{ marginBottom: 15 }}
            type="solid"
            title={"My Favourites"}
            titleStyle={{ paddingLeft: 10 }}
            onPress={() => getfavs(email)}
            linearGradientProps={{
              colors: [COLORS.primarylight, COLORS.primary],
              start: { x: 0.25, y: 0.1 },
              end: { x: 0.25, y: 1 },
            }}
            icon={
              <Icon
                name="heart"
                size={18}
                color="white"
                style={{ alignSelf: "center" }}
              />
            }
          ></Button>
        </View>

        <View style={{ flex: 6, justifyContent: "flex-end" }}>
          <Text
            style={{
              fontSize: 24,
              marginTop: 20,
              marginBottom: 5,
              color: COLORS.darkgrey,
              textAlign: "center",
              fontWeight: "normal",
            }}
          >
            Currently signed in as
          </Text>
          <Text
            style={{
              fontSize: 26,
              marginBottom: 20,
              color: COLORS.darkgrey,
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {email}
          </Text>

          <View style={{ flex: 1, justifyContent: "flex-end" }}>
            <Button
              type="outline"
              title={"Sign Out"}
              titleStyle={{ color: COLORS.darkgrey, paddingLeft: 10 }}
              buttonStyle={styles.signoutButtonStyle}
              containerStyle={styles.signoutContainerStyle}
              onPress={() => signout()}
              icon={
                <Icon
                  name="back"
                  size={18}
                  color={COLORS.darkgrey}
                  style={{ alignSelf: "center" }}
                />
              }
            ></Button>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL("mailto: help@sheltie.app");
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "blue",
                  marginBottom: 5,
                }}
              >
                Contact: help@sheltie.app
              </Text>
            </TouchableOpacity>
            <Text style={{ textAlign: "center", marginBottom: 5 }}>
              Powered by the Petfinder API
            </Text>
            <TouchableOpacity
              onPress={() => {
                toggleModal();
              }}
            >
              <Text
                style={{ textAlign: "center", color: "blue", marginBottom: 15 }}
              >
                Privacy Policy
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
};
const styles = StyleSheet.create({
  headerStyle: {
    textAlign: "center",
    marginBottom: 40,
  },
  signoutStyle: {
    borderColor: COLORS.darkgrey,
    borderStartColor: COLORS.darkgrey,
    borderTopColor: COLORS.darkgrey,
    borderBottomColor: COLORS.darkgrey,
    color: COLORS.darkgrey,
  },
  signoutContainerStyle: {
    borderColor: COLORS.darkgrey,
    borderStartColor: COLORS.darkgrey,
    borderTopColor: COLORS.darkgrey,
    color: COLORS.darkgrey,
    marginBottom: 40,
  },
  signoutButtonStyle: {
    borderColor: COLORS.darkgrey,
    borderStartColor: COLORS.darkgrey,
    borderTopColor: COLORS.darkgrey,
    borderBottomColor: COLORS.darkgrey,
    color: COLORS.darkgrey,
  },
  favouritesStyle: {},
  viewStyle: {
    flex: 1,
    paddingBottom: 20,
    flexDirection: "column",
    backgroundColor: "#ffffff",
  },
});

export default AccountScreen;
