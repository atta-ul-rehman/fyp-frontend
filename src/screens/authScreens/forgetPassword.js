import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { Icon, Button } from "react-native-elements";
import { colors, parameters } from "../../global/styles";
import { useToast } from "react-native-fast-toast";
import { BaseUrl } from "../../constants/Baseurl";
import Header from "../../components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
export default function ForgetPassword({ navigation }) {
  const [resetToken, setResetToken] = useState("");
  const [loading, setloading] = useState(false);
  const [email, setemail] = useState("");
  const [error, setError] = useState(false);
  const [errormsg, seterrormsg] = useState("");
  const toast = useToast();

  const forgetpassword = async (data) => {
    if (email) {
      setError(false);
      setloading(true);
      const response = await fetch(
        `http://${BaseUrl}:5000/api/v1/auth/forgetpassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        setError(true);
        seterrormsg(response.statusText);
        console.log(response.statusText, error);
        setloading(false);
        toast.show("Email Not found", {
          type: "warning",
          duration: 500,
          style: { padding: 0, backgroundColor: "rgba(120,120,120,0.9)" },
        });
      } else {
        const json = await response.json();
        navigation.navigate("ResetPassword", { token: json.resettoken });
        setloading(false);
      }
    } else {
      setError(true);
      toast.show("Email cannot be empty ", {
        type: "warning",
        duration: 500,
        style: { padding: 0, backgroundColor: "rgba(120,120,120,0.9)" },
      });
      seterrormsg("Email cannot be empty");
      setloading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header
        title="Forget Password"
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
            Enter Your Email{" "}
          </Text>
        </View>
        {error && (
          <View style={{ paddingVertical: 2 }}>
            <Text style={{ fontSize: 8, paddingVertical: 2, color: "red" }}>
              {" "}
              *Error Occured {errormsg}
            </Text>
          </View>
        )}
        <TextInput
          placeholder="Enter Valid Email"
          style={{
            paddingVertical: 10,
            borderColor: "#cfcfcf",
            borderWidth: 1,
            paddingHorizontal: 5,
            marginVertical: 10,
          }}
          autoFocus={true}
          onChangeText={(e) => setemail(e)}
          value={email}
        />

        <Button
          title={
            loading ? (
              <ActivityIndicator size="large" color="white" />
            ) : (
              "Send Email"
            )
          }
          buttonStyle={parameters.styledButton}
          titleStyle={parameters.styledTitle}
          onPress={() => {
            forgetpassword({ email });
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
});
