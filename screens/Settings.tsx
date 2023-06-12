import { View, Text, SectionList, StyleSheet, StatusBar } from "react-native";
import React from "react";

interface ISettingsData {
  title: string;
  icon?: JSX.Element;
  data: SettingsType[];
}

type SettingsType = "aboutMe" | "spaceAPI" | "help" | "theme";

const settingsData: ISettingsData[] = [
  {
    title: "About",
    data: ["aboutMe", "spaceAPI", "theme"],
  },
  {
    title: "Feedback and Help",
    data: ["help"],
  },
];
export default function Settings({ navigation }) {
  return (
    <View>
      <Text>Settings go here</Text>
      <SectionList
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.title}>{item}</Text>
          </View>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.header}>{title}</Text>
        )}
        sections={settingsData}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    marginHorizontal: 16,
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
  },
  header: {
    fontSize: 32,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
  },
});
