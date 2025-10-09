// App.tsx
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";

// Screens
import AnalyticsScreen from "./screens/analytics";
import ProfileScreen from "./screens/profile_screen";
import ScannerScreen from "./screens/scanner_screen";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName = "ios-home";
          if (route.name === "Scanner") iconName = "ios-wifi";
          else if (route.name === "Analytics") iconName = "ios-stats-chart";
          else if (route.name === "Profile") iconName = "ios-person";
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#2196F3",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Scanner" component={ScannerScreen} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
