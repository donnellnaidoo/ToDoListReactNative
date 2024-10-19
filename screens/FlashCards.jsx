import {
  Button,
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Alert,
  BackHandler,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../firebase-config";
import {
  addDoc,
  collection,
  deleteDoc,
  onSnapshot,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import IncompleteFlashCards from "../components/Incomplete";
import CompleteFlashCards from "../components/Complete";

const FlashCards = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
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
  useEffect(() => {
    const reference = collection(FIRESTORE_DB, "todos");

    const subscriber = onSnapshot(reference, {
      next: (snapshot) => {
        const todos = [];

        snapshot.docs.forEach((doc) => {
          todos.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        setFlashcards(todos);
      },
    });

    const backAction = () => {
      Alert.alert("Exit App?", "Are you sure you want to exit?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        { text: "YES", onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => {
      subscriber();
      backHandler.remove();
    };
  }, []);

  useEffect(() => {
    if (user) {
      navigation.setOptions({
        headerTitle: () => (
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <Text style={styles.headerTitle}>
              Welcome {user.firstName} {user.lastName}
            </Text>
          </TouchableOpacity>
        ),
      });
    }
  }, [user, navigation]);
  const toggleDone = async (id, currentDoneStatus) => {
    const ref = doc(FIRESTORE_DB, `todos/${id}`);
    await updateDoc(ref, { toDoDone: !currentDoneStatus });
  };

  const deleteItem = async (id) => {
    const ref = doc(FIRESTORE_DB, `todos/${id}`);
    await deleteDoc(ref);
  };

  return (
    <ScrollView style={styles.container}>
      <IncompleteFlashCards />
      <CompleteFlashCards />
    </ScrollView>
  );
};

export default FlashCards;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  card: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  tasks: {
    fontSize: 16,
    color: "#666",
  },
  dueDate: {
    fontSize: 14,
    color: "#888",
  },
  colorBox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginVertical: 5,
  },
  completeButton: {
    backgroundColor: "#FF385C",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  completeText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "green",
  },
});
