import * as React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import RootClientTabs from "./ClientTabs";

import { Icon } from "react-native-elements";
import { colors } from "../global/styles";
import DrawerContent from "../components/DrawerContent";
import UserOrderStack from "./OrderHistoryStack";

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
      <Drawer.Screen
        name="RootClientTabs"
        component={RootClientTabs}
        options={{
          title: "Client",
          headerShown: false,
          drawerIcon: ({ focussed, size }) => (
            <Icon
              type="material-community"
              name="home"
              color={focussed ? "#7cc" : colors.grey2}
              size={size}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="Reservation"
        component={UserOrderStack}
        options={{
          title: "Orders",
          headerShown: false,
          drawerIcon: ({ focussed, size }) => (
            <Icon
              type="material"
              name="book-online"
              color={focussed ? "#7cc" : colors.grey2}
              size={size}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
