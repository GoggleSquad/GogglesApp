// ble/BleManagerSetup.ts
import { BleManager } from "react-native-ble-plx";
import { Alert, PermissionsAndroid, Platform } from "react-native";

export const manager = new BleManager();

export async function requestPermissions() {
  if (Platform.OS === "android") {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ]);

    const allGranted = Object.values(granted).every(
      (status) => status === PermissionsAndroid.RESULTS.GRANTED
    );

    if (!allGranted) {
      Alert.alert(
        "Permissions required",
        "Bluetooth permissions are required to use this app."
      );
    }
  }
}
