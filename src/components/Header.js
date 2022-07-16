import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../global/styles";

import { Icon } from "react-native-elements";

export default function Header({ title, type, navigation }) {
  return (
    <View style={styles.header}>
      <View style={{ paddingLeft: 5 }}>
        <Icon
          name={type}
          color={colors.heaherText}
          size={24}
          onPress={() => navigation.goBack()}
        />
      </View>
      <View>
        <Text style={styles.headerText}>{title}</Text>
      </View>
      <Text></Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    backgroundColor: colors.buttons,
    height: 50,
    marginTop: 0,
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerText: {
    color: colors.heaherText,
    fontSize: 22,
    fontWeight: "bold",
    alignItems: "center",
  },
});
