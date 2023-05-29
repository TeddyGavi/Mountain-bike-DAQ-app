# rn-ble

- Working with Zephyr Project and nrf52DK to create a simple heart rate monitor display


## Steps:
- I have already ran `npx expo prebuild` to expose the native code
- You will need node, expo-cli, eas-cli and npm to manage the packages!
- If building locally for android or is you want to use the emulator (ie. not useful for native modules using BLE) you will need android studio

### iOS

- `iOS` You will need an expo account, an apple developer account and build the app on expos servers
 - `eas build --profile <YOUR NAME ie development> --platform ios` 
 - `yes` to provisioning
 - `no` to push notifications 
- enable developer mode on `iPhone`
  - 
- should get a QR back to install and run the app locally


### Android

- run `npx expo run:android` to build the project locally
- should return a QR code or if the studio is installed with proper env variables set up you will get the emulator loaded
