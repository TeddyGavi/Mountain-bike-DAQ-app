# Mountain Bike DAQ App

> - To see the Firmware Code go [Mountain Bike DAQ](https://github.com/o7-machinehum/bike-daq)
> - Check out the YoutTube Video [We Measured Mountain Bike Suspension with a laser!](https://www.youtube.com/watch?v=SCmJ3pTyt44&feature=youtu.be&ab_channel=InterruptLabs)

## Table of contents

- [Install Options](#Install)
  - [General Steps](#general-steps)
  - [iOS](#ios)
  - [Android](#android)
  - [APK](#via-apk-or-aab-alternative-download-direct-android-build)
- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [View](#view)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

## Install

### General Steps:

- I have already ran `npx expo prebuild` to expose the native code
- isntalling any packages in the bare metal workflow requires a prebuild and proper config set up in `androidManifest` and `Info.plist`
- You will need node, expo-cli, eas-cli and npm to manage the packages!
- If building locally for android or is you want to use the emulator (ie. not useful for native modules using BLE) you will need android studio

- `git clone` and then `npm install` to set up

### iOS

- `iOS` You will need an expo account, an apple developer account and build the app on expos servers
- `eas build --profile development --platform ios`
- `yes` to provisioning
- `no` to push notifications
- ## enable developer mode on `iPhone`
- should get a QR back to install and run the app locally

### Android

Locally

> **NOTE:** Make Sure you have proper the proper Java environment and JDK as required by[Android Studio](https://developer.android.com/studio)

- run `npx expo run:android` to build the project locally
- you will need Android studio installed and have `ANDROID_HOME` set to the android SDK location.
- see the docs at [Android Studio](https://developer.android.com/studio)
- should return a QR code or if the studio is installed with proper env variables set up you will get the emulator loaded

#### Via APK or AAB Alternative (download direct android build)

- I have build the project on expos servers using `npx expo -p android`
- I can share the download link for the zipped project
- Download and extract and transfer to Android Device
- Allow install from unknown sources on phone
- install app!

#### To Build an APK on Expo

- have an expo account
- modify the `eas.json`

  ```json
  {
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "preview2": {
      "android": {
        "gradleCommand": ":app:assembleRelease"
      }
    },
    "preview3": {
      "developmentClient": true
    },
    "production": {}
  }
  ```

- and to build run:

```shell
eas build -p android --profile preview
```

- wait for the build to complete, download from expo and install on your device.

## Overview

- Working with Zephyr Project and nrf52DK (for Development) and a Arduino Nano 33 BLE for Production
- A laser sensor that measures fork travel used and displays live measurements on your mobile device.
- Data is recorded and processed in post.

### The challenge

- Current Hardware and Software solutions are expensive, bulky, and don't use LASERS!

### Screenshot

### View

### Links

## My process

### Built with

### What I learned

### Continued development

### Useful resources

## Author

- Website - [Matt Davis](https://matcdavis.dev/)
- Twitter - [@MatcDavis](https://twitter.com/MatcDavis)
- LinkedIn - [Matthew Davis](https://www.linkedin.com/in/matcdavis/)

## Acknowledgments
