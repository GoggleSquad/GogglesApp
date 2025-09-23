import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Platform, PermissionsAndroid, Alert } from "react-native";
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

export default function App() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [countdown, setCountdown] = useState(10);
  const [isScanning, setIsScanning] = useState(false);
  const [bleState, setBleState] = useState<string>("Unknown");
  const [gogglesDevices, setGogglesDevices] = useState<Device[]>([]);

  useEffect(() => {
    requestPermissions();

    const subscription = manager.onStateChange((state) => {
      console.log("BLE state:", state);
      setBleState(state);
      if (state === "PoweredOn") {
        scanAndFilter();
      }
    }, true);

    // Set up auto-refresh every 10 seconds
    const refreshInterval = setInterval(() => {
      if (bleState === "PoweredOn") {
        scanAndFilter();
      }
    }, 10000);

    // Countdown timer that updates every second
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          return 10; // Reset to 10 when it reaches 0
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(refreshInterval);
      clearInterval(countdownInterval);
      subscription.remove();
      manager.stopDeviceScan();
    };
  }, [bleState]);

  const scanAndFilter = () => {
    setIsScanning(true);
    setCountdown(10); // Reset countdown when starting new scan
    setDevices([]); // Clear all devices
    setGogglesDevices([]); // Clear goggles devices

    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error("Scan error:", error);
        setIsScanning(false);
        return;
      }

      if (device && device.name) {
        // Add all devices to the main list
        setDevices((prev) => {
          if (!prev.find((d) => d.id === device.id)) {
            return [...prev, device];
          }
          return prev;
        });

        // Filter for goggles specifically
        if (device.name.toLowerCase().includes("goggles")) {
          setGogglesDevices((prev) => {
            if (!prev.find((d) => d.id === device.id)) {
              return [...prev, device];
            }
            return prev;
          });
        }
      }
    });

    // Stop scanning after 3 seconds (shorter for frequent refreshes)
    setTimeout(() => {
      manager.stopDeviceScan();
      setIsScanning(false);
    }, 3000);
  };

  const getStatusColor = () => {
    if (bleState === "PoweredOn") return "#4CAF50";
    if (bleState === "PoweredOff") return "#F44336";
    return "#FF9800";
  };

  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        <Text style={styles.title}>Swim Goggles Scanner</Text>
        
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Bluetooth:</Text>
          <Text style={[styles.statusValue, { color: getStatusColor() }]}>
            {bleState}
          </Text>
        </View>

        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Scanning:</Text>
          <Text style={[styles.statusValue, { color: isScanning ? "#2196F3" : "#666" }]}>
            {isScanning ? "Active" : "Idle"}
          </Text>
        </View>

        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Next refresh in:</Text>
          <Text style={styles.countdown}>{countdown}s</Text>
        </View>

        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>All devices found:</Text>
          <Text style={styles.statusValue}>{devices.length}</Text>
        </View>
      </View>

      <View style={styles.devicesContainer}>
        <Text style={styles.devicesTitle}>
          🥽 Goggles Found: {gogglesDevices.length}
        </Text>
        
        {gogglesDevices.length === 0 ? (
          <Text style={styles.noDevices}>
            {isScanning ? "Searching for goggles..." : "No goggles detected"}
          </Text>
        ) : (
          <FlatList
            data={gogglesDevices}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.deviceItem}>
                <Text style={styles.deviceName}>{item.name}</Text>
                <Text style={styles.deviceId}>{item.id}</Text>
                <Text style={styles.deviceRSSI}>
                  Signal: {item.rssi ? `${item.rssi} dBm` : "Unknown"}
                </Text>
              </View>
            )}
          />
        )}
      </View>

      <View style={styles.allDevicesContainer}>
        <Text style={styles.allDevicesTitle}>
          📱 All BLE Devices: {devices.length}
        </Text>
        <FlatList
          data={devices.slice(0, 8)} // Show first 8 devices to save space
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.smallDeviceItem}>
              <Text style={styles.smallDeviceName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.smallDeviceRSSI}>
                {item.rssi ? `${item.rssi} dBm` : "N/A"}
              </Text>
            </View>
          )}
          scrollEnabled={false}
        />
        {devices.length > 8 && (
          <Text style={styles.moreDevices}>
            ... and {devices.length - 8} more devices
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    marginTop: 40,
    backgroundColor: "#f5f5f5"
  },
  statusContainer: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 15,
    textAlign: "center",
    color: "#333"
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 16,
    color: "#666",
  },
  statusValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  countdown: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2196F3",
  },
  devicesContainer: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    minHeight: 150,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  devicesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  noDevices: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
  },
  deviceItem: {
    backgroundColor: "#e8f5e8",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  deviceName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  deviceId: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  deviceRSSI: {
    fontSize: 12,
    color: "#888",
  },
  allDevicesContainer: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    flex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  allDevicesTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#666",
  },
  smallDeviceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: "#f8f9fa",
    marginBottom: 3,
    borderRadius: 4,
  },
  smallDeviceName: {
    fontSize: 12,
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  smallDeviceRSSI: {
    fontSize: 10,
    color: "#888",
    minWidth: 50,
  },
  moreDevices: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    marginTop: 5,
    fontStyle: "italic",
  },
});