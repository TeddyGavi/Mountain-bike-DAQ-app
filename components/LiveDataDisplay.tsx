import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DeviceModal from "./DeviceConnectionModal";
import { PulseIndicator } from "./PulseIndicator";
import useBle from "../hooks/useBle";
import useLocation from "../hooks/useLocation";
import useFileSystem from "../hooks/useFileSystem";
import { prepareData } from "../dataFilter/prepareData";

function LiveDataDisplay() {
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

  const { filesystemPermissions } = useFileSystem();
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
    <SafeAreaView style={styles.container}>
      <Text style={styles.heartRateText}>{}</Text>
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
      {/* <TouchableOpacity style={styles.ctaButton} onPress={() => null}> */}
      {/* <Text style={styles.ctaButtonText}>Data</Text> */}
      {/* </TouchableOpacity> */}
      <DeviceModal
        closeModal={hideModal}
        visible={isModalVisible}
        connectToPeripheral={connectToDevice}
        devices={allDevices}
        scan={scanForPeripherals}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    // alignContent: "center",
    // display: "flex",
    // alignItems: "center",
  },
  heartRateTitleWrapper: {
    flex: 1,
    justifyContent: "space-evenly",
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

export default LiveDataDisplay;
