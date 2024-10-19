import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../firebase-config";
import { addDoc, collection, doc } from "firebase/firestore";

const CreateFlashCard = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [tasks, setTasks] = useState("");
  const [color, setColor] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [done, setDone] = useState(false);

  const colors = [
    {
      id: 1,
      color: "#BAFFC9",
    },
    {
      id: 2,
      color: "#BAE1FF",
    },
    {
      id: 3,
      color: "#FFFFBA",
    },
    {
      id: 4,
      color: "#CECCE4",
    },
    {
      id: 5,
      color: "#FFB3BA",
    },
  ];

  const addFlashCard = async () => {
    if (!title.trim()) {
      alert("Please enter a title.");
      return;
    }
    if (!tasks.trim()) {
      alert("Please enter tasks.");
      return;
    }
    if (!color) {
      alert("Please select a card color.");
      return;
    }
    if (!dueDate.trim()) {
      alert("Please enter a due date.");
      return;
    }

    const userID = FIREBASE_AUTH.currentUser.uid;

    const doc = addDoc(collection(FIRESTORE_DB, "todos"), {
      toDoTitle: { title },
      toDoTasks: { tasks },
      toDoColor: { color },
      toDoDueDate: { dueDate },
      toDoDone: done,
      toDoUserID: userID,
    });
    setTitle(""), setTasks(""), setColor(""), setDueDate(""), setDone("");
    navigation.goBack();
  };
  return (
    <View style={styles.main}>
      <View style={styles.FormContainer}>
        <View style={styles.flashTitle}>
          <Text style={styles.Label}>Title:</Text>
          <TextInput
            value={title}
            style={styles.TextInput}
            placeholder="FlashCard Title"
            onChangeText={(text) => setTitle(text)}
          />
        </View>
        <View style={styles.flashTasks}>
          <Text style={styles.Label}>Tasks:</Text>
          <TextInput
            value={tasks}
            style={[styles.TextInput, { height: 100 }]}
            placeholder="Enter the tasks"
            onChangeText={(text) => setTasks(text)}
            multiline={true}
            numberOfLines={4}
          />
        </View>
        <View style={styles.flashColors}>
          <Text style={styles.Label}>Choose a card color:</Text>
          <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={colors}
            renderItem={({ item }) => (
              <View style={styles.colorContainer}>
                <TouchableOpacity
                  style={[styles.colorPicker, { backgroundColor: item.color }]}
                  onPress={() => setColor(item.color)}
                />
              </View>
            )}
          />
        </View>
        <View style={styles.flashTaskDue}>
          <Text style={styles.Label}>Due Date:</Text>
          <TextInput
            value={dueDate}
            style={styles.TextInput}
            placeholder="Enter the due date"
            onChangeText={(text) => setDueDate(text)}
          />
        </View>

        <TouchableOpacity onPress={addFlashCard} style={styles.saveButton}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreateFlashCard;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "white",
  },
  FormContainer: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  flashTitle: {
    marginBottom: 20,
  },
  flashTasks: {
    marginBottom: 20,
  },
  flashColors: {
    marginBottom: 20,
  },
  flashTaskDue: {
    marginBottom: 20,
  },
  Label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 5,
  },
  TextInput: {
    height: 50,
    borderColor: "#dddddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  colorContainer: {
    padding: 10,
  },
  colorPicker: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 2,
    borderColor: "transparent",
    overflow: "hidden",
  },
  saveButton: {
    backgroundColor: "#FF385C",
    width: "80%",
    height: 50,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 8,
    elevation: 2,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});
