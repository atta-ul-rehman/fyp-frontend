import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  Dimensions,
} from "react-native";
import React, { useState, useRef } from "react";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { colors, parameters } from "../global/styles";

const Myaccount = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          marginVertical: 10,
          alignItems: "flex-start",
          flexDirection: "row",
        }}
      >
        <Icon icon="user-circle" text="User" />
      </View>
      <View
        style={{
          borderBottomColor: colors.grey4,
          borderBottomWidth: 3,
          marginTop: 5,
        }}
      />
      <View styles={{ borderWidth: 2, borderBottomColor: "black" }}>
        <Icon
          onPress={() => navigation.navigate("Favorites")}
          icon="gratipay"
          text="Favourites"
        />
        <Icon
          onPress={() => navigation.navigate("Wallet")}
          icon="credit-card"
          text="Wallet"
        />
        <Icon icon="tag" text="Promotions" />
        <Icon icon="life-ring" text="Help" />
        <Icon icon="cog" text="Settings" />
      </View>
    </View>
  );
};

export default Myaccount;

const Icon = (props) => (
  <TouchableOpacity style={styles.iccon} onPress={props.onPress}>
    <FontAwesome5 name={props.icon} color={colors.grey2} size={28} />
    <View style={{ marginLeft: 10, marginTop: 4 }}>
      <Text>{props.text}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  iccon: {
    alignItems: "flex-start",
    flexDirection: "row",
    marginTop: 25,
    paddingLeft: 15,
  },
});
