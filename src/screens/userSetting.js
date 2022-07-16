import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  ToastAndroid,
  ScrollView
} from "react-native";
import React, { useEffect, useState } from "react";
import { Icon } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import ViewMorebutton from "../components/ViewMoreButton";
import { BaseUrl } from "../constants/Baseurl";
import { useSelector } from "react-redux";
import { useToast } from "react-native-fast-toast";
import * as ImagePicker from "expo-image-picker";
import { useIsFocused } from "@react-navigation/native";

const Input = ({ name, val, cb, ph, kb, text, icon_name, editable }) => {
  return (
    <View style={{ paddingBottom: 5 }}>
      <Text style={{ color: "grey", paddingVertical: 2, fontWeight: "500" }}>
        {text}
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Icon
          name={icon_name}
          type="material"
          color={"grey"}
          size={22}
          style={{ padding: 5 }}
        />
        <TextInput
          style={styles.input}
          placeholder={ph}
          value={val}
          keyboardType={!kb ? "default" : kb}
          onChangeText={(val) => cb(name, val)}
          editable={editable}
        />
      </View>
    </View>
  );
};
const ChangePasswordModal = ({ setCurrentPass, setNewPass, changePass }) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>
        <Text style={{ color: "grey", paddingVertical: 2, fontWeight: "500" }}>
          Current Password
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              borderWidth: 1,
              borderColor: "grey",
            },
          ]}
          placeholder="Enter Current Password"
          onChangeText={(e) => {
            setCurrentPass(e);
          }}
          secureTextEntry={true}
        />
        <Text style={{ color: "grey", paddingVertical: 2, fontWeight: "500" }}>
          New Password
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              borderWidth: 1,
              borderColor: "grey",
            },
          ]}
          placeholder="Enter New Password"
          onChangeText={(e2) => {
            setNewPass(e2);
          }}
          secureTextEntry={true}
        />
      </View>
      <ViewMorebutton title={"Change Password"} OnPress={changePass} />
    </SafeAreaView>
  );
};
export default function UserSetting() {
  const isFocused=useIsFocused()
  const [user, setUser] = useState({
    name: "",
    phone_num: "",
    work: "",
    email: "",
    home: "",
    pass: "",
    image: "",
  });
  const updateUser = (name, val) => {
    setUser({ ...user, [name]: val });
  };
  const USER = useSelector((state) => state.LoginedUser.LoginedUser);

  const toast = useToast();
  const [currentPass, setCurrentPass] = useState();
  const authToken = useSelector((state) => state.authToken.authToken);
  const [newPass, setNewPass] = useState();
  const [editable, setEditable] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const[img,setimg]=useState(false)
  const getUser = async () => {
    USER &&
      setUser({
        name: USER[0]?.name,
        email: USER[0]?.email,
        home: USER[0]?.address,
        image: USER[0]?.image,
      });
  };
  useEffect(() => {
    getUser();
  }, [isFocused]);
  const UpdateDetails = async () => {
    await fetch(`http://${BaseUrl}:5000/api/v1/auth/updateDetails`, {
      method: "PUT",
      headers: {
        Accept: "apllication/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        name: user.name,
        email: user.email,
        address: user.address,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          toast.show("Details Updated Successfullly", {
            duration: 1000,
            style: {
              padding: 0,
              backgroundColor: "rgba(120,120,120,0.9)",
            },
          });
        } else {
          toast.show(json.error, {
            duration: 1000,
            style: {
              padding: 0,
              backgroundColor: "rgba(120,120,120,0.9)",
            },
          });
        }
      })
      .catch((err) => {
        toast.show(err, {
          duration: 1000,
          style: {
            padding: 0,
            backgroundColor: "rgba(120,120,120,0.9)",
          },
        });
      });
  };
  const changePass = async (currentPass, newPass) => {
    if (newPass) {
      await fetch(`http://${BaseUrl}:5000/api/v1/auth/updatepassword`, {
        method: "PUT",
        headers: {
          Accept: "apllication/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          currentPassword: currentPass,
          newPassword: newPass,
        }),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.success) {
            setModalVisible(false);
            ToastAndroid.show("Password Changed", ToastAndroid.SHORT);
          } else {
            ToastAndroid.show(json.error, ToastAndroid.SHORT);
          }
        })
        .catch((err) => {
          ToastAndroid.show(err, ToastAndroid.SHORT);
        });
    } else {
      ToastAndroid.show("Please enter new password", ToastAndroid.SHORT);
    }
  };
  const[image,setImage]=useState(null)
useEffect(()=>{
setImage(null)
},[isFocused])
  const addImage = async () => {
    let _image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
      base64: true,
    });
    if (!_image.cancelled) {
      setImage(_image.uri);
      console.log(image)
      let form = new FormData();
    if (image) {
      form.append("image", {
        uri: image,
        name: "image.png",
        fileName: "image",
        type: "image/png",
      });
     //console.log(image)
      addReview(form);
    }
  }
};
const Add_image = (item, image) => {
  dispatch({
    type: "Get_Logined",
    payload: {
      ...item,
      image:image,
    },
  });
};
  const addReview = async (form) => {
    ToastAndroid.show("Uploading...", ToastAndroid.LONG);
    await fetch(`http://${BaseUrl}:5000/api/v1/auth/updateDetails`, {
      method: "PUT",
      headers: {
        Accept: "apllication/json",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${authToken}`,
      },
      body: form,
    })
      .then((response) =>response.json())
      .then((json) => {
        if (json.success) {
          console.log("success")
          ToastAndroid.show("added", ToastAndroid.SHORT);
        } else if (json.success) {
          ToastAndroid.show(json.error, ToastAndroid.SHORT);
        }
      })
      .catch((error) => {
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
  };

  return (
    <>
      <Modal
        animationType="fade"
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <ChangePasswordModal
          setModalVisible={setModalVisible}
          setCurrentPass={setCurrentPass}
          setNewPass={setNewPass}
          newPass={newPass}
          currentPass={currentPass}
          changePass={() => {
            changePass(currentPass, newPass);
          }}
        />
      </Modal>
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <ScrollView
          style={{
            paddingHorizontal: 10,
            paddingTop: 0,
            paddingBottom: 10,
          }}
        >
          <TouchableOpacity style={{ position: "absolute", top: 80, left: 0, zIndex: 100 }}
          onPress={addImage}>
            <Icon
              name="drive-file-rename-outline"
              type="material"
              color={"white"}
              size={20}
              style={{
                padding: 5,
                backgroundColor: "black",
                borderRadius: 100,
              }}
            />
          </TouchableOpacity>

          <View
            style={{
              paddingVertical: 20,
              borderBottomColor: "#ececec",
              borderBottomWidth: 3,
            }}
          >
            {image!=null?(
              <Image
                source={{ uri: image }}
                style={{ height: 90, width: 90, borderRadius: 100 }}
              />
            ): user.image ?
            <Image
                source={{ uri: user.image }}
                style={{ height: 90, width: 90, borderRadius: 100 }}
              />
            : (
              <Icon
                name="user"
                type="evilicon"
                color={"black"}
                size={122}
                style={{ zIndex: 10, alignSelf: "baseline", marginLeft: -15 }}
              />
            )}
          </View>
          <View style={{ paddingVertical: 15 }}>
            <Text style={{ fontSize: 20 }}>Personal Info</Text>
          </View>
          <View style={{ paddingVertical: 12 }}>
            <Input
              name="name"
              val={user.name}
              cb={updateUser}
              ph="Name"
              kb="email-address"
              text="Name"
              icon_name="home"
              editable={editable}
            />
            <Input
              name="phone_num"
              val={user.phone_num}
              cb={updateUser}
              ph="123345"
              kb="numeric"
              text="Phone number"
              icon_name="phone"
              editable={editable}
            />
            <Input
              name="email"
              val={user.email}
              cb={updateUser}
              ph="abc@gmail.com"
              kb="email-address"
              text="Email"
              icon_name="email"
              editable={editable}
            />
            <TouchableOpacity
              style={{ marginTop: 5 }}
              onPress={() => {
                setModalVisible(true);
              }}
            >
              <Input
                name="Edit Password"
                cb={updateUser}
                ph="*******"
                kb="email-address"
                text="To Edit Password Click Here"
                icon_name="lock-outline"
                editable={false}
              />
            </TouchableOpacity>
          </View>
          <View style={{ paddingVertical: 15 }}>
            <Text style={{ fontSize: 20 }}>Saved places</Text>
          </View>
          <Input
            name="Home"
            val={user.home}
            cb={updateUser}
            ph="Add home"
            text="Home"
            icon_name="location-on"
            editable={editable}
          />
          <Input
            name="work"
            val={user.work}
            cb={updateUser}
            ph="Add Work"
            text="Work"
            icon_name="location-on"
            editable={editable}
          />
          <View
            style={{
              flexDirection: "row",
              paddingVertical: 5,
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              style={{
                paddingHorizontal: 60,
                paddingVertical: 10,
                borderWidth: 1,
                backgroundColor: !editable ? "red" : "white",
                borderColor: !editable ? "red" : "black",
              }}
              onPress={() => setEditable(!editable)}
            >
              <Text style={{ color: !editable ? "white" : "black" }}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                paddingHorizontal: 60,
                paddingVertical: 10,
                borderWidth: 1,
                borderColor: editable ? "red" : "black",
                backgroundColor: editable ? "red" : "white",
              }}
              onPress={() => {
                setEditable(!editable), UpdateDetails();
              }}
            >
              <Text style={{ color: editable ? "white" : "black" }}>Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 0,
    borderBottomWidth: 1,
    paddingHorizontal: 5,
    borderRadius: 3,
    borderColor: "#ececec",
    width: "100%",
  },
});
