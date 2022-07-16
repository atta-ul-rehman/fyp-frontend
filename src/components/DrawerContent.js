import React, { useEffect } from "react";

import { View, Text, Switch, StyleSheet, TouchableOpacity ,Image} from "react-native";

import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";

import { Avatar, Button, Icon } from "react-native-elements";

import { colors } from "../global/styles";
//import { SignInContext } from '../contexts/authContext';
import { useDispatch, useSelector } from "react-redux";

export default function Drawercontent(props) {
  const dispatch = useDispatch();
  const Logout = () => {
    dispatch({
      type: "LogOut",
    });
  };
  const Mealitems = useSelector(
    (state) => state?.cartReducer?.selectedItems?.items
  );

  const USER = useSelector((state) => state.LoginedUser.LoginedUser);
  const img=USER[0]?.image ?USER[0].image:"https://res.cloudinary.com/dugdmyq5b/image/upload/v1653088410/Person-Icon_ozdaxq.png"

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props}>
        <View style={{ backgroundColor: colors.buttons }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingLeft: 20,
              paddingVertical: 10,
            }}
          >
            <Image
              style={styles.avatar}
              source={{uri:img}}
            />
            <View style={{ marginLeft: 10 }}>
              <Text
                style={{
                  fontWeight: "bold",
                  color: colors.cardbackground,
                  fontSize: 18,
                }}
              >
                {USER[0]?.name}
              </Text>
              <Text style={{ color: colors.cardbackground, fontSize: 14 }}>
                {USER[0]?.email}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              paddingBottom: 5,
            }}
          >
            <View style={{ flexDirection: "row", marginTop: 0 }}>
              <TouchableOpacity
                style={{
                  marginLeft: 10,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => console.log("user", USER)}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    color: colors.cardbackground,
                    fontSize: 18,
                  }}
                >
                  1
                </Text>
                <Text style={{ color: colors.cardbackground, fontSize: 14 }}>
                  My Favorites
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: "row", marginTop: 0 }}>
              <View
                style={{
                  marginLeft: 10,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    color: colors.cardbackground,
                    fontSize: 18,
                  }}
                >
                  {Mealitems.length}
                </Text>
                <Text style={{ color: colors.cardbackground, fontSize: 14 }}>
                  My Cart
                </Text>
              </View>
            </View>
          </View>
        </View>

        <DrawerItemList {...props} />

        <View style={{ borderTopWidth: 1, borderTopColor: colors.grey5 }}>
          <Text style={styles.preferences}>Preferences</Text>

          <View style={styles.switchText}>
            <Text style={styles.darkthemeText}>Dark Theme</Text>
            <View style={{ paddingRight: 10 }}>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor="#f4f3f4"
              />
            </View>
          </View>
        </View>
      </DrawerContentScrollView>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          position: "absolute",
          bottom: 15,
          left: 0,
          width: "100%",
          paddingHorizontal: 15,
        }}
        onPress={Logout}
      >
        <Icon
          type="material-community"
          name="logout-variant"
          color={"grey"}
          size={30}
          onPress={() => {
            Logout(), console.log("loggedout");
          }}
        />
        <Text
          style={{
            fontSize: 15,
            fontWeight: "500",
            paddingLeft: 25,
            color: "grey",
          }}
        >
          Sign-out
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  avatar: {
    borderWidth: 0,
    borderRadius:50,
    height:60,
    width:60
  },
  preferences: {
    fontSize: 16,
    color: colors.grey2,
    paddingTop: 10,
    paddingLeft: 20,
  },

  switchText: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 20,
    paddingVertical: 5,
    paddingRight: 10,
  },
  darkthemeText: {
    fontSize: 16,
    color: colors.grey2,
    paddingTop: 10,
    paddingLeft: 0,
    fontWeight: "bold",
  },
});
