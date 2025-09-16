import React, { useEffect, useState } from "react";
import { View, Text, Button, Platform, PermissionsAndroid, Alert } from "react-native";
import { BleManager, Device } from "react-native-ble-plx";

const manager = new BleManager();

const requestPermissions = async () => {
  if (Platform.OS === "android") {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ]);

    const allGranted = Object.values(granted).every(status => status === PermissionsAndroid.RESULTS.GRANTED);
    if (!allGranted) {
      Alert.alert("Permissions required", "Bluetooth permissions are required to use this app.");
    }
  }
};

const App = () => {
  const [bleState, setBleState] = useState<string>("Unknown");
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    requestPermissions();

    const subscription = manager.onStateChange((state) => {
      console.log("BLE state:", state);
      setBleState(state);
    }, true);

    return () => subscription.remove();
  }, []);

  const scanDevices = () => {
    setDevices([]); // Clear previous scan
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error("Scan error:", error);
        return;
      }
      if (device && device.name) {
        setDevices((prev) => {
          if (!prev.find((d) => d.id === device.id)) {
            return [...prev, device];
          }
          return prev;
        });
      }
    });

    // Stop scanning after 10 seconds
    setTimeout(() => manager.stopDeviceScan(), 10000);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 16 }}>
      <Text>BLE State: {bleState}</Text>
      <Button title="Scan for Devices" onPress={scanDevices} />
      {devices.map((device) => (
        <Text key={device.id}>{device.name} ({device.id})</Text>
      ))}
    </View>
  );
};

export default App;
