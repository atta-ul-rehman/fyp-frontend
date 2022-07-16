import React from "react";
import { StyleSheet, View, Text } from "react-native";

import { Icon } from "react-native-elements";

const StarRating = (props) => {
  let stars = [];
  // Loop 5 times
  for (var i = 1; i <= 5; i++) {
    // set the path to filled stars
    let name = "star";
    if (i === Math.ceil(props.ratings) && (props.ratings * 10) % 10 > 5) {
      name = "star-half";
    }
    // If ratings is lower, set the path to unfilled stars
    else if (i > props.ratings) {
      name = "star-border";
    }

    stars.push(
      <Icon
        type="material"
        name={name}
        size={props.size}
        style={styles.star}
        key={i}
        color={"red"}
      />
    );
  }

  return (
    <View style={styles.container}>
      {stars}
      <Text style={styles.text}>{props.reviews}</Text>
    </View>
  );
};

export default StarRating;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  star: {
    color: "#FF8C00",
  },
  text: {
    fontSize: 12,
    marginLeft: 5,
    color: "#444",
  },
});
