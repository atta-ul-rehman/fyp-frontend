import React, { useLayoutEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AllChats from "../screens/UserChat.js/AllChats";
import Chat from "../screens/UserChat.js/Chatnow";
const RestStack = createStackNavigator();

export default function UserChatStack({ route, navigation }) {
  useLayoutEffect(() => {
    navigation.setOptions({ tabBarStyle: { display: "none" } });
  }, [navigation, route]);

  return (
    <RestStack.Navigator>
      <RestStack.Screen
        name="AllChats"
        component={AllChats}
        options={() => ({
          headerShown: false,
        })}
      />

      <RestStack.Screen
        name="Chat"
        component={Chat}
        options={() => ({
          headerShown: false,
        })}
      />
    </RestStack.Navigator>
  );
}
