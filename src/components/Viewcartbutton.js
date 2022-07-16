import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  Image,
  Platform,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { colors } from "../global/styles";
import { Icon, withBadge } from "react-native-elements";

const SCREEN_WIDTH = Dimensions.get("window").width;

const Viewcartbutton = ({ totalUSD, quantity, cartpress, text }) => {
  const BadgeIcon = withBadge(quantity)(Icon);
  return (
    <TouchableOpacity
      style={{
        alignItems: "center",
        padding: 15,
        borderColor: "#ececec",
        borderWidth: 1,
        marginHorizontal: 5,
      }}
      onPress={cartpress}
    >
      <View style={styles.view17}>
        <View style={styles.view18}>
          <Text style={styles.text10}>
            {text} {totalUSD}
          </Text>
        </View>
        <View style={styles.view13}>
          <Text style={styles.text13}>{quantity}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default Viewcartbutton;
const styles = StyleSheet.create({
  view17: {
    flexDirection: "row",
    backgroundColor: colors.buttons,
    height: 50,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 15,
    width: SCREEN_WIDTH - 40,
  },
  view18: {
    marginLeft: 5,
    borderRadius: 15,
  },
  text10: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontWeight: "bold",
    fontSize: 18,
    color: colors.cardbackground,
  },
  view13: {
    borderWidth: 1,
    marginRight: 10,
    borderColor: colors.cardbackground,
    borderRadius: 6,
    paddingBottom: 2,
  },
  text13: {
    paddingHorizontal: 3,
    fontWeight: "bold",
    fontSize: 18,
    color: colors.cardbackground,
  },
});
