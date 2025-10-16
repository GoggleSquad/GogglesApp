// App.tsx
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

// Screens
import AnalyticsScreen from "./screens/analytics";
import AnalyticsOverviewScreen from "./screens/analytics_overview_screen";
import ProfileScreen from "./screens/profile_screen";
import ScannerScreen from "./screens/scanner_screen";

const Tab = createBottomTabNavigator();

const PRIMARY_RED = "#FF4757";
const LIGHT_GRAY = "#F5F5F5";
const DARK_GRAY = "#666666";

function CustomTabBar({ state, descriptors, navigation }: any) {
  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.tabBar}>
        {state.routes.slice(0, 2).map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              preventDefault: false,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          let iconName: keyof typeof Ionicons.glyphMap = "ios-home";
          if (route.name === "Home") iconName = "ios-home";
          else if (route.name === "Sessions") iconName = "ios-list";

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabItem}
              activeOpacity={0.7}
            >
              <Ionicons
                name={iconName}
                size={24}
                color={isFocused ? PRIMARY_RED : DARK_GRAY}
              />
            </TouchableOpacity>
          );
        })}

        {/* Center FAB Button */}
        <TouchableOpacity
          style={styles.fabButton}
          onPress={() => navigation.navigate("Scanner")}
          activeOpacity={0.85}
        >
          <Ionicons name="ios-add" size={32} color="white" />
        </TouchableOpacity>

        {state.routes.slice(2).map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index + 2;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              preventDefault: false,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          let iconName: keyof typeof Ionicons.glyphMap = "ios-home";
          if (route.name === "Analytics") iconName = "ios-stats-chart";
          else if (route.name === "Profile") iconName = "ios-person";

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabItem}
              activeOpacity={0.7}
            >
              <Ionicons
                name={iconName}
                size={24}
                color={isFocused ? PRIMARY_RED : DARK_GRAY}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function App() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen
        name="Home"
        component={AnalyticsOverviewScreen}
        options={{ title: "Home" }}
      />
      <Tab.Screen
        name="Sessions"
        component={AnalyticsScreen}
        options={{ title: "Sessions" }}
      />
      <Tab.Screen
        name="Scanner"
        component={ScannerScreen}
        options={{ title: "Scanner" }}
      />
      <Tab.Screen
        name="Analytics"
        component={AnalyticsOverviewScreen}
        options={{ title: "Analytics" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Profile" }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingBottom: 0,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 70,
    backgroundColor: "white",
  },
  tabItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 70,
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