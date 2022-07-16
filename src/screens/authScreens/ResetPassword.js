import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useState, useRef } from "react";
import { Button } from "react-native-elements";
import { parameters } from "../../global/styles";
import { useToast } from "react-native-fast-toast";
import { BaseUrl } from "../../constants/Baseurl";
import Header from "../../components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
export default function ResetPassword({ navigation, route }) {
  const { token } = route.params;
  const [password, setpassword] = useState("");
  const [error, setError] = useState(false);
  const [errormsg, seterrormsg] = useState("");
  const [loading, setloading] = useState(false);
  const [authtoken, setauthtoken] = useState("");

  const toast = useToast();
  const resetpassword = async (data) => {
    if (password) {
      setError(false);
      setloading(true);
      const response = await fetch(
        `http://${BaseUrl}:5000/api/v1/auth/resetpassword/${token}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      )
const res=await response.json()
      if (!res.success) {
        setError(true);
        seterrormsg(response.status);
        console.log(response.statusText, error);
        setloading(false);
        toast.show("Network Error", {
          duration: 500,
          style: { padding: 0, backgroundColor: "rgba(120,120,120,0.9)" },
        });
      } else {
        console.log("token", res.token);
        //setauthtoken(res.token);
        navigation.navigate("SignInScreen");
        setloading(false);
        toast.show("Password changed succesfully", {
          type: "warning",
          duration: 2000,
          style: { padding: 0, backgroundColor: "rgba(120,120,120,0.9)" },
        });
      }
    } else {
      setError(true);
      toast.show("Email cannot be empty", {
        duration: 2000,
        style: { padding: 0, backgroundColor: "rgba(120,120,120,0.9)" },
      });
      seterrormsg("Password field cannot be empty");
      console.log("eroore is");
      setloading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header
        title="Reset Password"
        type="arrow-left"
        navigation={navigation}
      />
      <View
        style={{
          padding: 5,
        }}
      >
        <View style={{ paddingVertical: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: "600" }}>
            {" "}
            Enter Your New Password{" "}
          </Text>
          <TextInput
            placeholder="Enter New Password"
            style={{
              paddingVertical: 10,
              borderColor: "#cfcfcf",
              borderWidth: 1,
              paddingHorizontal: 5,
              marginVertical: 10,
            }}
            autoFocus={true}
            onChangeText={(e) => setpassword(e)}
            value={password}
          />

          <Button
            title={
              loading ? (
                <ActivityIndicator size="large" color="white" />
              ) : (
                "Reset Password"
              )
            }
            buttonStyle={parameters.styledButton}
            titleStyle={parameters.styledTitle}
            onPress={() => {
              resetpassword({ password })
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
