import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";
import MenuCard from "../../components/MenuCard";

export function Route1({ navigation, data, deliveryTime }) {
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.view2}>
        <FlatList
          style={{ backgroundColor: "white" }}
          data={data}
          keyExtractor={(index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("PreferenceScreen", {
                  id: item._id,
                  deliveryTime: deliveryTime,
                });
              }}
            >
              <MenuCard
                productName={item.meal}
                image={item.image}
                price={item.price}
                productDetails={item.details}
              />
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={true}
        />
      </View>
    </View>
  );
}

export const Route2 = () => <View style={styles.scene} />;
export const Route3 = () => <View style={styles.scene} />;
export const Route4 = () => (
  <View style={{ ...styles.scene, backgroundColor: "green" }} />
);
export const Route5 = () => <View style={styles.scene} />;
export const Route6 = () => <View style={styles.scene} />;
export const Route7 = () => <View style={styles.scene} />;
export const Route8 = () => <View style={styles.scene} />;

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    backgroundColor: "#673ab7",
  },

  view2: {
    marginTop: 5,
    paddingBottom: 20,
    borderColor: "black",
    paddingBottom: 10,
  },

  scene2: { backgroundColor: "#673ab7" },
});
