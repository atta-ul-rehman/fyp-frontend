import React, { useLayoutEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import Favorites from "../screens/Useraccount/favorites";
import Wallet from "../screens/Useraccount/wallet";
import Setting from "../screens/Useraccount/settings";
import Myaccount from "../screens/MyAccountScreen";

const ClientAccount = createStackNavigator();

export default function USeraccountStack({ navigation, route }) {
  {
    /* to hide bottom tab in restuarents home svcreen */
  }

  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (routeName === "Settings") {
      navigation.setOptions({ tabBarStyle: { display: "none" } });
    } else {
      navigation.setOptions({ tabBarStyle: { display: "none" } });
    }
  }, [navigation, route]);
  return (
    <ClientAccount.Navigator>
      <ClientAccount.Screen
        name="Myaccount"
        component={Myaccount}
        options={() => ({
          headerShown: false,
        })}
      />

      <ClientAccount.Screen
        name="Setting"
        component={Setting}
        options={() => ({
          headerShown: false,
        })}
      />

      <ClientAccount.Screen
        name="Favorites"
        component={Favorites}
        options={() => ({
          headerShown: false,
        })}
      />

      <ClientAccount.Screen
        name="Wallet"
        component={Wallet}
        options={() => ({
          headerShown: false,
        })}
      />
    </ClientAccount.Navigator>
  );
}
