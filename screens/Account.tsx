import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useEffect } from "react";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import Header from "../components/Header";

export default function Account() {
  // useEffect(() => {
  //   navigation.setOptions({});
  // }, [navigation]);
  return (
    <View>
      <Text>Account</Text>
    </View>
  );
}
