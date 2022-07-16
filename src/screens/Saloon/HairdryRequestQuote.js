import { Text, View, TextInput, ScrollView } from "react-native";
import React, { useState, useRef } from "react";
import ViewMorebutton from "../../components/ViewMoreButton";
import DropdownComponent from "../../components/DropDown";
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import { SafeAreaView } from "react-native-safe-area-context";
import { BaseUrl } from "../../constants/Baseurl";
import Header from "../../components/Header";
import { useToast } from "react-native-fast-toast";
import { useSelector } from "react-redux";
export default function HairQuote({ navigation, route }) {
  const { id } = route.params;
  const toast = useToast();
  const authToken = useSelector((state) => state.authToken.authToken);
  const [pincode, setpincode] = useState("");
  const [details, setdetails] = useState("");
  const [service, setService] = useState("");
  const [val, setvalue] = useState(null);
  const [data2, setData2] = useState([
    { name: "Tommorrow", id: 1 },
    { name: "today", id: 2 },
    { name: "three days after", id: 3 },
    { name: "After this week", id: 4 },
  ]);
  const bookAppoinment = async () => {
    await fetch(`http://${BaseUrl}:5000/api/v1/saloon/${id}/order`, {
      method: "POST",
      headers: {
        Accept: "apllication/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        zipCode: pincode,
        Timings: val,
        SaloonService: RadioButton,
        SaloonDetails: details,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          navigation.navigate("Homescreen");
          toast.show("Appointment booked SuccessFully", {
            duration: 1000,
            style: {
              padding: 0,
              backgroundColor: "rgba(120,120,120,0.9)",
            },
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const [RadioButton, setRadiobutton] = useState();
  return (
    <SafeAreaView style={{ padding: 5, flex: 1, backgroundColor: "white" }}>
      <ScrollView>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 10,
          }}
        >
          <Text
            style={{
              fontSize: 22,
              fontWeight: "600",
              alignSelf: "center",
            }}
          >
            What service you are Looking to Start?{" "}
          </Text>
        </View>
        <View
          style={{
            justifyContent: "space-evenly",
            padding: 10,
          }}
        >
          <RadioButtonGroup
            containerStyle={{ marginBottom: 10 }}
            selected={RadioButton}
            onSelected={(value) => {
              setRadiobutton(value);
            }}
            radioBackground="red"
          >
            <RadioButtonItem
              value="Haircut"
              label="Haircut"
              style={{ margin: 5 }}
            />
            <RadioButtonItem
              value="Coloring"
              label="Coloring"
              style={{ margin: 5 }}
            />
            <RadioButtonItem
              value="Extension"
              label="Extension"
              style={{ margin: 5 }}
            />
            <RadioButtonItem
              value="Hair treatment"
              label="Hair treatment"
              style={{ margin: 5 }}
            />
            <RadioButtonItem
              value="Bridal/Groom Hair Service"
              label="Bridal/Groom Hair Service"
              style={{ margin: 5 }}
            />
            <RadioButtonItem
              value="Other"
              label="Other"
              style={{ margin: 5 }}
            />
          </RadioButtonGroup>
        </View>
        <View style={{ marginBottom: 20 }}>
          <Text
            style={{ fontSize: 18, fontWeight: "600", paddingVertical: 10 }}
          >
            {" "}
            Timings{" "}
          </Text>
          <DropdownComponent data={data2} value={val} setvalue={setvalue} />
        </View>
        <View>
          <Text
            style={{ fontSize: 18, fontWeight: "600", paddingVertical: 10 }}
          >
            {" "}
            Enter Some Details{" "}
          </Text>
          <TextInput
            style={{
              paddingVertical: 10,
              borderColor: "#cfcfcf",
              borderWidth: 1,
              paddingHorizontal: 5,
            }}
            placeholder="Enter Details"
            value={details}
            keyboardType={"default"}
            onChangeText={(e) => setdetails(e)}
            numberOfLines={5}
          />
        </View>
        <View style={{ marginBottom: 30 }}>
          <Text
            style={{ fontSize: 18, fontWeight: "600", paddingVertical: 10 }}
          >
            {" "}
            Enter Zip Code{" "}
          </Text>
          <TextInput
            style={{
              paddingVertical: 10,
              borderColor: "#cfcfcf",
              borderWidth: 1,
              paddingHorizontal: 5,
            }}
            placeholder="Enter Details"
            value={pincode}
            keyboardType={"default"}
            onChangeText={(e) => setpincode(e)}
          />
        </View>
      </ScrollView>
      <View
        style={{
          alignItems: "center",
        }}
      >
        {val !== null && pincode != "" && (
          <ViewMorebutton title="Book Appointment" OnPress={bookAppoinment} />
        )}
      </View>
    </SafeAreaView>
  );
}
