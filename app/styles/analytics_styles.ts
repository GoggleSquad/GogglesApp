import { StyleSheet } from "react-native";

export const analyticsStyles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
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
  date: {
    fontWeight: "bold",
    marginBottom: 5,
    color: "#2196F3",
  },
});
