import { Text, View, StyleSheet } from "react-native";

export default function CollectionScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Bourbon Collection</Text>
      <Text style={styles.subtitle}>Start adding your favorite bourbons!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
});
