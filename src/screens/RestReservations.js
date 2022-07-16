import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Modal,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { Icon } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import { BaseUrl } from "../constants/Baseurl";
import { useToast } from "react-native-fast-toast";

import { SafeAreaView } from "react-native-safe-area-context";
import ViewMorebutton from "../components/ViewMoreButton";
import DropdownComponent from "../components/DropDown";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function RestResevation({ navigation, route }) {
  const { id } = route.params;
  const toast=useToast()
  const [person, setPerson] = useState();
  const textinput2 = useRef();
  const [time, setTime] = useState(new Date());
  const [time1, setTime1] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [restaurantsData, setrestaurantsData] = useState();
  const authToken = useSelector((state) => state.authToken.authToken);
  const personData = [
    { name: 2 },
    { name: 3 },
    { name: 4 },
    { name: 6 },
    { name: 8 },
    { name: "more than 6" },
  ];
  const business_searched = useSelector(
    (state) => state?.businessName.businessName
  );
  useEffect(() => {
    const getData = async () => {
      await fetch(`http://${BaseUrl}:5000/api/v1/${business_searched}/${id}`)
        .then((response) => response.json())
        .then((json) => {
          setrestaurantsData(json.data.tableAvailable);
          console.log(json.data.tableAvailable)
        })
        .catch((error) => console.error(error));
    };
    getData();
  }, [id]);
const reservationOccur=async (t,d,p)=>{
    await fetch(`http://${BaseUrl}:5000/api/v1/${business_searched}/${id}/order`,
    {
        method: "POST",
          headers: {
            Accept: "apllication/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
              Reservation:{
                  person:p,
                  time:t,
                  date:d
              }
          }),
        }
    )
        .then((response) => response.json())
        .then((json) => {
         if(json.success)
         {
            navigation.navigate("Homescreen");
            toast.show("Reserved Succesfully", {
                duration: 2000,
                style: { padding: 0, backgroundColor: "rgba(120,120,120,0.9)" },
              });
         }
         else{
            toast.show(json.error, {
                duration: 2000,
                style: { padding: 0, backgroundColor: "rgba(120,120,120,0.9)" },
              });
         }
        })
        .catch((err) => {
            toast.show("err",err, {
                type: err,
                duration: 2000,
                style: { padding: 0, backgroundColor: "rgba(120,120,120,0.9)" },
              });
        });
}
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
    setShow(false);
  };
  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };
  function tConv24(time) {
    var ts = time;
    var H = +ts.substr(0, 2);
    var h = H % 12 || 12;
    h = h < 10 ? "0" + h : h; // leading 0 at the left for 1 digit hours
    var ampm = H < 12 ? " AM" : " PM";
    ts = h + ts.substr(2, 3) + ampm;
    return ts;
  }
  return (
    <SafeAreaView style={{ flex: 1,backgroundColor:'white' }}>
      <View style={{ padding: 10 }}>
        <Text style={{ paddingVertical: 10, fontSize: 24, fontWeight: "700" }}>
          Make Reservation
        </Text>
        <Text>
          We are pleased to announce that Falla now accepts Visa and Mastercard
          in addition to American Express and, yes, we still accept cash. We are

          offering indoor dining only at this time. Our roadway dining pavilion
          will return when the weather is once again warm and comfortable.
        </Text>
      </View>
      <View style={{ padding: 5 }}>
        <Text style={{ fontSize: 17, fontWeight: "500", paddingVertical: 5 }}>
          Choose Time:
        </Text>
        <TouchableOpacity
          style={{
            padding: 5,
            flexDirection: "row",
            borderWidth: 1,
            width: 140,
            height: 48,
            alignItems: "center",
          }}
        >
          <Icon name="schedule" type="material" size={25} />
          {/* <Text style={{marginLeft:16,fontSize:16}}>{time &&tConv24(time.toLocaleTimeString().split(/[:]+/).splice(0, 1).join())}</Text> */}
          <TextInput
            placeholder={"0"}
            placeholderTextColor="black"
            style={{
              fontSize: 16,
              marginLeft: 5,
              marginBottom: 0,
              color: "black",
              width: 20,
            }}
            autoFocus={false}
            returnKeyType="done"
            onSubmitEditing={() => textinput2.current?.focus()}
            onChange={(a)=>setTime(a)}
          />
          <Text>:</Text>
          <TextInput
            placeholder={"0"}
            placeholderTextColor="black"
            ref={textinput2}
            style={{
              fontSize: 16,
              marginLeft: 5,
              marginBottom: 0,
              color: "black",
              width: 50,
            }}
            returnKeyType="done"
            onChange={(a)=>setTime1(a)}
          />
          <TextInput />
        </TouchableOpacity>
      </View>
      <View style={{ padding: 5 }}>
        <Text style={{ fontSize: 17, fontWeight: "500", paddingVertical: 5 }}>
          Choose Date:
        </Text>
        <TouchableOpacity
          style={{
            padding: 5,
            flexDirection: "row",
            borderWidth: 1,
            width: 170,
            height: 48,
            alignItems: "center",
          }}
          onPress={showDatepicker}
        >
          <Icon name="event" type="material" size={25} />
          <Text style={{ marginLeft: 14, fontSize: 16 }}>
            {date.toDateString()}
          </Text>
        </TouchableOpacity>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            onChange={onChange}
          />
        )}
      </View>

      <Text style={{ fontSize: 17, fontWeight: "500", padding: 5 }}>
        Select Person:
      </Text>
      <View style={{ width: 150, height: 40, padding: 5 }}>
        <DropdownComponent
          data={personData}
          value={person}
          setvalue={setPerson}
          catagory={"Person"}
        />
      </View>
      
        <View
          style={{
            position: "absolute",
            bottom: 20,
            width: "100%",
            alignSelf: "center",
          }}
        >
          {restaurantsData>0 ?
          person&&
          <ViewMorebutton title={"Reserve Now"} OnPress={()=>{reservationOccur(time+":"+time1,date,person)}}/>
          :
          <ViewMorebutton title={"No Table Available"} OnPress={()=>console.log(restaurantsData)}/>
          }
        </View>
      
    </SafeAreaView>
  );
}
