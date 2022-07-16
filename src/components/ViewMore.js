import React from "react";
import { View } from "react-native";
import { Button } from "react-native-elements";

const ViewMorebutton = ({ OnPress, title }) => {
  return (
    <View style={{ marginHorizontal: 5 }}>
      <Button
        title={title}
        buttonStyle={{
          borderWidth: 1,
          borderColor: "grey",
          backgroundColor: "white",
        }}
        titleStyle={{ fontSize: 16, fontWeight: "400", color: "black" }}
        onPress={OnPress}
      />
    </View>
  );
};
export default ViewMorebutton;
