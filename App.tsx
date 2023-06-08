import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DeviceModal from "./DeviceConnectionModal";
import { PulseIndicator } from "./PulseIndicator";
import useBle from "./useBle";
import useLocation from "./useLocation";
const App = () => {
  const {
    requestPermissions,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    connectedDevice,
    heartRate,
    disconnectFromDevice,
    batteryLevel,
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
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isTrackingAllowed, setIsTrackingAllowed] = useState<boolean>(false);

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

  useEffect(() => {
    checkBackgroundTracking();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heartRateTitleWrapper}>
        {connectedDevice ? (
          <>
            <PulseIndicator />
            <Text style={styles.heartRateTitleText}>Distance is: </Text>
            <Text style={styles.heartRateText}>{sensorData} </Text>
            <Text style={styles.heartRateTitleText}>Current Location:</Text>
            <Text style={styles.heartRateText}>{location.latitude} lat</Text>
            <Text style={styles.heartRateText}>{location.longitude} long</Text>
            <Text style={styles.heartRateText}>{location.speed} speed</Text>
          </>
        ) : (
          <Text style={styles.heartRateTitleText}>
            Please Connect a BLE device
          </Text>
        )}
      </View>
      {connectedDevice && (
        <TouchableOpacity
          onPress={trackingStarted ? stopTracking : startTracking}
          style={styles.ctaButton}
        >
          <Text style={styles.ctaButtonText}>
            {" "}
            {trackingStarted ? "Stop Tracking?" : "Start Tracking?"}
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={connectedDevice ? disconnectFromDevice : openModal}
        style={styles.ctaButton}
      >
        <Text style={styles.ctaButtonText}>
          {connectedDevice ? "Disconnect" : "Connect"}
        </Text>
      </TouchableOpacity>
      <DeviceModal
        closeModal={hideModal}
        visible={isModalVisible}
        connectToPeripheral={connectToDevice}
        devices={allDevices}
        scan={scanForPeripherals}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  heartRateTitleWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heartRateTitleText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginHorizontal: 20,
    color: "black",
  },
  heartRateText: {
    fontSize: 25,
    marginTop: 15,
  },
  ctaButton: {
    backgroundColor: "#FF6060",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    marginHorizontal: 20,
    marginBottom: 5,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});

export default App;
