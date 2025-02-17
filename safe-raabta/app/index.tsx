import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth"; // Import User type
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null); // Ensure correct type
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // No more TypeScript error
      setLoading(false);

      if (user) {
        router.replace("/home"); // Redirect to home if logged in
      } else {
        router.replace("/LoginScreen"); // Redirect to login if not authenticated
      }
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return null; // Prevent unnecessary rendering
}
