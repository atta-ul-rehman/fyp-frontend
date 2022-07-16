import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { ToastProvider } from "react-native-fast-toast";
import { useSelector } from "react-redux";
import { AuthStack } from "./authStack";
import DrawerNavigator from "./DrawerNavigator";
export default function RootNavigator() {
  const authToken = useSelector((state) => state.authToken.authToken);
  return (
    <NavigationContainer>
      <ToastProvider>
        {authToken == "" ? <AuthStack /> : <DrawerNavigator />}
      </ToastProvider>
    </NavigationContainer>
  );
}
