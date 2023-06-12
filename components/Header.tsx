import { View, Text, Pressable, StyleSheet } from "react-native";
import React from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { useTheme } from "react-native-paper";

export default function Header(props: NativeStackHeaderProps) {
  const { navigation, back, options, route } = props;
  const theme = useTheme();

  if (back) {
    return (
      <View
        style={[
          style.containerBack,
          // { backgroundColor: theme.colors.background },
        ]}
      >
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
      <View
        style={[
          style.container,
          {
            backgroundColor: theme.colors.surface,
            borderBottomColor: theme.colors.outlineVariant,
            borderBottomWidth: 0.5,
          },
        ]}
      >
        <Pressable onPress={() => navigation.navigate("Account")}>
          <MaterialCommunityIcons
            name="account-cog"
            size={26}
            color={theme.colors.primary}
          />
        </Pressable>
        <Text
          style={{
            fontSize: 20,
            color: theme.colors.onTertiaryContainer,
          }}
        >
          {options.title || route.name}
        </Text>
        <Pressable onPress={() => navigation.navigate("SettingsStack")}>
          <MaterialCommunityIcons
            name="cog"
            size={26}
            color={theme.colors.primary}
          />
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
  },
  containerBack: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    height: 100,
    padding: 15,
    // backgroundColor: "#d7e2e141",
  },
});
