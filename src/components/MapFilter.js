import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Icon } from "react-native-elements";
import LocationPickerDemo from "./ChooseLocationFromMap";
import ViewMorebutton from "./ViewMoreButton";
import { BaseUrl } from "../constants/Baseurl";
import { useSelector } from "react-redux";
import { useToast } from "react-native-fast-toast";

export default function MapFilter({
  navigation,
  radius,
  setRadius,
  pressed,
  onRegionChange,
  setModalVisible,
  state,
}) {
  const [loading, setloading] = useState(false);
  const [DeliveryAddress, setDeliveryAddress] = useState();
  const authToken = useSelector((state) => state.authToken.authToken);
  const toast = useToast();
  const updateAddress = async () => {
    setloading(true);
    try {
      const response = await fetch(
        `http://${BaseUrl}:5000/api/v1/auth/updateDetails`,
        {
          method: "PUT",
          headers: {
            Accept: "apllication/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            lat: state.region.latitude,
            lng: state.region.longitude,
          }),
        }
      );
      const json = await response.json();
      if (json.success) {
        setloading(false);
        //console.log(state.region);
        setDeliveryAddress(
          json?.data?.DeliveryAddress.split(/[,]+/).splice(0, 2).join()
        );
      } else {
        setloading(false);
        toast.show(json.error, {
          duration: 1000,
          style: { padding: 0, backgroundColor: "rgba(120,120,120,0.9)" },
        });
      }
    } catch (err) {
      setloading(false);
      toast.show(err, {
        duration: 1000,
        style: { padding: 0, backgroundColor: "rgba(120,120,120,0.9)" },
      });
    }
  };
  useEffect(() => {
    updateAddress();
  }, [state]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.7)",
      }}
    >
      <View style={{ backgroundColor: "white", height: 450 }}>
        <View>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: -30,
              zIndex: 1,
            }}
            onPress={() => setModalVisible(false)}
          >
            <Icon
              name="remove"
              type="material"
              size={30}
              style={{ zIndex: 2 }}
            />
          </TouchableOpacity>
        </View>
        <LocationPickerDemo
          state={state}
          onRegionChange={onRegionChange}
          pinching={true}
          marker={false}
        />
        <View style={styles.view1}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",

              paddingHorizontal: 5,
            }}
          >
            Choose Location and Radius:
          </Text>

          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              paddingVertical: 5,
            }}
          >
            <View style={{ width: "20%" }}>
              <Icon name="place" type="material" size={20} />
            </View>
            <View
              style={{
                justifyContent: "space-between",
                flexDirection: "row",
                alignItems: "center",
                borderBottomWidth: 1,
                borderBottomColor: "#ececec",
                width: "80%",
                padding: 10,
              }}
            >
              <Text>
                {" "}
                {loading ? (
                  <ActivityIndicator size="small" />
                ) : DeliveryAddress ? (
                  DeliveryAddress
                ) : (
                  "Street 7 Eden ,DC"
                )}
              </Text>
              <Icon name="navigate-next" type="material" size={20} />
            </View>
          </View>

          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              paddingVertical: 5,
            }}
          >
            <View style={{ width: "12%", marginLeft: 25 }}>
              <Image
                source={require("../../aseets/radius.png")}
                style={{ width: 20, height: 20 }}
              />
            </View>
            <View
              style={{
                justifyContent: "space-between",
                flexDirection: "row",
                alignItems: "center",
                borderBottomWidth: 1,
                borderBottomColor: "#ececec",
                width: "80%",
                padding: 10,
              }}
            >
              <TextInput
                placeholder="0 Radius"
                placeholderTextColor="#cfcfcf"
                style={{ flex: 1, padding: 0 }}
                onChangeText={(value) => setRadius(value)}
                keyboardType="number-pad"
              />
              <Text>KM</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            alignItems: "center",
          }}
        >
          <ViewMorebutton title={"Apply Filter"} OnPress={pressed} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  view1: {
    borderBottomWidth: 3,
    borderBottomColor: "#fafafa",
    paddingHorizontal: 10,
  },
  apply_filter: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
    borderWidth: 1,
    padding: 15,
    borderRadius: 5,
    marginHorizontal: 5,
    marginVertical: 10,
  },
});
