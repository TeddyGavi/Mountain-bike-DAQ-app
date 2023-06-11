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

const App = () => {
  const Tab = createMaterialBottomTabNavigator();
  const { checkBackgroundTracking } = useLocation();

  const { LightTheme } = adaptNavigationTheme({
    reactNavigationLight: DefaultTheme,
  });

  const overrideLight = {
    ...LightTheme,
    colors: {
      ...LightTheme.colors,
      secondaryContainer: "transparent",
      onSurfaceVariant: "#043425",
    },
  };

  useEffect(() => {
    checkBackgroundTracking();
  }, []);

  return (
    <PaperProvider theme={MD3LightTheme}>
      <NavigationContainer theme={overrideLight}>
        <Tab.Navigator
          barStyle={{
            backgroundColor: "#d7e2e141",
            borderTopColor: "#042429",
            borderStyle: "solid",
            borderTopWidth: 3,
            height: 100,
          }}
          activeColor="black"
          screenOptions={{}}
        >
          <Tab.Screen
            name="Home"
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
