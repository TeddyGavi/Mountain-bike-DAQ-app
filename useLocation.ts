import React, { useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

const LOCATION_TRACKING = "LOCATION_TRACKING";

interface LocationAPI {
  requestLocationPermissions: () => Promise<boolean>;
  startLocationTracking: () => void;
}

function useLocation(): LocationAPI {
  const [location, setLocation] = useState<Location.LocationObjectCoords>();
  const [trackingStarted, setTrackingStarted] = useState<boolean>(false);

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

  // init task Manager
  TaskManager.defineTask(LOCATION_TRACKING, async ({ data, error }) => {
    if (error) {
      console.log("error", error);
      return;
    } else {
      if (data) {
        // console.log(data.locations, data.locations[0].coords.speed);
        const { locations } = data;

        let lat = locations[0].coords.latitude.toFixed(3);
        let long = locations[0].coords.longitude.toFixed(3);
        console.log(
          `${new Date(Date.now()).toLocaleString()}: ${lat},${long} Speed: ${
            data.locations[0].coords.speed
          }`
        );
      }
    }
  });
  return {
    requestLocationPermissions,
    startLocationTracking,
  };
}

export default useLocation;
