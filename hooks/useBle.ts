import { useMemo, useState } from "react";
import {
  BleError,
  BleManager,
  Characteristic,
  Device,
  Subscription,
  Service,
} from "react-native-ble-plx";
import * as TaskManager from "expo-task-manager";
import { PermissionsAndroid, Platform } from "react-native";
import * as ExpoDevice from "expo-device";
import base64 from "react-native-base64";
import { Buffer } from "buffer";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, set } from "firebase/database";

// task
const BLUETOOTH_TASK = "BLUETOOTH_TASK";
// Standard HEART rate UUID data
const HEART_RATE_SERVICEID = "0000180d-0000-1000-8000-00805f9b34fb";
const HEART_RATE_CHARACTERISTICID = "00002a37-0000-1000-8000-00805f9b34fb";

// CUSTOM UUIds where sensor data is transmitted
const CUSTOM_SERVICEID = "12345678-1234-5678-1234-56789abcdef0";
const CUSTOM_CHARACTERISTICID = "12345678-1234-5678-1234-56789abcdef1";

// Other Heart Rate Char UUIDS as defined in Bluetooth SIG
const BODY_LOCATION_UUID = "00002A38-0000-1000-8000-00805F9B34FB";
const CONTROL_POINT_UUID = "00002A39-0000-1000-8000-00805F9B34FB";

// Battery level
const BATTERY_LEVEL_SERVICE = "0000180f-0000-1000-8000-00805f9b34fb";
const BATTERY_LEVEL_CHAR = "00002a19-0000-1000-8000-00805f9b34fb";


const firebaseConfig = {
  apiKey: "AIzaSyCO3l-tI4lb19mrKhFrG1e3zS7ZBU6SQSw",
  authDomain: "bikedaq-d46f1.firebaseapp.com",
  databaseURL: "https://bikedaq-d46f1-default-rtdb.firebaseio.com",
  projectId: "bikedaq-d46f1",
  storageBucket: "bikedaq-d46f1.appspot.com",
  messagingSenderId: "131806723986",
  appId: "1:131806723986:web:2db903df2bfaa334bc8b4b",
  measurementId: "G-CEYMQQGFE8",
  databaseURL: "https://bikedaq-d46f1-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

function writeUserData(userId, name) {
  const db = getDatabase();

  set(ref(db, 'users/' + userId), {
    username: name,
  });
}

interface BluetoothLowEnergyApi {
  requestPermissions(): Promise<boolean>;
  scanForPeripherals(): void;
  allDevices: Device[];
  connectToDevice: (deviceId: Device) => Promise<void>;
  connectedDevice: Device | null;
  disconnectFromDevice: () => void;
  heartRate: number;
  batteryLevel: number;
  sensorData: number;
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
  const [sensorData, setSensorData] = useState<number>(0);
  const [subscription, setSubscription] = useState<Subscription[]>([]);

  const resetState = () => {
    setConnectedDevice(null);
    setHeartRate(0);
    setBatteryLevel(0);
    setSensorData(0);
    setConnectedDevice(null);
  };

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
      bleManager.stopDeviceScan();
      // startStreamingHRData(deviceConnection);
      // streamBattery(deviceConnection);
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
      // const decodedValue = (array16[1] << 8) + array16[0];

      let innerHeartRate: number = -1;

      const firstBitValue: number = Number(rawData) & 0x01;

      if (!firstBitValue || firstBitValue === 1) {
        innerHeartRate = rawData[1].charCodeAt(0);
        innerHeartRate = 0;
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
      const buffer = Buffer.from(characteristic.value, "base64");
      setSensorData(buffer.readUInt16LE(0));
      console.log(buffer.readUint16LE(0));
    }
    writeUserData("test", "test2");
  };

  const startStreamingHRData = (device: Device) => {
    if (device) {
      const subscription = device.monitorCharacteristicForService(
        HEART_RATE_SERVICEID,
        HEART_RATE_CHARACTERISTICID,
        onHeartRateUpdate
      );
      setSubscription((prev) => [...prev, subscription]);
    } else {
      console.log("no device connected");
    }
  };

  const streamBattery = (device: Device) => {
    if (device) {
      const subscription = device.monitorCharacteristicForService(
        BATTERY_LEVEL_SERVICE,
        BATTERY_LEVEL_CHAR,
        onBatteryUpdate
      );
      setSubscription((prev) => [...prev, subscription]);
    } else {
      console.log("no device connected");
    }
  };

  const streamCustom = async (device: Device) => {
    if (device) {
      const subscription = device.monitorCharacteristicForService(
        CUSTOM_SERVICEID,
        CUSTOM_CHARACTERISTICID,
        onCustom
      );
      setSubscription((prev) => [...prev, subscription]);
    } else {
      console.log("no device");
    }
  };

  const disconnectFromDevice = () => {
    if (connectedDevice && subscription) {
      subscription.forEach((s) => s.remove());
      bleManager.cancelDeviceConnection(connectedDevice.id);
      resetState();
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
    sensorData,
  };
}

export default useBle;
