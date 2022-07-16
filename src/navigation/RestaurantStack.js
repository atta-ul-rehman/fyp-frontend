import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import MenuProductScreen from '../screens/Reatauranthometab/MenuProductScreen';
import MenuPrefernce from '../screens/Reatauranthometab/MenuPrefernce';
const RestStack = createStackNavigator();

export default function RestaurantStack() {
  return (
    <RestStack.Navigator>
      <RestStack.Screen
        name="MenuProductScreen"
        component={MenuProductScreen}
        options={() => ({
          headerShown: false,
        })}
      />

      <RestStack.Screen
        name="PreferenceScreen"
        component={MenuPrefernce}
        options={() => ({
          headerShown: false,
        })}
      />
    </RestStack.Navigator>
  );
}
