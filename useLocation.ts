import React from "react";
import { PermissionsAndroid, Platform } from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

const LOCATION_TRACKING = "LOCATION_TRACKING";

interface LocationAPI {
  requestLocationPermissions: () => Promise<boolean>;
}

function useLocation(): LocationAPI {
  const requestLocationPermissions = async () => {
    const foreground = await Location.requestForegroundPermissionsAsync();
    const background = await Location.requestBackgroundPermissionsAsync();

    if (foreground.status !== "granted" && background.status !== "granted") {
      console.log("permission denied for location");
      return false;
    } else {
      return true;
    }
  };

  return {
    requestLocationPermissions,
  };
}

export default useLocation;
