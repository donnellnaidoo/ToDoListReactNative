import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

import FlashCards from "./screens/FlashCards";
import CreateFlashCard from "./screens/CreateFlashCard";
import EditFlashCard from "./screens/EditFlashCard";
import SignUpPage from "./screens/SignUpPage";
import LoginPage from "./screens/LoginPage";
import Profile from "./screens/Profile";

const logo = require("./assets/logo.png");

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginPage">
        <Stack.Screen name="LoginPage" component={LoginPage}  options={{headerShown: false}}/>
        <Stack.Screen name="SignUpPage" component={SignUpPage}  options={{headerShown: false}} />
        <Stack.Screen
          name="FlashCards"
          component={FlashCards}
          options={({ navigation }) => ({
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate("CreateFlashCard")}
              >
                <Text style={{ fontSize: 40 }}>+</Text>
              </TouchableOpacity>
            ),
            headerTitle: "FlashLearn",
            headerLeft: () => <Image style={styles.cornerLogo} source={logo} />,
          })}
        />
        <Stack.Screen
          name="CreateFlashCard"
          component={CreateFlashCard}
          options={{
            headerTitle: "Add new card",
          }}
        />
        <Stack.Screen
          name="EditFlashCard"
          component={EditFlashCard}
          options={{
            headerTitle: "Edit card",
          }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{
            headerTitle: "Profile",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  cornerLogo: {
    width: 50,
    height: 50,
    marginLeft: -5,
  },
});
