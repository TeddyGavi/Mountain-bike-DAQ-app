import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import {
  PaperProvider,
  MD3Theme,
  MD3LightTheme,
  MD3DarkTheme,
  adaptNavigationTheme,
} from "react-native-paper";

import useLocation from "./hooks/useLocation";
import HomeScreen from "./screens/HomeScreen";
import RecorderScreen from "./screens/RecorderScreen";
import MapScreen from "./screens/MapScreen";

const App = () => {
  const Tab = createMaterialBottomTabNavigator();
  const { checkBackgroundTracking } = useLocation();

  const { LightTheme } = adaptNavigationTheme({
    reactNavigationLight: DefaultTheme,
  });

  useEffect(() => {
    checkBackgroundTracking();
  }, []);

  return (
    <PaperProvider theme={MD3LightTheme}>
      <NavigationContainer theme={LightTheme}>
        <Tab.Navigator
          barStyle={{
            backgroundColor: MD3LightTheme.colors.background,
            borderTopColor: MD3DarkTheme.colors.outline,
            borderStyle: "solid",
            borderTopWidth: 3,
          }}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{ tabBarIcon: "home" }}
          />
          <Tab.Screen
            name="Record"
            component={RecorderScreen}
            options={{ tabBarIcon: "record" }}
          />
          <Tab.Screen
            name="Map"
            component={MapScreen}
            options={{ tabBarIcon: "map" }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({});

export default App;
