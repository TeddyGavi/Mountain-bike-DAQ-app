import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Settings from "../screens/Settings";

const SettingsStack = createNativeStackNavigator();

export default function SettingsStackScreen({ navigation }) {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name="Settings" component={Settings} />
    </SettingsStack.Navigator>
  );
}
