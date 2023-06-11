import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useLayoutEffect } from "react";
import Home from "../screens/Home";
import Header from "../components/Header";
import Account from "../screens/Account";
import { Button, Text } from "react-native";
import Settings from "../screens/Settings";

export function HomeStack({ navigation }) {
  const HomeStack = createNativeStackNavigator();
  return (
    <HomeStack.Navigator
    // screenOptions={{
    //   header: (props) => <Header {...props} />,
    // }}
    >
      <HomeStack.Screen
        name="Home"
        component={Home}
        options={{ title: "Home" }}
      />
      <HomeStack.Screen
        name="Account"
        component={Account}
        // children={(props) => Account(props)}
        options={{
          title: "Account",
          header: (props) => <Header {...props} />,
          // headerLeft: () => (
          //   <Button title="Home" onPress={() => navigation.goBack()} />
          // ),
          // animation: "slide_from_right",
        }}
      />
      <HomeStack.Screen
        name="Settings"
        component={Settings}
        options={{ title: "Settings" }}
      />
    </HomeStack.Navigator>
  );
}
