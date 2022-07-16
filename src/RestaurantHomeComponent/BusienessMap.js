import React, { useEffect, useState } from "react";

// import all the components we are going to use
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";

const Business_map = ({ navigation, business_address, map_points }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{
          width: "100%",
          height: 140,
          borderWidth: 1,
        }}
        onPress={() =>
          navigation.navigate("TopTabNavigator", {
            screen: "indoor",
          })
        }
      ></TouchableOpacity>
      <View style={{ paddingHorizontal: 5 }}>
        <View
          style={{
            paddingHorizontal: 0,
            paddingVertical: 10,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "500" }}>
            Get directions
          </Text>
          <Icon name="save" type="material" size={22} />
        </View>
        <Text style={{ fontSize: 15, width: "50%" }}>{business_address}</Text>
      </View>
      <View
        style={{
          borderWidth: 4,
          borderColor: "#ececec",
          marginTop: 20,
        }}
      ></View>
    </View>
  );
};

export default Business_map;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
    marginVertical: 30,
  },
});
