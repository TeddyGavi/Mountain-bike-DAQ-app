import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  StyleSheet,
  Button,
} from "react-native";
import React from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Account from "../screens/Account";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";

export default function Header(props: NativeStackHeaderProps) {
  const { navigation, back, options, route } = props;
  return (
    <View style={style.container}>
      <Pressable onPress={() => navigation.navigate("Account")}>
        <MaterialCommunityIcons name="account-cog" size={26} />
      </Pressable>
      <Text>{route.name}</Text>
      <Pressable>
        <MaterialCommunityIcons name="cog" size={26} />
      </Pressable>
    </View>
  );
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
