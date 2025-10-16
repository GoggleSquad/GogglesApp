// screens/AnalyticsScreen.tsx
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { analyticsStyles } from "../styles/analytics_styles";

interface SwimData {
  id: string;
  date: string;
  duration: string;
  distance: string;
  avgSpeed: string;
}

const AnalyticsScreen: React.FC = () => {
  const [swimData, setSwimData] = useState<SwimData[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Placeholder: Fetch data once backend is ready
  useEffect(() => {
    const fetchData = async () => {
      try {
        // This will be replaced by your SQLite fetch later
        // For now, it does nothing — just simulates loading real data
        const data: SwimData[] = []; // Replace with actual query results
        setSwimData(data);
      } catch (error) {
        console.error("Error loading swim data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (swimData.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={analyticsStyles.header}>Swim Analytics</Text>
        <Text>No swim data available yet.</Text>
      </View>
    );
  }

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
