// screens/analytics_overview_screen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { analyticsStyles } from "/Users/badhri/SeniorDesign/SampleBLE/app/styles/analytics_styles";

interface SwimData {
  id: string;
  date: string; // "YYYY-MM-DD"
  durationSec: number;
  distanceMeters: number;
  avgSpeed: number;
  laps: number;
}

const screenWidth = Math.max(320, Dimensions.get("window").width - 40);

// Linear regression helper
function linearRegression(x: number[], y: number[]) {
  if (x.length !== y.length || x.length === 0) return { m: 0, b: 0 };
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((a, b, i) => a + b * y[i], 0);
  const sumXX = x.reduce((a, b) => a + b * b, 0);
  const denom = n * sumXX - sumX * sumX;
  if (denom === 0) return { m: 0, b: y[y.length - 1] ?? 0 };
  const m = (n * sumXY - sumX * sumY) / denom;
  const b = (sumY - m * sumX) / n;
  return { m, b };
}

// Forecast helper
function forecast(values: number[], k: number) {
  const x = values.map((_, i) => i);
  const y = values;
  const { m, b } = linearRegression(x, y);
  const forecasts: number[] = [];
  for (let i = 0; i < k; i++) {
    const xi = values.length + i;
    forecasts.push(m * xi + b);
  }
  return forecasts;
}

const AnalyticsOverviewScreen: React.FC = () => {
  const [swimData, setSwimData] = useState<SwimData[]>([]);

  useEffect(() => {
    const data: SwimData[] = [
      { id: "1", date: "2025-09-01", durationSec: 1800, distanceMeters: 1200, avgSpeed: 1.2, laps: 24 },
      { id: "2", date: "2025-09-03", durationSec: 2000, distanceMeters: 1400, avgSpeed: 1.25, laps: 25 },
      { id: "3", date: "2025-09-05", durationSec: 2100, distanceMeters: 1500, avgSpeed: 1.28, laps: 26 },
      { id: "4", date: "2025-09-08", durationSec: 2200, distanceMeters: 1600, avgSpeed: 1.3, laps: 27 },
      { id: "5", date: "2025-09-10", durationSec: 2400, distanceMeters: 1750, avgSpeed: 1.33, laps: 28 },
    ];
    setSwimData(data);
  }, []);

  if (!swimData || swimData.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No swim data available.</Text>
      </View>
    );
  }

  const sorted = [...swimData].sort((a, b) => (a.date < b.date ? -1 : 1));

  const labels = sorted.map(s => {
    const d = new Date(s.date);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  });

  const timePerLap = sorted.map(s => s.durationSec / s.laps);

  // Forecast 5 future points
  const projectionCount = 5;
  const lapForecasts = forecast(timePerLap, projectionCount);

  // Generate future dates
  const lastHistoricalDate = new Date(sorted[sorted.length - 1].date);
  const projectionDates = Array.from({ length: projectionCount }, (_, i) => {
    const d = new Date(lastHistoricalDate);
    d.setDate(d.getDate() + i);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  });

  // Speed and distance datasets (historical only)
  const speedDataset = sorted.map(s => +s.avgSpeed.toFixed(2));
  const distanceDataset = sorted.map(s => s.distanceMeters);

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
    propsForDots: { r: "3" },
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={analyticsStyles.header}>Overall Analytics</Text>

      {/* Time per lap - Historical only */}
      <View style={analyticsStyles.card}>
        <Text style={{ fontWeight: "700", marginBottom: 8 }}>Time per Lap (s) - Historical</Text>
        <LineChart
          data={{
            labels,
            datasets: [
              {
                data: timePerLap,
                color: (opacity = 1) => `rgba(33,150,243,${opacity})`,
                strokeWidth: 2,
                withDots: true,
              },
            ],
          }}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={{ marginVertical: 8, borderRadius: 8 }}
        />
      </View>

      {/* Time per lap - Projection only */}
      <View style={analyticsStyles.card}>
        <Text style={{ fontWeight: "700", marginBottom: 8 }}>Time per Lap (s) - Projection</Text>
        <LineChart
          data={{
            labels: projectionDates,
            datasets: [
              {
                data: lapForecasts,
                color: (opacity = 1) => `rgba(255,0,0,${opacity})`,
                strokeWidth: 2,
                withDots: true,
              },
            ],
          }}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={{ marginVertical: 8, borderRadius: 8 }}
        />
      </View>

      {/* Speed */}
      <View style={analyticsStyles.card}>
        <Text style={{ fontWeight: "700", marginBottom: 8 }}>Average Speed (m/s)</Text>
        <LineChart
          data={{
            labels,
            datasets: [
              {
                data: speedDataset,
                color: (opacity = 1) => `rgba(33,150,243,${opacity})`,
                strokeWidth: 2,
                withDots: true,
              },
            ],
          }}
          width={screenWidth}
          height={220}
          chartConfig={{ ...chartConfig, decimalPlaces: 2 }}
          bezier
          style={{ marginVertical: 8, borderRadius: 8 }}
        />
      </View>

      {/* Distance */}
      <View style={analyticsStyles.card}>
        <Text style={{ fontWeight: "700", marginBottom: 8 }}>Distance (m)</Text>
        <LineChart
          data={{
            labels,
            datasets: [
              {
                data: distanceDataset,
                color: (opacity = 1) => `rgba(33,150,243,${opacity})`,
                strokeWidth: 2,
                withDots: true,
              },
            ],
          }}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={{ marginVertical: 8, borderRadius: 8 }}
        />
      </View>
    </ScrollView>
  );
};

export default AnalyticsOverviewScreen;