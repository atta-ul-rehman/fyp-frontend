import { Text, View, SafeAreaView } from "react-native";
import React, { useState, useRef, useEffect } from "react";

export default function SaloonOrder({ navigation }) {
  const [checked, setchecked] = useState("");
  const [pincode, setpincode] = useState("");
  const [details, setdetails] = useState("");
  const [val, setvalue] = useState(null);

  return (
    <SafeAreaView style={{ padding: 5, flex: 1, marginTop: 10 }}>
      <View style={{}}>
        <Text
          style={{
            paddingVertical: 10,
            fontSize: 18,
            fontWeight: "600",
          }}
        >
          Appointment Service
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "400",
            paddingHorizontal: 5,
            borderBottomWidth: 3,
            borderBottomColor: "#ececec",
          }}
        >
          Service
        </Text>
      </View>
      <View style={{}}>
        <Text style={{ fontSize: 18, fontWeight: "600", paddingVertical: 10 }}>
          Zip Code:{" "}
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "400",
            paddingHorizontal: 5,
            borderBottomWidth: 3,
            borderBottomColor: "#ececec",
          }}
        >
          54000
        </Text>
      </View>
      <View>
        <Text style={{ fontSize: 18, fontWeight: "600", paddingVertical: 10 }}>
          Details:
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "400",
            paddingHorizontal: 5,
            borderBottomWidth: 3,
            borderBottomColor: "#ececec",
          }}
        >
          {details}This should be perfiect or else i woiuld jill you you
        </Text>
      </View>
      <View>
        <Text style={{ fontSize: 18, fontWeight: "600", paddingVertical: 10 }}>
          Timings:
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "400",
            paddingHorizontal: 5,
            borderBottomWidth: 3,
            borderBottomColor: "#ececec",
          }}
        >
          Tommorrow
        </Text>
      </View>
      <View>
        <Text style={{ fontSize: 18, fontWeight: "600", paddingVertical: 10 }}>
          Status:
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "400",
            paddingHorizontal: 5,
            borderBottomWidth: 3,
            borderBottomColor: "#ececec",
          }}
        >
          Pending...
        </Text>
      </View>
    </SafeAreaView>
  );
}
