import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../firebase-config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

const SignUpPage = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [seePassword, setSeePassword] = useState(true);

  const togglePassword = () => {
    setSeePassword(!seePassword);
  };

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword || !firstName || !lastName) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );

      const user = userCredential.user;
      console.log("User created:", user);

      await setDoc(doc(FIRESTORE_DB, "users", user.uid), {
        firstName: firstName,
        lastName: lastName,
        email: email,
        userID: user.uid,
      });

      navigation.replace("FlashCards");
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      Alert.alert("Sign-Up Failed", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          placeholder="Enter your first name"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={firstName}
          onChangeText={(text) => setFirstName(text)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Last Name</Text>
        <TextInput
          placeholder="Enter your last name"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={lastName}
          onChangeText={(text) => setLastName(text)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Enter your email"
          placeholderTextColor="#aaa"
          style={styles.input}
          keyboardType="email-address"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
      </View>
        <Text style={styles.label}>Password</Text>
      <View style={styles.PasswordInput}>
        <TextInput
          placeholder="Enter your password"
          placeholderTextColor="#aaa"
          value={password}
          secureTextEntry={seePassword}
          onChangeText={(text) => setPassword(text)}
        />
        <TouchableOpacity style={styles.eye} onPress={togglePassword}>
          <Ionicons size={20} name={seePassword ? "eye-outline" : "eye-off-outline"} />
        </TouchableOpacity>
      </View>
        <Text style={styles.label}>Confirm Your Password</Text>
      <View style={styles.PasswordInput}>
        <TextInput
          placeholder="Confirm your password"
          placeholderTextColor="#aaa"
          
          value={confirmPassword}
          secureTextEntry={seePassword}
          onChangeText={(text) => setConfirmPassword(text)}
        />
        <TouchableOpacity style={styles.eye} onPress={togglePassword}>
          <Ionicons size={20} name={seePassword ? "eye-outline" : "eye-off-outline"} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.createButton} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.signInButton}
        onPress={() => navigation.navigate("LoginPage")}
      >
        <Text style={styles.signInText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUpPage;

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 40,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
    justifyContent: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderColor: "#dddddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  createButton: {
    backgroundColor: "#FF385C",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  signInButton: {
    alignSelf: "center",
    marginTop: 20,
  },
  signInText: {
    color: "#FF385C",
    fontSize: 16,
    fontWeight: "600",
  },
  PasswordInput: {
    flexDirection: "row",
    height: 50,
    borderColor: "#dddddd",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  eye: {
    position: "absolute",
    right: 0,
    padding: 10,
  },
});
