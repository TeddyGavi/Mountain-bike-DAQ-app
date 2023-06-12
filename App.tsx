import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import {
  PaperProvider,
  MD3LightTheme,
  adaptNavigationTheme,
} from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import useLocation from "./hooks/useLocation";
import RecorderScreen from "./screens/Recorder";
import MapScreen from "./screens/Map";
import { HomeStack } from "./navStacks/HomeStack";
import { COLORS } from "./constants/colors";

const App = () => {
  const Tab = createMaterialBottomTabNavigator();
  const { checkBackgroundTracking } = useLocation();

  const { LightTheme } = adaptNavigationTheme({
    reactNavigationLight: DefaultTheme,
  });

  const customTheme = {
    ...MD3LightTheme,
    colors: COLORS,
  };

  const overrideLight = {
    ...LightTheme,
    colors: {
      ...LightTheme.colors,
      secondaryContainer: "transparent",
    },
  };

  useEffect(() => {
    checkBackgroundTracking();
  }, []);

  return (
    <PaperProvider theme={customTheme}>
      <NavigationContainer theme={overrideLight}>
        <Tab.Navigator
          barStyle={{
            borderStyle: "solid",
            borderTopWidth: 2,
            height: 100,
          }}
          // activeColor="black"
          // screenOptions={{}}
        >
          <Tab.Screen
            name="Root"
            component={HomeStack}
            options={{
              tabBarIcon: ({ focused, color }) => {
                return focused ? (
                  <MaterialCommunityIcons
                    name="home"
                    size={30}
                    color="#0a7e0a"
                  />
                ) : (
                  <MaterialCommunityIcons name="home" size={28} color={color} />
                );
              },
              tabBarLabel: "Home",
            }}
          />
          <Tab.Screen
            name="Record"
            component={RecorderScreen}
            options={{
              tabBarIcon: ({ focused, color }) => {
                return focused ? (
                  <MaterialCommunityIcons
                    name="adjust"
                    size={30}
                    color="#0a7e0a"
                  />
                ) : (
                  <MaterialCommunityIcons
                    name="adjust"
                    size={28}
                    color={color}
                  />
                );
              },
            }}
          />

          <Tab.Screen
            name="Map"
            component={MapScreen}
            options={{
              tabBarIcon: ({ focused, color }) => {
                return focused ? (
                  <MaterialCommunityIcons
                    name="map"
                    size={30}
                    color="#0a7e0a"
                  />
                ) : (
                  <MaterialCommunityIcons name="map" size={28} color={color} />
                );
              },
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({});

export default App;
