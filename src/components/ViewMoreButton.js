import React from "react";
import { View } from "react-native";
import { Button } from "react-native-elements";
import { parameters } from "../global/styles";

const ViewMorebutton = ({ OnPress, title }) => {
  return (
    <View
      style={{
        width: "95%",
        paddingVertical: 5,
        paddingTop: 10,
        alignSelf: "center",
      }}
    >
      <Button
        title={title}
        buttonStyle={parameters.styledButton}
        titleStyle={parameters.buttonTitle}
        onPress={OnPress}
      />
    </View>
  );
};
export default ViewMorebutton;
