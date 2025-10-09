// screens/AnalyticsScreen.tsx
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { analyticsStyles } from "../styles/analytics_styles";

const AnalyticsScreen: React.FC = () => {
  const swimData = Array.from({ length: 50 }, (_, i) => ({
    id: i.toString(),
    date: `2025-09-${(i % 30) + 1}`,
    duration: `${30 + (i % 20)} mins`,
    distance: `${1000 + i * 10} m`,
    avgSpeed: `${1.2 + (i % 5) * 0.1} m/s`,
  }));

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={analyticsStyles.header}>Swim Analytics</Text>
      {swimData.map((swim) => (
        <View key={swim.id} style={analyticsStyles.card}>
          <Text style={analyticsStyles.date}>{swim.date}</Text>
          <Text>Duration: {swim.duration}</Text>
          <Text>Distance: {swim.distance}</Text>
          <Text>Avg Speed: {swim.avgSpeed}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default AnalyticsScreen;
