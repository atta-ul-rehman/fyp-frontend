import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import OrderStatus from "../screens/OrderHistory/OrderStatus";
import OrderHistory from "../screens/OrderHistory/OrderHistory";
import SaloonOrder from "../screens/Saloon/SaloonOrder";
const RestStack = createStackNavigator();

export default function UserOrderStack() {
  return (
    <RestStack.Navigator>
      <RestStack.Screen
        name="OrdersHistory"
        component={OrderHistory}
        options={() => ({
          headerShown: false,
        })}
      />
      <RestStack.Screen
        name="OrderStatus"
        component={OrderStatus}
        options={() => ({
          headerShown: false,
        })}
      />
      <RestStack.Screen
        name="SaloonOrder"
        component={SaloonOrder}
        options={() => ({
          headerShown: false,
        })}
      />
    </RestStack.Navigator>
  );
}
