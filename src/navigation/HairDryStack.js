import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HairdryRequestQuote from "../screens/Saloon/HairdryRequestQuote";
const Stack = createStackNavigator();

export default function HairdryStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HairdryRequestQuote"
        component={HairdryRequestQuote}
        options={() => ({
          headerShown: false,
        })}
      />
    </Stack.Navigator>
  );
}
