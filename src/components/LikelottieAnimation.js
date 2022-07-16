import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import LottieView from "lottie-react-native";

const Screen = Dimensions.get("window");

export default function LikeLottieAnimation({ isLiked, pressed, _id }) {
  const animation = React.useRef(null);

  React.useEffect(() => {
    if (isLiked) {
      animation.current.play(15, 95);
    } else {
      animation.current.play(0, 19);
    }
  }, [isLiked]);

  return (
    <View style={styles.actions}>
      <TouchableOpacity
        onPress={() => {
          pressed(_id);
        }}
      >
        {/* <LottieView
          ref={animation}
          style={styles.heartLottie}
          source={require("../../aseets/Lottieview/like-button.json")}
          autoPlay={false}
          loop={false}
        /> */}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  heartLottie: {
    width: 50,
    height: 50,
    marginLeft: -5,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 20,
  },
});
