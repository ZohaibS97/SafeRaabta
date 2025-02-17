import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons"; // Importing icons

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Content Box (Behind Bottom Nav) */}
      <View style={styles.contentBox}>
        <Text style={styles.title}>Home Page</Text>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push("/storyUpload")}>
          <Feather name="camera" size={24} color="#524A72" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push("/home")}>
          <Feather name="home" size={24} color="#524A72" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push("/profile")}>
          <Feather name="user" size={24} color="#524A72" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2B4D66",
    justifyContent: "flex-end",
  },
  contentBox: {
    flex: 1,
    backgroundColor: "#D8F3DC",
    borderRadius: 12,
    margin: 15,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  bottomNav: {
    position: "absolute",
    bottom: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  navButton: {
    flex: 1,
    padding: 15,
    alignItems: "center",
  },
  navButtonText: {
    fontSize: 16,
    color: "#524A72",
    fontWeight: "bold",
  },
});
