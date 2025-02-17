import React, { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Alert } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";

type RootStackParamList = {
  Signup: undefined;
  Home: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, "Signup">;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "Logged in successfully!");
      navigation.replace("Home");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome to Safe Raabta</Text>
        <TextInput
          label="Username"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        <Button mode="contained" onPress={handleLogin} loading={loading} style={styles.button}>
          Login
        </Button>
        <Text onPress={() => navigation.navigate("Signup")} style={styles.link}>
          Need an account? Register
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2C5173",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#DDF5D8",
    padding: 20,
    width: "85%",
    borderRadius: 10,
    alignItems: "center",
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
  },
  input: {
    width: "100%",
    marginBottom: 15,
    backgroundColor: "white",
  },
  button: {
    width: "100%",
    backgroundColor: "#5C5470",
  },
  link: {
    marginTop: 10,
    color: "#1E88E5",
  },
});

export default LoginScreen;
