import React, {useLayoutEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import Viewcartscreen from '../screens/ViewcartScreen';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
const Stack = createStackNavigator();

export default function CartPaymentStack({navigation, route}) {
  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    navigation.setOptions({tabBarStyle: {display: 'none'}});
    console.log(routeName);
  }, [navigation, route]);
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Viewcartscreen"
        component={Viewcartscreen}
        options={() => ({
          headerShown: false,
        })}
      />
    </Stack.Navigator>
  );
}
