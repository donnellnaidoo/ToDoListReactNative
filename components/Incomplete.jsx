import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../firebase-config";
import {
  collection,
  deleteDoc,
  onSnapshot,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const IncompleteFlashCards = () => {
  const [flashcards, setFlashcards] = useState([]);
  const navigation = useNavigation();
  const currentUser = FIREBASE_AUTH.currentUser;

  useEffect(() => {
    if (!currentUser) return;

    const reference = collection(FIRESTORE_DB, "todos");
    const q = query(reference, where("toDoUserID", "==", currentUser.uid));

    const subscriber = onSnapshot(q, {
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

    return () => subscriber();
  }, [currentUser]);

  const toggleDone = async (id, currentDoneStatus) => {
    const ref = doc(FIRESTORE_DB, `todos/${id}`);
    await updateDoc(ref, { toDoDone: !currentDoneStatus });
  };

  const deleteItem = async (id) => {
    const ref = doc(FIRESTORE_DB, `todos/${id}`);
    await deleteDoc(ref);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Incomplete</Text>
      <FlatList
        data={flashcards.filter((card) => !card.toDoDone)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("EditFlashCard", { flashcard: item })
            }
            style={[styles.card, { backgroundColor: item.toDoColor?.color }]}
          >
            <Text style={styles.title}>{item.toDoTitle?.title}</Text>
            <Text style={styles.dueDate}>Due: {item.toDoDueDate?.dueDate}</Text>
            <Text style={styles.tasks}>{item.toDoTasks?.tasks}</Text>
            <View
              style={[
                styles.colorBox,
                { backgroundColor: item.toDoColor?.color },
              ]}
            />
            <TouchableOpacity
              onPress={() => toggleDone(item.id, item.toDoDone)}
              style={styles.completeButton}
            >
              <Text style={styles.completeText}>Mark Complete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => deleteItem(item.id)}
              style={styles.delete}
            >
              <Ionicons name="trash-outline" size={30} />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default IncompleteFlashCards;

const styles = StyleSheet.create({
  container: {
    padding: 20,
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
    color: "#2BB673",
    fontWeight: "bold",
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
  delete: {
    position: "absolute",
    right: 0,
    padding: 15,
  },
});
