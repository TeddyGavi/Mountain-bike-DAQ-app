import { View, Text, Button } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React from "react";
import Header from "../components/Header";

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  return (
    <View>
      <Header />
      <Text>HomeScreen</Text>
      <Button
        title="Record a Ride"
        onPress={() => navigation.navigate("Record")}
      />
    </View>
  );
}
