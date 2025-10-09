// screens/ScannerScreen.tsx
import React, { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { Device } from "react-native-ble-plx";
import { manager, requestPermissions } from "../BLE/ble_setup";
import { scannerStyles as styles } from "../styles/scanner_styles";

const ScannerScreen: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [gogglesDevices, setGogglesDevices] = useState<Device[]>([]);
  const [countdown, setCountdown] = useState(10);
  const [isScanning, setIsScanning] = useState(false);
  const [bleState, setBleState] = useState<string>("Unknown");

  useEffect(() => {
    requestPermissions();

    const subscription = manager.onStateChange((state) => {
      setBleState(state);
      if (state === "PoweredOn") {
        scanAndFilter();
      }
    }, true);

    const refreshInterval = setInterval(() => {
      if (bleState === "PoweredOn") scanAndFilter();
    }, 10000);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 10 : prev - 1));
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
    setCountdown(10);
    setDevices([]);
    setGogglesDevices([]);

    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error("Scan error:", error);
        setIsScanning(false);
        return;
      }

      if (device && device.name) {
        setDevices((prev) =>
          prev.find((d) => d.id === device.id) ? prev : [...prev, device]
        );

        if (device.name.toLowerCase().includes("goggles")) {
          setGogglesDevices((prev) =>
            prev.find((d) => d.id === device.id) ? prev : [...prev, device]
          );
        }
      }
    });

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
          <Text
            style={[
              styles.statusValue,
              { color: isScanning ? "#2196F3" : "#666" },
            ]}
          >
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
          data={devices.slice(0, 8)}
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
};

export default ScannerScreen;
