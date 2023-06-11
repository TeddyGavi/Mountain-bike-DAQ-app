import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Home from "../screens/Home";
import Header from "../components/Header";
import Account from "../screens/Account";
import { Button, Text } from "react-native";

export function HomeStack({ navigation }) {
  const HomeStack = createNativeStackNavigator();
  return (
    <HomeStack.Navigator
      screenOptions={{ header: (props) => <Header {...props} /> }}
    >
      <HomeStack.Screen name="Home" component={Home} />
      <HomeStack.Screen
        name="Account"
        component={Account}
        // options={{
        //   title: "Account",
        //   header: (props) => <Text>Hi</Text>,
        //   headerLeft: () => (
        //     <Button title="Home" onPress={() => navigation.goBack()} />
        //   ),
        // }}
      />
    </HomeStack.Navigator>
  );
}
