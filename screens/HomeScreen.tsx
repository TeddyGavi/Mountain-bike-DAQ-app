import { View, Text, Button } from "react-native";
import React from "react";

export default function HomeScreen({ navigation }) {
  return (
    <View>
      <Text>HomeScreen</Text>
      <Button
        title="Record a Ride"
        onPress={() => navigation.navigate("RecorderScreen")}
      />
    </View>
  );
}
