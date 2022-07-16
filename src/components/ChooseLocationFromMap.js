import React, { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from "react-native";
import { Button } from "react-native-elements";
import MapView from "react-native-maps";

export default function LocationPickerDemo({
  state,
  onRegionChange,
  pinching,
}) {
  const { region } = state;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={onRegionChange}
        rotateEnabled={pinching}
        zoomEnabled={pinching}
        scrollEnabled={pinching}
        pitchEnabled={pinching}
      ></MapView>
      <View style={styles.markerFixed}>
        <Image
          style={styles.marker}
          source={require("../assets/map_marker.png")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height / 2.8,
  },

  markerFixed: {
    left: Dimensions.get("window").width / 2,
    position: "absolute",
    top: 100,
  },
  marker: {
    height: 48,
    width: 48,
  },
});
