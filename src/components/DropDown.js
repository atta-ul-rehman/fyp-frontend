import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";

const DropdownComponent = ({ value, setvalue, data,catagory }) => {
  const [show, setshow] = useState(true);
  const ps = (item) => {
    setshow(!show);
    setvalue(item.name);
  };
  const [checked, setchecked] = useState([]);
  return (
    <View style={{}}>
      <TouchableOpacity style={styles.dropdown} onPress={() => setshow(!show)}>
        <Text style={{ fontSize: 18 }}>
          {!value ? catagory : value}{" "}
        </Text>
        <Icon
          name={show ? "expand-more" : "expand-less"}
          type="material"
          color={"grey"}
          size={22}
        />
      </TouchableOpacity>
      {!show &&
        data.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={{
              marginHorizontal: 16,
              paddingVertical: 8,
              borderBottomWidth: 1,
              borderColor: "#ececec",
            }}
            onPress={() => {
              ps(item);
            }}
          >
            <Text
              style={{ color:  "black" }}
            >
              {item.name}{" "}
            </Text>
          </TouchableOpacity>
        ))}
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 12,
    borderWidth: 1,
  },
});
