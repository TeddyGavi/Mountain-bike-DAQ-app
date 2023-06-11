import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  StyleSheet,
  Button,
} from "react-native";
import React, { useLayoutEffect } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Account from "../screens/Account";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";

export default function Header(props: NativeStackHeaderProps) {
  const { navigation, back, options, route } = props;

  if (back) {
    return (
      <View style={style.containerBack}>
        <Pressable
          style={{ display: "flex", flexDirection: "row" }}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="chevron-left" size={26} />
          <Text style={{ alignSelf: "center", fontSize: 20 }}>Back</Text>
        </Pressable>
      </View>
    );
  } else {
    return (
      <View style={style.container}>
        <Pressable onPress={() => navigation.navigate("Account")}>
          <MaterialCommunityIcons name="account-cog" size={26} />
        </Pressable>
        <Text>{options.title || route.name}</Text>
        <Pressable onPress={() => navigation.navigate("Settings")}>
          <MaterialCommunityIcons name="cog" size={26} />
        </Pressable>
      </View>
    );
  }
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
  containerBack: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    height: 100,
    padding: 15,
    backgroundColor: "#d7e2e141",
  },
});
