import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React from "react";

export default function Account() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top }}>
      <Text>Account</Text>
    </View>
  );
}
