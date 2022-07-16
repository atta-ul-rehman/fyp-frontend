import {
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Image,

} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect, useRef } from "react";
import { Icon } from "react-native-elements";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { BaseUrl } from "../constants/Baseurl";
import * as Location from "expo-location";
import { useIsFocused } from "@react-navigation/native";
import { useToast } from "react-native-fast-toast";
const SCREEN_WIDTH = Dimensions.get("window").width;
export default function PreHomeScreen({ navigation }) {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const authToken = useSelector((state) => state.authToken.authToken);
  const get_logined = useSelector((state) => state.LoginedUser.userLocation);
  const Mealitems = useSelector(
    (state) => state.cartReducer.selectedItems.items
  );
  const toast=useToast()
  //const [currentAppState, setCurrentAppState] = useState(appState.current);
  // useEffect(() => {
  //   const subscription = AppState.addEventListener(
  //     "change",
  //     handleAppStateChange
  //   );
  //   return () => {
  //     subscription.remove();
  //   };
  // }, [currentAppState]);
  // const handleAppStateChange = (nextAppState) => {
  //   const t = 100;
  //   if (nextAppState == "background") {
  //     console.log("fd");
  //     Order_Delivery_time_Details(100);
  //     seti(1);
  //   } else if (nextAppState == "active" && i !== null) {
  //     Order_Delivery_time_Details(50);
  //   }
  //   setCurrentAppState(nextAppState);
  //   console.log(currentAppState);
  // };

  const business_searched = (name) => {
    dispatch({
      type: "New_busniess_searched",
      payload: name,
    });
  };
  const Logined_User = (name) => {
    dispatch({
      type: "Get_Logined",
      payload: name,
    });
  };
  const activeUserLocation = useSelector(
    (state) => state.LoginedUser.userLocation
  );
  const Logined_User_Location = (name) => {
    dispatch({
      type: "Save_User_location",
      payload: name,
    });
  };
  async function GetCurrentLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    console.log("status", status);
    if (status !== "granted") {
      Alert.alert(
        "Permission not granted",
        "Allow the app to use location service.",
        [{ text: "OK" }],
        { cancelable: false }
      );
    }
    let { coords } = await Location.getCurrentPositionAsync();
    Logined_User_Location(coords);
  }

  // const clearAppData = async function () {
  //   try {
  //     const keys = await AsyncStorage.getAllKeys();
  //     console.log("clearing app data...", keys);
  //     await AsyncStorage.multiRemove(keys);
  //     console.log("App data cleared");
  //   } catch (error) {
  //     console.error("Error clearing app data.");
  //   }
  // };
  // const reset_Order_timer = () => {
  //   dispatch({
  //     type: "Set_Delivery_leaving_time_to_default",
  //   });
  // };
  // const Order_Delivery_time_Details = (t) => {
  //   dispatch({
  //     type: "set_DeliveryTime",
  //     payload: { time: t, id: 200 },
  //   });
  // };
  const getData = async () => {
    await fetch(`http://${BaseUrl}:5000/api/v1/auth/me`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((response) => response.json())
      .then((json) => Logined_User(json.data))
      .catch((error) => console.error(error));
  };
  useEffect(() => {
    GetCurrentLocation();
    getData();
  }, [isFocused]);
  const USER = useSelector((state) => state.LoginedUser.LoginedUser);
  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingBottom: 30 }}>
        <ImageBackground
          source={require("../../aseets/PreHome/pablo-pacheco-D3Mag4BKqns-unsplash.jpg")}
          style={{
            width: SCREEN_WIDTH,
            height: 250,
            justifyContent: "flex-end",
          }}
        >
          <Text
            style={{
              fontSize: 35,
              color: "white",
              fontWeight: "600",
              paddingVertical: 40,
              paddingLeft: 5,
            }}
          >
            Find Next Business Here 
          </Text>
        </ImageBackground>
      
      </View>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "600",
          alignSelf: "center",
          paddingBottom: 40,
        }}
      >
        Browse Business By Catagory{" "}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        <TouchableOpacity
          style={{ padding: 10, alignItems: "center" }}
          onPress={() => {
            toast.show("Coming Soon", {
            duration: 1000,
            style: { padding: 0, backgroundColor: "rgba(120,120,120,0.9)" },
          });
          }}
        >
          <Image
            source={require("../../aseets/PreHome/gym.png")}
            style={{ height: 40, width: 40 }}
          />
          <Text> Gyms </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ padding: 10, alignItems: "center" }}
          onPress={() => {
            navigation.navigate("Homescreen"), business_searched("saloon");
          }}
        >
          <Image
            source={require("../../aseets/PreHome/hair-dryer.png")}
            style={{ height: 40, width: 40 }}
          />
          <Text> Slaooons </Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={{ padding: 10, alignItems: "center" }}
          onPress={() => {
            navigation.navigate("Homescreen"), business_searched("res");
          }}
        >
          <Image
            source={require("../../aseets/PreHome/restaurant.png")}
            style={{ height: 40, width: 40 }}
          />
          <Text> Restaurant/Cafes </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
