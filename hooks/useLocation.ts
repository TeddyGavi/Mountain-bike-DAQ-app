import { useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

const LOCATION_TRACKING = "LOCATION_TRACKING";

const defaultLocation = {
  latitude: 0,
  longitude: 0,
  accuracy: null,
  altitude: null,
  altitudeAccuracy: null,
  heading: null,
  speed: null,
};

interface LocationAPI {
  requestLocationPermissions: () => Promise<boolean>;
  startLocationTracking: () => void;
  trackingStarted: boolean;
  checkBackgroundTracking: () => Promise<void>;
  stopTracking: () => Promise<void>;
  location: Location.LocationObjectCoords;
}

function useLocation(): LocationAPI {
  const [location, setLocation] =
    useState<Location.LocationObjectCoords>(defaultLocation);
  const [trackingStarted, setTrackingStarted] = useState<boolean>(false);

  const requestLocationPermissions = async () => {
    if (Platform.OS === "ios") {
      const foreground = await Location.requestForegroundPermissionsAsync();
      const background = await Location.requestBackgroundPermissionsAsync();

      if (foreground.status !== "granted" && background.status !== "granted") {
        console.log("permission denied for location");
        return false;
      } else {
        return true;
      }
    } else {
      const coarse = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        {
          title: "location permission",
          message: "app needs location",
          buttonPositive: "Ok",
        }
      );
      const foreground = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.FOREGROUND_SERVICE,
        {
          title: "Foreground Location",
          message: "app needs to run in background!",
          buttonPositive: "Ok",
        }
      );
      const background = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
        {
          title: "Background Location",
          message: "app needs location",
          buttonPositive: "Ok",
        }
      );

      return (
        coarse === "granted" &&
        foreground === "granted" &&
        background === "granted"
      );
    }
  };

  // init tracking in background
  const startLocationTracking = async () => {
    await Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
      accuracy: Location.Accuracy.Highest,
      timeInterval: 5000,
      distanceInterval: 0,
    });
    const started = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TRACKING
    );
    setTrackingStarted(started);
    console.log("Tracking?", started);
  };

  // task executer
  const taskExecutor = ({
    data: { locations },
    error,
  }: {
    data: {
      locations?: Array<Location.LocationObject>;
      mocked?: false;
      timestamp?: number;
    };
    error: TaskManager.TaskManagerError | null;
  }) => {
    if (error) {
      console.log("error", error);
      return;
    } else {
      if (locations) {
        // console.log(data.locations, data.locations[0].coords.speed);
        // const { locations } = data;
        setLocation(locations[0].coords);
        console.log(
          `${new Date(Date.now()).toLocaleString()}: ${location?.latitude},${
            location?.longitude
          } Speed: ${locations[0].coords.speed}`
        );
      }
    }
  };

  // init task Manager
  TaskManager.defineTask(LOCATION_TRACKING, taskExecutor);

  const checkBackgroundTracking = async () => {
    const res = await TaskManager.isTaskRegisteredAsync(LOCATION_TRACKING);
    setTrackingStarted(res);
  };

  const stopTracking = async () => {
    setTrackingStarted(false);
    setLocation(defaultLocation);
    const tracking = await TaskManager.isTaskRegisteredAsync(LOCATION_TRACKING);
    if (tracking) {
      Location.stopLocationUpdatesAsync(LOCATION_TRACKING);
    }
  };

  return {
    requestLocationPermissions,
    startLocationTracking,
    trackingStarted,
    checkBackgroundTracking,
    stopTracking,
    location,
  };
}

export default useLocation;
