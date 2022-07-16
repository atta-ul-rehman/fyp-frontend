import React, { useLayoutEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ViewBusinessPhotos from "../screens/ViewBusinessPhotos/PhotoGridView";
const Tab = createStackNavigator();
export default function TopTabNavigator({ route, navigation }) {
  useLayoutEffect(() => {
    navigation.setOptions({ tabBarStyle: { display: "none" } });
  }, [navigation, route]);

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Photo Gallery"
        component={ViewBusinessPhotos}
        options={() => ({
          headerShown: false,
        })}
      ></Tab.Screen>
    </Tab.Navigator>
  );
}
