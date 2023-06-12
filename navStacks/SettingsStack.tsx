import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Settings from "../screens/Settings";

export default function SettingsStack({ navigation }) {
  const SettingsStack = createNativeStackNavigator();
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen
        name="Settings"
        component={Settings}
        options={{ headerShown: false }}
      />
    </SettingsStack.Navigator>
  );
}
