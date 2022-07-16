import React from "react";
import { Text, Image, TouchableOpacity, Dimensions } from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;

const ViewPhotocard = ({ navigation, image, type, totalPhotos, onPress }) => {
  return (
    <TouchableOpacity
      style={{
        paddingHorizontal: 5,
        paddingVertical: 5,
        marginVertical: 5,
      }}
      onPress={onPress}
    >
      <Image
        source={{ uri: image }}
        style={{
          width: 140,
          height: 120,
          borderColor: "#ececec",
          borderWidth: 1,
        }}
      />
      <Text
        style={{
          position: "absolute",
          color: "white",
          bottom: 30,
          fontSize: 17,
          fontWeight: "bold",
          left: 20,
        }}
      >
        {type}
      </Text>
      <Text
        style={{
          position: "absolute",
          color: "white",
          bottom: 10,
          fontSize: 14,
          fontWeight: "500",
          left: 20,
        }}
      >
        {totalPhotos}
      </Text>
    </TouchableOpacity>
  );
};
export default ViewPhotocard;
