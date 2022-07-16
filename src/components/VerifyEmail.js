import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { Icon } from "react-native-elements";
import ViewMorebutton from "./ViewMoreButton";
import CountDown from "react-native-countdown-component";
import { useToast } from "react-native-fast-toast";
import { BaseUrl } from "../constants/Baseurl";
export default function VerifyEmail({
  navigation,
  setModalVisible,
  time,
  title,
  resendEmail,
  setresendStatus,
  resendStatus,
  email,
  login,
  setloading2,
  loading2,
}) {
  const toast = useToast();
  const Proceed = async (login) => {
    setloading2(true);
    await fetch(`http://${BaseUrl}:5000/api/v1/user?email=${email}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.data[0].verified == true) {
          toast.show(
            login
              ? "User Registered Successfuly"
              : "Account Verified Now You can Login",
            {
              duration: 1000,
              style: { padding: 0, backgroundColor: "rgba(120,120,120,0.9)" },
            }
          );
          if (!login) {
            navigation.pop();
          }
          setloading2(false);
          setModalVisible(false);
        } else {
          setloading2(false);
          toast.show("Email not Verfied yet", {
            duration: 1000,
            style: {
              padding: 0,
              backgroundColor: "rgba(120,120,120,0.9)",
              marginBottom: 260,
            },
          });
          setloading2(false);
        }
      })
      .catch((err) => {
        toast.show(err, {
          duration: 1000,
          style: { padding: 0, backgroundColor: "rgba(120,120,120,0.9)" },
        });
      });
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.3)",
      }}
    >
      <View style={{ padding: 5, height: 230, backgroundColor: "white" }}>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => setModalVisible(false)}
        >
          <Icon name="remove" type="material" size={30} />
        </TouchableOpacity>
        <Text
          style={{
            fontWeight: "600",
            fontSize: 22,
            paddingBottom: 10,
            alignSelf: "center",
          }}
        >
          {" "}
          Account Verification
        </Text>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={styles.text1}>We have sent you email to {email}</Text>
          <Text style={styles.text1}>please verify your email to proceed</Text>
        </View>
        <ViewMorebutton
          title={title}
          OnPress={() => {
            Proceed(login);
          }}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 5,
          }}
        >
          {resendStatus ? (
            <TouchableOpacity onPress={resendEmail}>
              <Text
                style={{
                  color: "#1b74e4",
                  textDecorationLine: "underline",
                }}
              >
                Resend
              </Text>
            </TouchableOpacity>
          ) : (
            <View>
              <Text
                style={{
                  color: "grey",
                  textDecorationLine: "underline",
                }}
              >
                Resend
              </Text>
            </View>
          )}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ zIndex: 100 }}> Email in</Text>
            <CountDown
              until={time}
              style={{ margin: -7 }}
              size={14}
              digitStyle={{ backgroundColor: "white" }}
              timeToShow={["S"]}
              timeLabels={{ s: "" }}
              onFinish={() => {
                setresendStatus(true);
              }}
            />
            <Text style={{ alignSelf: "center" }}>seconds</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  text1: {
    fontWeight: "400",
    fontSize: 13,
    color: "grey",
  },
});
