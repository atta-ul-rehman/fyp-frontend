import { Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { Icon } from "react-native-elements";
import ViewMorebutton from "../components/ViewMoreButton";
export default function Payment({
  navigation,
  onPress,
  pressed,
  setModalVisible,
  modalVisible,
  setpressed,
}) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.1)",
      }}
    >
      <View style={{ padding: 5, height: 230, backgroundColor: "white" }}>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => setModalVisible(false)}
        >
          <Icon name="remove" type="material" size={30} />
        </TouchableOpacity>

        <Text style={{ fontWeight: "600", fontSize: 22, paddingVertical: 10 }}>
          {" "}
          Choose payment method
        </Text>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 20,
            borderWidth: 2,
            borderColor: "#ececec",
          }}
          onPress={() => {
            setpressed(true);
          }}
        >
          <Text> Cash on Delivery </Text>
          {pressed && <Icon type="foundation" name="check" size={20} />}
        </TouchableOpacity>
        <ViewMorebutton title={"place order"} OnPress={onPress} />
      </View>
    </View>
  );
}
