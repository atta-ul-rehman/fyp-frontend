import React, { useEffect, useState } from "react";

// import all the components we are going to use
import { SafeAreaView, StyleSheet, View, Image, Text } from "react-native";

import ViewMorebutton from "../components/ViewMore";
import { highlightData } from "../global/Data";

const Highlights_from_business = () => {
  const [mobileno, setmobileno] = useState(highlightData);
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ paddingHorizontal: 5 }}>
        <Text
          style={{
            color: "black",
            fontSize: 22,
            fontWeight: "500",
            paddingVertical: 10,
          }}
        >
          Highlights from The Business
        </Text>
        <View
          style={{
            padding: 5,
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          {highlightData.map((item, index) => (
            <Highlights key={index} text={item.name} imageSource={item.image} />
          ))}
        </View>
      </View>
      <ViewMorebutton title={"View More"} />
    </SafeAreaView>
  );
};

export default Highlights_from_business;
const Highlights = ({ imageSource, text }) => (
  <View style={{ justifyContent: "center", alignItems: "center", padding: 5 }}>
    <Image source={imageSource} style={{ width: 40, height: 40 }} />
    <Text style={{ fontSize: 12, padding: 5 }}>{text}</Text>
  </View>
);
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
