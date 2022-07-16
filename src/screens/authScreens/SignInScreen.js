import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { colors, parameters, title } from "../../global/styles";
import { Icon, Button, SocialIcon } from "react-native-elements";
import Header from "../../components/Header";
import { useToast } from "react-native-fast-toast";
import { useFormik } from "formik";
import { BaseUrl } from "../../constants/Baseurl";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import VerifyEmail from "../../components/VerifyEmail";
import { SafeAreaView } from "react-native-safe-area-context";
import { setLocale } from "yup";
WebBrowser.maybeCompleteAuthSession();
export default function SignInscreen({ navigation }) {
  const [passwordBlured, setPasswordBlured] = useState(true);

  const textinput1 = useRef(1);
  const textinput2 = useRef(2);
  const [loading, setloading] = useState(false);
  const [loading2, setloading2] = useState(false);
  const dispatch = useDispatch();
  const toast = useToast();
  const [veriAcc, setVerifyAcc] = useState(false);
  const [userInfo, setUserInfo] = useState();
  const [message, setMessage] = useState();
  const new_user = (name) => {
    dispatch({
      type: "New_User",
      payload: name,
    });
  };
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "400601526161-1074tqo2tlv7pr43jqapuhq4fn0aem1a.apps.googleusercontent.com",
    iosClientId:
      "400601526161-vn39vjhp17q7mkd45ce1m064rn6nnee9.apps.googleusercontent.com",
    expoClientId:
      "400601526161-1ohu861vp4qajag3p5tv6avcnar2gqrn.apps.googleusercontent.com",
  });

  useEffect(() => {
    setMessage(JSON.stringify(response));
    if (response?.type === "success") {
      getUserData();
    }
  }, [response]);
  async function getUserData() {
    setloading(true);
    let userInfoResponse = await fetch(
      "https://www.googleapis.com/userinfo/v2/me",
      {
        headers: {
          Authorization: `Bearer ${response.authentication.accessToken}`,
        },
      }
    );
    userInfoResponse.json().then((data) => {
      setUserInfo(data);
      //console.log(userInfo!=undefined);
    });
  }

  const googleLogin =async ()=>{
    let form = new FormData();
    if (userInfo != undefined) {
      form.append("name", userInfo.name);
      form.append("email", userInfo.email);
      form.append("verified", "true");
      form.append("role", "user");
      form.append("image", {
        uri: userInfo.picture,
        name: "image.png",
        fileName: "image",
        type: "image/png",
      });
      setloading(true);
      console.log(form)
       await fetch(`http://${BaseUrl}:5000/api/v1/auth/registerGoogle`, {
        method: "POST",
        headers: {
          Accept: "apllication/json",
          "Content-Type": "multipart/form-data",
        },
        body: form,
      })
        .then((res) => res.json())
        .then((json) => {
          console.log(json)
          if (json.success) {
            console.log("success");
            setloading(false);
            toast.show("Successfull Gooogle Login", {
              duration: 1000,
              style: { padding: 0, backgroundColor: "rgba(120,120,120,0.9)" },
            });
            new_user(json.token);
          } else {
            console.log("not success");
            setloading(false);
            toast.show(json.error, {
              duration: 1000,
              style: { padding: 0, backgroundColor: "rgba(120,120,120,0.9)" },
            });
          }
        })
        .catch((error) => {
          console.log("catch");
          setloading(false);
          toast.show(error, {
            duration: 1000,
            style: { padding: 0, backgroundColor: "rgba(120,120,120,0.9)" },
          });
        });
    }
  }

useEffect(()=>{
googleLogin()
},[userInfo])
  const loginUser = async (data) => {
    setloading(true);
    await fetch(`http://${BaseUrl}:5000/api/v1/auth/login`, {
      method: "POST",
      headers: {
        Accept: "apllication/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        role: "user",
      }),
    })
      .then((res) => res.json())
      .then((resp) => {
        if (!resp.success) {
          setloading(false);
          toast.show(resp.error, {
            duration: 1000,
            style: { padding: 0, backgroundColor: "rgba(120,120,120,0.9)" },
          });
          setVerifyAcc(true);
        } else if (resp.token) {
          setloading(false);
          new_user(resp.token);
          toast.show("User Logined Succesfully", {
            duration: 1000,
            style: { padding: 0, backgroundColor: "rgba(120,120,120,0.9)" },
          });
          setloading(false);
        } else if (resp.data) {
          let date = new Date();
          let date2 = new Date(resp.data.verificationTokenExpires);
          setresendTime((date2 - date) / 1000);
          setloading(false);
          setresendStatus(false);
          setModalVisible(true);
        }
      })
      .catch((err) => {
        setloading(false);
        toast.show(err, {
          duration: 1000,
          style: { padding: 0, backgroundColor: "rgba(120,120,120,0.9)" },
        });
      });
  };
  const [resendStatus, setresendStatus] = useState(false);
  const [resendTime, setresendTime] = useState();
  const [modalVisible, setModalVisible] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").trim().required("Required"),
    password: Yup.string()
      .trim()
      .min(6, "Too Short!")
      .max(10, "Too Long!")
      .required("Required"),
  });
  const { handleChange, handleSubmit, handleBlur, values, errors, touched } =
    useFormik({
      validationSchema: LoginSchema,
      initialValues: { email: "", password: "" },
      onSubmit: (values) => {
        loginUser(values);
      },
    });

  return (
    <>
      <Modal
        animationType="slide"
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <VerifyEmail
          setModalVisible={setModalVisible}
          title={loading2 ? <ActivityIndicator size="small" /> : "Proceed ➡"}
          navigation={navigation}
          time={resendTime}
          setloading2={setloading2}
          setresendStatus={setresendStatus}
          resendStatus={resendStatus}
          login={true}
          email={values.email}
          resendEmail={() => {
            loginUser(values);
          }}
        />
      </Modal>

      <SafeAreaView style={styles.container}>
        <Header title="My Account" type="arrow-left" navigation={navigation} />
        <View style={{ marginLeft: 20, marginTop: 10 }}>
          <Text style={styles.title}>Sign-In</Text>
        </View>
        <View style={{ alignItems: "center", margintop: 10 }}>
          <Text style={styles.text1}>Please enter email</Text>
          <Text style={styles.text1}>Register with your account</Text>
        </View>
        <View
          style={{
            justifyContent: "flex-start",
            backgroundColor: "white",
            paddingHorizontal: 15,
            paddingBottom: 15,
          }}
        >
          {errors.email ? (
            <Text style={{ color: "red" }}>*{errors.email}</Text>
          ) : null}
          <View style={styles.view10}>
            <View>
              <Icon
                name="email"
                style={styles.email}
                color={colors.grey3}
                type="material"
              />
            </View>
            <View style={styles.view11}>
              <TextInput
                placeholder="Email"
                placeholderTextColor="grey"
                style={{
                  fontSize: 16,
                  marginLeft: 0,
                  marginBottom: 0,
                  color: "black",
                }}
                autoFocus={false}
                onChangeText={handleChange("email")}
                value={values.email}
                onBlur={handleBlur("email")}
                error={errors.email}
                touched={touched.email}
                returnKeyType="done"
                onSubmitEditing={() => textinput2.current?.focus()}
              />
            </View>
          </View>
          {errors.password ? (
            <Text style={{ color: "red" }}>*{errors.password}</Text>
          ) : null}
          <View style={styles.view10}>
            <Icon name="lock" color={colors.grey3} type="material" />
            <TextInput
              placeholder="Password"
              placeholderTextColor="grey"
              style={{ flex: 1, color: "black" }}
              secureTextEntry={passwordBlured}
              onChangeText={handleChange("password")}
              value={values.password}
              autoFocus={false}
              onBlur={handleBlur("password")}
              error={errors.password}
              touched={touched.password}
              ref={textinput2}
            />

            <Icon
              name={passwordBlured ? "visibility-off" : "remove-red-eye"}
              color={colors.grey3}
              type="material"
              style={{ paddingRight: 20 }}
              onPress={() => {
                setPasswordBlured(!passwordBlured);
              }}
            />
          </View>
        </View>
        <View style={{ marginHorizontal: 20, marginTop: 20 }}>
          <Button
            title={loading ? <ActivityIndicator size={"small"} /> : "Sign-In"}
            buttonStyle={parameters.styledButton}
            titleStyle={parameters.statusText}
            onPress={handleSubmit}
          />
        </View>
        {veriAcc && (
          <TouchableOpacity
            style={{ alignItems: "center", marginTop: 10 }}
            onPress={() => {
              registerUser(values, true);
            }}
          >
            <Text style={{ ...styles.text1, textDecorationLine: "underline" }}>
              Click Here to Verify Account
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={{ alignItems: "center", marginTop: 10 }}
          onPress={() => {
            navigation.navigate("ForgetPassword");
          }}
        >
          <Text style={{ ...styles.text1, textDecorationLine: "underline" }}>
            Forgot Password ?
          </Text>
        </TouchableOpacity>

        <View style={{ alignItems: "center", marginTop: 30, marginBottom: 30 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>OR</Text>
        </View>

        <View style={{ marginHorizontal: 10 }}>
          <SocialIcon
            title="SignIn with FaceBook"
            button
            type="facebook"
            style={styles.socialicon}
            onPress={() => {
              toast.show("Cooming Soon", {
                duration: 1000,
                style: { padding: 0, backgroundColor: "rgba(120,120,120,0.9)" },
              });
            }}
          />
        </View>
        <View style={{ marginHorizontal: 10, marginTop: 10 }}>
          <SocialIcon
            title="SignIn with Google"
            button
            type="google"
            style={styles.socialicon}
            onPress={() => {
              promptAsync({ useProxy: true, showInRecents: true });
            }}
          />
        </View>

        <View style={{ marginLeft: 25, marginTop: 10 }}>
          <Text style={{ ...styles.text1, fontSize: 16 }}>New To Falla ?</Text>
        </View>
        <View style={{ alignItems: "flex-end", marginRight: 20 }}>
          <Button
            title="Create an account"
            buttonStyle={styles.buttoncreate}
            titleStyle={styles.buttoncreatetitle}
            onPress={() => navigation.navigate("SignUpScreen")}
          />
        </View>
      </SafeAreaView>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text1: {
    color: colors.grey4,
    fontSize: 16,
  },
  view10: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: colors.grey4,
    borderRadius: 12,
    paddingLeft: 5,
    paddingRight: 10,
    marginTop: 15,
    alignItems: "center",
    height: 48,
  },
  TextInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#869390",
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
    paddingLeft: 10,
    color: "black",
  },
  view11: { maxWidth: "65%" },
  TextInput2: {
    height: 40,
    width: "89%",
    borderWidth: 1,
    borderRadius: 12,
    marginHorizontal: 20,
    borderColor: "#869390",
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
    padding: 5,
    color: "black",
    paddingRight: -5,
  },
  socialicon: {
    borderRadius: 12,
    height: 50,
  },
  buttoncreate: {
    backgroundColor: "white",
    alignContent: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.buttons,
    paddingHorizontal: 20,
    height: 40,
  },
  buttoncreatetitle: {
    color: colors.buttons,
    fontSize: 16,
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -3,
  },
  styledButton: {
    backgroundColor: "#ff8c52",
    alignContent: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ff8c52",
    height: 50,
    paddingHorizontal: 20,
    width: "100%",
  },

  buttonTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -3,
  },
  title: {
    color: "black",
    fontWeight: "700",
    fontSize: 16,
  },
});
