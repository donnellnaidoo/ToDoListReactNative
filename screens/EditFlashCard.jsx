import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../firebase-config";
import { doc, updateDoc } from "firebase/firestore";

const EditFlashCard = ({ route, navigation }) => {
  const { flashcard } = route.params;
  const [title, setTitle] = useState(flashcard.toDoTitle?.title);
  const [tasks, setTasks] = useState(flashcard.toDoTasks?.tasks);
  const [color, setColor] = useState(flashcard.toDoColor?.color);
  const [dueDate, setDueDate] = useState(flashcard.toDoDueDate?.dueDate);
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
  const { id } = flashcard;

  const handleUpdate = async () => {
    const ref = doc(FIRESTORE_DB, `todos/${id}`);
    await updateDoc(ref, {
      toDoTitle: { title },
      toDoTasks: { tasks },
      toDoDueDate: { dueDate },
      toDoColor: { color },
    });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.Label}>Title:</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Flashcard Title"
        style={styles.input}
      />
      <Text style={styles.Label}>Tasks:</Text>
      <TextInput
        value={tasks}
        onChangeText={setTasks}
        placeholder="Tasks"
        style={[styles.input, { height: 100 }]}
        multiline={true}
        numberOfLines={4}
      />
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
      <Text style={styles.Label}>Due Date:</Text>
      <TextInput
        value={dueDate}
        onChangeText={setDueDate}
        placeholder="Due Date"
        style={styles.input}
      />
      <TouchableOpacity onPress={handleUpdate} style={styles.updateButton}>
        <Text style={styles.buttonText}>Update</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditFlashCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  input: {
    height: 50,
    borderColor: "#dddddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
    marginBottom: 20,
  },
  flashColors: {
    marginBottom: 20,
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
  Label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 5,
  },
  updateButton: {
    backgroundColor: "#FF385C",
    width: "80%",
    alignSelf: "center",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});
