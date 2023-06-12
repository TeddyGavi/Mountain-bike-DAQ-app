import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Home from "../screens/Home";
import Header from "../components/Header";
import Account from "../screens/Account";
import SettingsStack from "./SettingsStack";

export function HomeStack() {
  const HomeStack = createNativeStackNavigator();
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Home"
        component={Home}
        options={{ title: "Home", header: (props) => <Header {...props} /> }}
      />
      <HomeStack.Screen
        name="Account"
        component={Account}
        options={{
          title: "Account",
        }}
      />
      <HomeStack.Screen
        name="SettingsStack"
        component={SettingsStack}
        options={{ title: "Settings" }}
      />
    </HomeStack.Navigator>
  );
}
