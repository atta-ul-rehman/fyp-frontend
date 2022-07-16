import React, { useState, useEffect, useRef } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Pressable,
  Image,
  Dimensions,
  StatusBar,
  Modal,
} from "react-native";
import { Icon } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { io } from "socket.io-client";
const SCREEN_WIDTH = Dimensions.get("window").width;
import { BaseUrl } from "../../constants/Baseurl";
export default function OrderStatus({ navigation, route }) {
  const socket = useRef();
  const { id, user_id } = route.params;
  const [user, setuser] = useState(user_id);
  const [color, setcolor] = useState("red");
  const [status2, setStatus] = useState();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const getOrders = async () => {
    try {
      const response = await fetch(`http://${BaseUrl}:5000/api/v1/order/${id}`);
      const json = await response.json();
      setData(json.data);
      setStatus(json.data.Status);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getOrders();
    console.log("data", user);
  }, [loading]);
  useEffect(() => {
    socket.current = io(`http://${BaseUrl}:5000`);
  }, []);
  useEffect(() => {
    socket.current.emit("addUser", user);
    socket.current.on("getUsers", (users) => {
      console.log(users);
    });
  }, [user]);
  useEffect(() => {
    socket.current.on("getOrderStatus", (data) => {
      setStatus(data.text);
    });
  }, [status2]);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 10,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
          Track Order {status2}
        </Text>
      </View>
      <Tracker
        Iconname="grading"
        status="Placed"
        color={status2 === "placed" && color}
      />
      <Tracker
        Iconname="done-all"
        status="Confirmed"
        color={status2 === "confirmed" && color}
      />
      <Tracker
        Iconname="microwave"
        status="Preparing"
        color={status2 === "prepared" && color}
      />
      <Tracker
        Iconname="local-shipping"
        status="Delivered"
        color={status2 === "deliverd" && color}
      />
      <Tracker
        Iconname="sentiment-satisfied-alt"
        status="Completed"
        color={status2 === "completed" && color}
      />
      <Tracker
        Iconname="event-busy"
        status="Cancelled"
        color={status2 == "cancelled" && color}
      />
    </SafeAreaView>
  );
}

const Tracker = (props) => (
  <TouchableOpacity
    style={{
      flexDirection: "row",
      justifyContent: "center",
    }}
    onPress={props.onPress}
  >
    <View style={{ marginBottom: 45, width: "40%", alignItems: "flex-end" }}>
      <Icon
        name={props.Iconname}
        type="material"
        color={props.color}
        size={32}
      />
    </View>
    <View
      style={{
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        paddingHorizontal: 15,
      }}
    >
      <View
        style={{
          borderWidth: 4,
          borderRadius: 100,
          width: 2,
          marginBottom: 10,
          borderColor: props.color,
        }}
      />
      <View
        style={{
          borderWidth: 1,
          borderRadius: 1,
          width: 2,
          height: 60,
          borderColor: "#ececec",
        }}
      />
    </View>
    <View style={{ width: "40%" }}>
      <Text style={{ fontSize: 14, fontWeight: "500", color: props.color }}>
        {props.status}
      </Text>
    </View>
  </TouchableOpacity>
);
