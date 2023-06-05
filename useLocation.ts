import React, { useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

const LOCATION_TRACKING = "LOCATION_TRACKING";

interface CurrPos {
  lat: number;
  long: number;
  speed: number;
}

interface LocationAPI {
  requestLocationPermissions: () => Promise<boolean>;
  startLocationTracking: () => void;
  trackingStarted: boolean;
  checkBackgroundTracking: () => Promise<void>;
  stopTracking: () => Promise<void>;
  currentPosition: null | CurrPos;
}

function useLocation(): LocationAPI {
  const [location, setLocation] = useState<Location.LocationObjectCoords>();
  const [trackingStarted, setTrackingStarted] = useState<boolean>(false);
  const [currentPosition, setCurrentPosition] = useState<CurrPos>({
    lat: 0,
    long: 0,
    speed: 0,
  });

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
        let speed = data.locations[0].coords.speed;
        let curr: CurrPos = {
          lat,
          long,
          speed,
        };
        setCurrentPosition(curr);
        console.log(
          `${new Date(Date.now()).toLocaleString()}: ${lat},${long} Speed: ${
            data.locations[0].coords.speed
          }`
        );
      }
    }
  });

  const checkBackgroundTracking = async () => {
    const res = await TaskManager.isTaskRegisteredAsync(LOCATION_TRACKING);
    setTrackingStarted(res);
  };

  const stopTracking = async () => {
    setTrackingStarted(false);
    setCurrentPosition({ lat: 0, long: 0, speed: 0 });
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
    currentPosition,
  };
}

export default useLocation;
