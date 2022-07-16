import React from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { colors } from "../global/styles";
import { Icon } from "react-native-elements";
import { useSelector } from "react-redux";
import { ClientStack } from "./clientStack";
import CartPaymentStack from "./CartPaymentStack";
import UserChatStack from "./UserChatStack";
import UserSetting from "../screens/userSetting";
const ClientTabs = createBottomTabNavigator();

export default function RootClientTabs() {
  const Mealitems = useSelector(
    (state) => state.cartReducer.selectedItems.items
  );
  return (
    <ClientTabs.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.buttons,
      }}
    >
      <ClientTabs.Screen
        name="SearchScreen"
        component={ClientStack}
        options={{
          tabBarLabel: "Search",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="search" type="material" color={color} size={size} />
          ),
        }}
      />

      <ClientTabs.Screen
        name="Cart"
        component={CartPaymentStack}
        options={{
          tabBarLabel: "Cart",
          tabBarIcon: ({ color, size }) => (
            <Icon
              name="shopping-cart"
              type="material"
              color={color}
              size={size}
            />
          ),
          tabBarBadge: Mealitems.length > 0 ? Mealitems.length : null,
          headerShown: false,
        }}
      />
      <ClientTabs.Screen
        name="Chats"
        component={UserChatStack}
        options={{
          tabBarLable: "Chats",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="chat" type="material" color={color} size={size} />
          ),
        }}
      />
      <ClientTabs.Screen
        name="Edit Account"
        component={UserSetting}
        options={{
          tabBarLabel: "Edit Account",
          tabBarIcon: ({ color, size }) => (
            <Icon name="person" type="material" color={color} size={size} />
          ),
        }}
      />
    </ClientTabs.Navigator>
  );
}
