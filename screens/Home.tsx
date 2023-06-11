import { View, Text, Button } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useEffect } from "react";
import Header from "../components/Header";

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  useEffect(() => {
    navigation.setOptions({ header: (props) => <Header {...props} /> });
  }, [navigation]);
  return (
    <View>
      <Text>HomeScreen</Text>
    </View>
  );
}
