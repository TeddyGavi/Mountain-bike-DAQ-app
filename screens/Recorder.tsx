import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React from "react";
import Header from "../components/Header";

export default function RecorderScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View>
      <Header />
      <Text>RecorderScreen</Text>
    </View>
  );
}
