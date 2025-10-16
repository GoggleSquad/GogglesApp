// _layout.tsx
import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AnalyticsOverviewScreen from "./screens/analytics_overview_screen";
import ProfileScreen from "./screens/profile_screen";
import ScannerScreen from "./screens/scanner_screen";
import AnalyticsScreen from "./screens/analytics";

const PRIMARY_RED = "#FF4757";
const DARK_GRAY = "#666666";

export default function Layout() {
  const [currentScreen, setCurrentScreen] = useState("home");

  const getScreen = () => {
    switch (currentScreen) {
      case "home":
        return <AnalyticsOverviewScreen />;
      case "sessions":
        return <AnalyticsScreen />;
      case "scanner":
        return <ScannerScreen />;
      case "analytics":
        return <AnalyticsOverviewScreen />;
      case "profile":
        return <ProfileScreen />;
      default:
        return <AnalyticsOverviewScreen />;
    }
  };

  const getTabColor = (screen: string) =>
    currentScreen === screen ? PRIMARY_RED : DARK_GRAY;

  return (
    <View style={styles.container}>
      {/* Screen Content */}
      <View style={styles.screenContainer}>
        {getScreen()}
      </View>

      {/* Custom Bottom Tab Bar */}
      <View style={styles.tabBarContainer}>
        {/* Home Tab */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setCurrentScreen("home")}
          activeOpacity={0.7}
        >
          <Ionicons name="home" size={24} color={getTabColor("home")} />
          <Text style={[styles.tabLabel, { color: getTabColor("home") }]}>Home</Text>
        </TouchableOpacity>

        {/* Sessions Tab */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setCurrentScreen("sessions")}
          activeOpacity={0.7}
        >
          <Ionicons name="receipt" size={24} color={getTabColor("sessions")} />
          <Text style={[styles.tabLabel, { color: getTabColor("sessions") }]}>Sessions</Text>
        </TouchableOpacity>

        {/* Center FAB Button */}
        <TouchableOpacity
          style={styles.fabButton}
          onPress={() => setCurrentScreen("scanner")}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={32} color="white" />
        </TouchableOpacity>

        {/* Analytics Tab */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setCurrentScreen("analytics")}
          activeOpacity={0.7}
        >
          <Ionicons
            name="bar-chart"
            size={24}
            color={getTabColor("analytics")}
          />
          <Text style={[styles.tabLabel, { color: getTabColor("analytics") }]}>Analytics</Text>
        </TouchableOpacity>

        {/* Profile Tab */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setCurrentScreen("profile")}
          activeOpacity={0.7}
        >
          <Ionicons name="person" size={24} color={getTabColor("profile")} />
          <Text style={[styles.tabLabel, { color: getTabColor("profile") }]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  screenContainer: {
    flex: 1,
  },
  tabBarContainer: {
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingBottom: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 70,
  },
  tabItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 70,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: "500",
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: PRIMARY_RED,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});