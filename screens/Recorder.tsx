import { View, Pressable, StyleSheet } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import React, { useState } from "react";
import { useTheme, Card, Title, Text, FAB, List } from "react-native-paper";

import DeviceModal from "../components/DeviceConnectionModal";
import { PulseIndicator } from "../components/PulseIndicator";
import useBle from "../hooks/useBle";
import useLocation from "../hooks/useLocation";

export default function RecorderScreen({ navigation, route }) {
  const {
    requestPermissions,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    connectedDevice,
    disconnectFromDevice,
    sensorData,
  } = useBle();

  const {
    requestLocationPermissions,
    startLocationTracking,
    trackingStarted,
    checkBackgroundTracking,
    stopTracking,
    location,
  } = useLocation();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const startTracking = async () => {
    const isLocationAllowed = await requestLocationPermissions();
    if (isLocationAllowed) {
      // setIsTrackingAllowed(true);
      startLocationTracking();
    }
  };

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanForPeripherals();
    }
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const openModal = async () => {
    scanForDevices();
    setIsModalVisible(true);
  };
  return (
    <SafeAreaView
      style={{
        backgroundColor: theme.colors.surface,
        display: "flex",
        flex: 1,
        alignItems: "center",
        alignContent: "center",
      }}
    >
      <View
        style={{
          borderBottomColor: theme.colors.outlineVariant,
          borderBottomWidth: 1,
          alignItems: "center",
          position: "absolute",
          top: 50,
        }}
      >
        <Title style={{}}>{route.name}</Title>
      </View>
      {connectedDevice ? (
        <FAB
          icon="bluetooth"
          style={styles.fab}
          onPress={disconnectFromDevice}
          variant="surface"
          label="Disconnect"
        ></FAB>
      ) : (
        <FAB
          icon="bluetooth-connect"
          style={styles.fab}
          onPress={openModal}
          variant="surface"
          label="Connect"
        ></FAB>
      )}
      {connectedDevice && (
        <>
          <Text variant="labelSmall" style={styles.title}>
            {allDevices[0].name} now connected
          </Text>
          <PulseIndicator />
          <Text variant="titleLarge"> Distance: {sensorData}</Text>
        </>
      )}

      <DeviceModal
        closeModal={hideModal}
        visible={isModalVisible}
        connectToPeripheral={connectToDevice}
        devices={allDevices}
        scan={scanForPeripherals}
      ></DeviceModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    // right: 0,
    top: 100,
  },
  title: {
    justifyContent: "space-evenly",
    alignContent: "center",
    marginTop: 150,
  },
});
