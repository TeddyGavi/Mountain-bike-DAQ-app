import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React from "react";
import Header from "../components/Header";
import LiveDataDisplay from "../components/LiveDataDisplay";
import { useTheme } from "react-native-paper";

export default function RecorderScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  return (
    <>
      <View
        style={{
          backgroundColor: theme.colors.background,
          height: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          borderBottomColor: theme.colors.outlineVariant,
          borderBottomWidth: 0.5,
        }}
      >
        <Text style={{ padding: 15, fontSize: 20 }}>{route.name}</Text>
      </View>
      {/* <View> */}
      <LiveDataDisplay />
      {/* </View> */}
    </>
  );
}
