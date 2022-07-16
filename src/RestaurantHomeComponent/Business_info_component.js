import React, { useEffect, useState } from "react";
// import all the components we are going to use
import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  Text,
  Platform,
  Linking,
  TouchableOpacity,
} from "react-native";
import { Icon } from "react-native-elements";
import ViewMorebutton from "../components/ViewMore";
import { useSelector } from "react-redux";
const Business_info_component = ({
  navigation,
  website,
  phone_Number,
  business_name,
  moreInfo,
}) => {
  const Business_name = useSelector(
    (state) => state.businessName?.businessName
  );
  const dialCall = ({ phn }) => {
    let phoneNumber = phone_Number;
    if (Platform.OS === "android") {
      phoneNumber = "tel:${" + phone_Number + "}";
    } else {
      phoneNumber = "telprompt:${" + phone_Number + "}";
    }
    Linking.openURL(phoneNumber);
  };
  const handlePress = async (url) => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(website);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(website);
    } else {
      Alert.alert(`Don't know how to open this URL: ${website}`);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ paddingHorizontal: 5 }}>
        <Text
          style={{
            color: "black",
            fontSize: 22,
            fontWeight: "600",
            paddingVertical: 10,
          }}
        >
          Business Info
        </Text>
        <TouchableOpacity
          style={styles.view3}
        >
          {Business_name == "restaurant" ? (
            <Text style={{}}>Order Online</Text>
          ) : (
            <Text style={{}}> Book Online</Text>
          )}
          <Icon
            name="book-online"
            type="material"
            color="black"
            size={18}
            style={{ paddingRight: 5 }}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.view3} onPress={dialCall}>
          <Text style={{}}>Call {phone_Number}</Text>
          <Icon
            name="call"
            type="material"
            color="black"
            size={18}
            style={{ paddingRight: 5 }}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.view3} onPress={handlePress}>
          <Text style={{}}>Website {website}</Text>
          <Icon
            name="language"
            type="material"
            color="black"
            size={18}
            style={{ paddingRight: 5 }}
          />
        </TouchableOpacity>
      </View>
      <ViewMorebutton onPress={moreInfo} title="View More" />
      <View
        style={{
          borderWidth: 4,
          borderColor: "#ececec",
          marginTop: 20,
        }}
      ></View>
    </SafeAreaView>
  );
};

export default Business_info_component;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
  },
  imageThumbnail: {
    justifyContent: "center",
    alignItems: "center",
    height: 100,
    width: 100,
  },
  view3: {
    flexDirection: "row",
    paddingVertical: 10,
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
    borderBottomColor: "#eceeec",
  },
});
