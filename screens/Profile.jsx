import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../firebase-config";
import { doc, getDoc, deleteDoc } from "firebase/firestore";

const Profile = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const userID = FIREBASE_AUTH.currentUser?.uid;

  useEffect(() => {
    const fetchUserData = async () => {
      if (userID) {
        const userDoc = doc(FIRESTORE_DB, "users", userID);
        const userSnap = await getDoc(userDoc);

        if (userSnap.exists()) {
          setUser(userSnap.data());
        } else {
          console.log("No such document!");
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, [userID]);

  const signOut = () => {
    FIREBASE_AUTH.signOut()
      .then(() => {
        navigation.navigate("LoginPage");
      })
      .catch((error) => {
        Alert.alert("Error", error.message);
      });
  };

  const deleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(FIRESTORE_DB, "users", userID));

              await FIREBASE_AUTH.currentUser.delete();

              navigation.navigate("LoginPage");
            } catch (error) {
              Alert.alert("Error", error.message);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#FF385C" />
      ) : (
        <View style={styles.profileContainer}>
          <Text style={styles.header}>User Profile</Text>
          <View style={styles.card}>
            <Text style={styles.label}>First Name:</Text>
            <Text style={styles.value}>{user.firstName}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.label}>Last Name:</Text>
            <Text style={styles.value}>{user.lastName}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{user.email}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.label}>User ID:</Text>
            <Text style={styles.value}>{userID}</Text>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={signOut}>
            <Text style={styles.editText}>Sign Out</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.editButton} onPress={deleteAccount}>
            <Text style={styles.editText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    padding: 20,
  },
  profileContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: "#eaeaea",
    borderRadius: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
  },
  value: {
    fontSize: 18,
    color: "#333",
  },
  editButton: {
    backgroundColor: "#FF385C",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  editText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
