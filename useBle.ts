import { useMemo, useState } from "react";
import {
  BleError,
  BleManager,
  Characteristic,
  Device,
  Service,
} from "react-native-ble-plx";
import { PermissionsAndroid, Platform } from "react-native";
import * as ExpoDevice from "expo-device";
import base64 from "react-native-base64";
import { Buffer } from "buffer";

const HEART_RATE_SERVICEID = "0000180D-0000-1000-8000-00805F9B34FB";
const HEART_RATE_CHARACTERISTICID = "00002A37-0000-1000-8000-00805f9B34FB";
const BODY_LOCATION_UUID = "00002A38-0000-1000-8000-00805F9B34FB";
const CONTROL_POINT_UUID = "00002A39-0000-1000-8000-00805F9B34FB";
const CUSTOM_CHAR = "12345678-1234-5678-1234-56789abcdef0";
const SERVICE1 = "12345678-1234-5678-1234-56789abcdef1";
const SERVICE2 = "12345678-1234-5678-1234-56789abcdef2";
const SERVICE3 = "12345678-1234-5678-1234-56789abcdef3";
const SERVICE4 = "12345678-1234-5678-1234-56789abcdef4";

const BATTERY_LEVEL_SERVICE = "0000180f-0000-1000-8000-00805f9b34fb";
const BATTERY_LEVEL_CHAR = "00002a19-0000-1000-8000-00805f9b34fb";

interface BluetoothLowEnergyApi {
  requestPermissions(): Promise<boolean>;
  scanForPeripherals(): void;
  allDevices: Device[];
  connectToDevice: (deviceId: Device) => Promise<void>;
  connectedDevice: Device | null;
  disconnectFromDevice: () => void;
  heartRate: number;
  batteryLevel: number;
}

function useBle(): BluetoothLowEnergyApi {
  const bleManager = useMemo(
    () => new BleManager(),
    // {
    //   restoreStateIdentifier: "BleInTheBackground",
    //   restoreStateFunction: (restoredState) => {
    //     if (restoredState === null) {
    //       // BleManager was constructed for the first time.
    //       return;
    //     } else {
    //       // BleManager was restored. Check `restoredState.connectedPeripherals` property.
    //       // array of peripherals
    //       const restoredDevices = restoredState.connectedPeripherals;
    //       const device = restoredDevices.filter((device) =>
    //         device.name?.includes("zephyr")
    //       );
    //       setConnectedDevice(device[0]);
    //     }
    //   },
    // }),
    []
  );

  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [heartRate, setHeartRate] = useState<number>(0);
  const [batteryLevel, setBatteryLevel] = useState<number>(0);

  const requestAndroid31Permissions = async () => {
    const bluetoothScanPermissions = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: "Scan Permission",
        message: "app requires Bluetooth Scanning",
        buttonPositive: "Ok",
      }
    );
    const bluetoothConnectPermissions = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: "Scan Permission",
        message: "app requires Bluetooth Connecting",
        buttonPositive: "Ok",
      }
    );
    const bluetoothFineLocationPermissions = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Scan Permission",
        message: "app requires fine location",
        buttonPositive: "Ok",
      }
    );

    return (
      bluetoothScanPermissions === "granted" &&
      bluetoothConnectPermissions == "granted" &&
      bluetoothFineLocationPermissions === "granted"
    );
  };

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "App requires location",
            buttonPositive: "Ok",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const isAndroid31PermissionsGranted =
          await requestAndroid31Permissions();
        return isAndroid31PermissionsGranted;
      }
    } else {
      return true;
    }
  };

  const isDuplicateDevice = (devices: Device[], nextDevice: Device) => {
    return devices.findIndex((device) => nextDevice.id === device.id) > -1;
  };

  const scanForPeripherals = () => {
    console.log("scanning");
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
      }
      if (device && device.name?.includes("Zephyr")) {
        setAllDevices((prev) => {
          if (!isDuplicateDevice(prev, device)) {
            return [...prev, device];
          } else {
            return prev;
          }
        });
      }
    });
  };

  const connectToDevice = async (device: Device) => {
    try {
      const deviceConnection = await bleManager.connectToDevice(device.id);
      setConnectedDevice(deviceConnection);
      await deviceConnection.discoverAllServicesAndCharacteristics();
      // const services = await device.services()
      // const chars = await device.characteristicsForService(CUSTOM_CHAR)
      // console.log(device.serviceData, device.serviceUUIDs, chars)
      bleManager.stopDeviceScan();
      startStreamingData(deviceConnection);
      streamBattery(deviceConnection);
      streamCustom(deviceConnection);
    } catch (error) {
      console.log("ERROR IN CONNECTION", error);
    }
  };

  const onHeartRateUpdate = (
    error: BleError | null,
    characteristic: Characteristic | null
  ) => {
    if (error) {
      console.log(error);
    } else if (!characteristic?.value) {
      console.log("No Data Received");
    } else {
      const rawData = base64.decode(characteristic.value);
      // const integer = array16.readUInt16LE(0)
      const array16 = Buffer.from(characteristic.value, "base64");
      console.log("encoded string ===>", characteristic.value, "array Uint values ===>", array16[0], array16[1], "Binary ===>", (array16[0] >>> 0).toString(2), (array16[1] >>> 0).toString(2))
      // console.log(Uint16Array.from(rawData, (c) => c.charCodeAt(0)))
      // console.log(Uint8Array.from(characteristic.value, (c) => c.charCodeAt(0)))
      const decodedValue = (array16[1] << 8) + array16[0] >> 6;
      // console.log(decodedValue)

      let innerHeartRate: number = -1;

      const firstBitValue: number = Number(rawData) & 0x01;
      // console.log(firstBitValue)

      if (firstBitValue === 0) {
        innerHeartRate = rawData[1].charCodeAt(0);
      } else {
        innerHeartRate =
          Number(rawData[1].charCodeAt(0) << 8) +
          Number(rawData[2].charCodeAt(2));
      }
      setHeartRate(innerHeartRate);
    }
  };

  const onBatteryUpdate = (
    error: BleError | null,
    characteristic: Characteristic | null
  ) => {
    if (error) {
      console.log(error);
    } else if (!characteristic?.value) {
      console.log("No Data Received");
    } else {
      let batteryLevel = 0;
      const raw = base64.decode(characteristic.value);
      const first: number = Number(raw) & 0x01;

      if (first === 0) {
        // console.log(raw.charCodeAt(0));
        batteryLevel = raw.charCodeAt(0);
      } else {
        batteryLevel = 0;
      }
      setBatteryLevel(batteryLevel);
    }
  };

  const onCustom = (
    error: BleError | null,
    characteristic: Characteristic | null
  ) => {
    if (error) {
      console.log(error);
    } else if (!characteristic?.value) {
      console.log("No Data Received");
    } else {
      console.log(characteristic);
    }
  };

  const startStreamingData = (device: Device) => {
    if (device) {
      device.monitorCharacteristicForService(
        HEART_RATE_SERVICEID,
        HEART_RATE_CHARACTERISTICID,
        onHeartRateUpdate
      );
    } else {
      console.log("no device connected");
    }
  };

  const streamBattery = (device: Device) => {
    if (device) {
      device.monitorCharacteristicForService(
        BATTERY_LEVEL_SERVICE,
        BATTERY_LEVEL_CHAR,
        onBatteryUpdate
      );
    } else {
      console.log("no device connected");
    }
  };

  const streamCustom = async (device: Device) => {
    if (device) {
      device.monitorCharacteristicForService(CUSTOM_CHAR, HEART_RATE_CHARACTERISTICID, onCustom);
    } else {
      console.log("no device");
    }
  };

  const disconnectFromDevice = () => {
    if (connectedDevice) {
      bleManager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);
      setHeartRate(0);
      // console.log(allDevices);
    }
  };

  return {
    scanForPeripherals,
    requestPermissions,
    allDevices,
    connectToDevice,
    connectedDevice,
    heartRate,
    disconnectFromDevice,
    batteryLevel,
  };
}

export default useBle;
