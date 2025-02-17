import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useRouter } from "expo-router";
import { auth } from "../firebaseConfig"; // Ensure correct import path
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";

export default function AuthScreen() {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Animation Values
  const rotateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${rotateY.value}deg` }],
  }));

  const textFixStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: rotateY.value === 180 ? -1 : 1 }], // Flip text back
  }));

  // Toggle Animation
  const toggleForm = () => {
    rotateY.value = withTiming(isRegistering ? 0 : 180, { duration: 500 });
    setIsRegistering(!isRegistering);
  };

  // **Login Function**
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        Alert.alert(
          "Email Verification Required",
          "Please check your email and verify your account before logging in."
        );
        return;
      }

      router.replace("/home"); // Redirect to home
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
    }
  };

  // **Register Function with Email Verification**
  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);

      Alert.alert(
        "Verification Email Sent",
        "A confirmation email has been sent to your inbox. Please verify before logging in."
      );

      setIsRegistering(false); // Redirect back to login after registration
    } catch (error: any) {
      Alert.alert("Registration Failed", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Animated.View style={[styles.card, animatedStyle]}>
            {!isRegistering ? (
              <Animated.View style={[styles.innerCard, textFixStyle]}>
                <Text style={styles.title}>Welcome {"\n"} to Safe Raabta</Text>

                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                />

                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                  <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.switchButton} onPress={toggleForm}>
                  <Text style={styles.switchButtonText}>Don't have an account? Register!</Text>
                </TouchableOpacity>
              </Animated.View>
            ) : (
              <Animated.View style={[styles.innerCard, textFixStyle]}>
                <Text style={styles.title}>Register for SafeRaabta</Text>

                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                />

                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />

                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                  <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.switchButton} onPress={toggleForm}>
                  <Text style={styles.switchButtonText}>Already have an account? Login!</Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </Animated.View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

// **Styles**
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2B4D66",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "99%",
    backgroundColor: "#D8F3DC",
    borderRadius: 12,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    transform: [{ perspective: 1000 }],
  },
  innerCard: {
    alignItems: "center",
    textAlign: "center",
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 16,
    color: "black",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "white",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#524A72",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    margin: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  switchButton: {
    backgroundColor: "#524A72",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    margin: 10,
  },
  switchButtonText: {
    color: "white",
    fontSize: 16,
  },
});

