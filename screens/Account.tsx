import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useEffect } from "react";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import Header from "../components/Header";

export default function Account(props: NativeStackHeaderProps) {
  const { navigation, back, options, route } = props;

  const insets = useSafeAreaInsets();
  useEffect(() => {
    navigation.setOptions({});
  }, [navigation]);
  return (
    <View style={{ paddingTop: insets.top }}>
      <Text>Account</Text>
    </View>
  );
}
