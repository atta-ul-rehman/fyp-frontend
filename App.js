import React from "react";
import "react-native-gesture-handler";
import { LogBox } from "react-native";
import { StatusBar } from "expo-status-bar";
import { colors } from "./src/global/styles";
import RootNavigator from "./src/navigation/rootNavigation";
import { Provider as ReduxProvider } from "react-redux";
import configureStore from "./src/redux/store";
import UserSetting from "./src/screens/userSetting";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./src/redux/store";
LogBox.ignoreLogs(["EventEmitter.removeListener"]);
LogBox.ignoreAllLogs();
export default function App() {
  //  const store = configureStore();
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StatusBar barStyle="light-content" backgroundColor={colors.buttons} />
        <RootNavigator />
      </PersistGate>
    </ReduxProvider>
  );
}
