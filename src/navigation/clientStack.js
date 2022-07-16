import React, { useLayoutEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import SearchScreen from "../screens/SearchScreeen";
import SearchResultScreen from "../screens/SearchResultScreen";
import RestaurantHomeScreen from "../screens/RestaurantHomeScreen";
import RestaurantsMapScreen from "../screens/RestaurantsMapScreen";
import SearchComponent from '../components/SearchComponent'
import Homescreen from "../screens/HomeScreen";
import PreHomeScreen from "../screens/PreHomeScreen";
import { useSelector } from "react-redux";
import RestaurantStack from "./RestaurantStack";
import HairDryStack from "./HairDryStack";
import RestResevation from "../screens/RestReservations";
import ViewBusinessPhotos from "../screens/ViewBusinessPhotos/PhotoGridView";
import {
  getFocusedRouteNameFromRoute,
  useIsFocused,
} from "@react-navigation/native";
import UserChatStack from "./UserChatStack";
const ClientSearch = createStackNavigator();

export function ClientStack({ navigation }, route) {
  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (routeName === "Homescreen" || routeName === "RestaurantHomeScreen") {
      navigation.setOptions({ tabBarStyle: { display: "flex" } });
    } else {
      navigation.setOptions({ tabBarStyle: { display: "flex" } });
    }
    console.log(routeName);
  }, [navigation, route]);
  const business = useSelector((state) => state.businessName.businessName);
  return (
    <ClientSearch.Navigator>
      <ClientSearch.Screen
        name="PreHomescreen"
        component={PreHomeScreen}
        options={() => ({
          headerShown: false,
        })}
      />
      <ClientSearch.Screen
        name="Homescreen"
        component={Homescreen}
        options={() => ({
          headerShown: false,
        })}
      />

      <ClientSearch.Screen
        name="Searchscreen"
        component={SearchComponent}
        options={() => ({
          headerShown: false,
        })}
      />

      <ClientSearch.Screen
        name="SearchResultScreen"
        component={SearchResultScreen}
        options={() => ({
          headerShown: false,
        })}
      />
      <ClientSearch.Screen
        name="RestaurantsMapScreen"
        component={RestaurantsMapScreen}
        options={() => ({
          headerShown: false,
        })}
      />
      <ClientSearch.Screen
        name="RestaurantHomeScreen"
        component={RestaurantHomeScreen}
        options={() => ({
          headerShown: false,
        })}
      />
      <ClientSearch.Screen
        name="RestResevation"
        component={RestResevation}
        options={() => ({
          headerShown: false,
        })}
      />
      <ClientSearch.Screen
        name="TopTabNavigator"
        component={ViewBusinessPhotos}
        options={() => ({
          headerShown: false,
        })}
      />

      <ClientSearch.Screen
        name="ChatScreen"
        component={UserChatStack}
        options={() => ({
          headerShown: false,
        })}
      />

      {business === "saloon" ? (
        <ClientSearch.Screen
          name="HairdryStack"
          component={HairDryStack}
          options={() => ({
            headerShown: false,
          })}
        />
      ) : (
        <ClientSearch.Screen
          name="RestaurantStack"
          component={RestaurantStack}
          options={() => ({
            headerShown: false,
          })}
        />
      )}
    </ClientSearch.Navigator>
  );
}
