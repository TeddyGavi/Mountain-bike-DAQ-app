import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  StyleSheet,
  Button,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import React from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Account from "../screens/Account";

export default function Header() {
  const route = useRoute();
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen name="account" component={Account} />
    </Stack.Navigator>
  );
}
{
  /*       <View style={style.container}>
        <Pressable>
          <MaterialCommunityIcons name="account-cog" size={26} />
        </Pressable>
        <Text>{route.name}</Text>
        <Pressable>
          <MaterialCommunityIcons name="cog" size={26} />
        </Pressable>
      </View> */
}

const style = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 100,
    padding: 15,
    backgroundColor: "#d7e2e141",
  },
});
