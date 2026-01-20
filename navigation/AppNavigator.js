import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../context/AuthContext";

// AUTH
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

// STUDENT
import StudentHomeScreen from "../screens/StudentHomeScreen";
import StudentCoursesScreen from "../screens/StudentCoursesScreen";
import StudentNotesScreen from "../screens/StudentNotesScreen";
import StudentProfileScreen from "../screens/StudentProfileScreen";
import LessonExplainScreen from "../screens/LessonExplainScreen";

// LECTURER
import LecturerHomeScreen from "../screens/LecturerHomeScreen";
import LecturerClassworkScreen from "../screens/LecturerClassworkScreen";
import LecturerProfileScreen from "../screens/LecturerProfileScreen";

const AuthStack = createNativeStackNavigator();
const RootStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStackNavigator() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <AuthStack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
    </AuthStack.Navigator>
  );
}

// ✅ Student tabs (3 + profile)
function StudentTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#5B21B6",
        tabBarInactiveTintColor: "#94A3B8",
        tabBarStyle: { backgroundColor: "#FFFFFF", borderTopColor: "#EEF2FF", height: 62, paddingBottom: 8 },
        tabBarIcon: ({ color, size }) => {
          let icon = "home-outline";
          if (route.name === "Home") icon = "home-outline";
          if (route.name === "Courses") icon = "book-outline";
          if (route.name === "Notes") icon = "document-text-outline";
          if (route.name === "Profile") icon = "person-outline";
          return <Ionicons name={icon} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={StudentHomeScreen} />
      <Tab.Screen name="Courses" component={StudentCoursesScreen} />
      <Tab.Screen name="Notes" component={StudentNotesScreen} />
      <Tab.Screen name="Profile" component={StudentProfileScreen} />
    </Tab.Navigator>
  );
}

// ✅ Lecturer tabs (Home, Classwork, Profile)
function LecturerTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#0F766E",
        tabBarInactiveTintColor: "#94A3B8",
        tabBarStyle: { backgroundColor: "#FFFFFF", borderTopColor: "#E5E7EB", height: 62, paddingBottom: 8 },
        tabBarIcon: ({ color, size }) => {
          let icon = "person-outline";
          if (route.name === "LHome") icon = "person-outline";
          if (route.name === "Classwork") icon = "clipboard-outline";
          if (route.name === "LProfile") icon = "settings-outline";
          return <Ionicons name={icon} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="LHome" component={LecturerHomeScreen} options={{ title: "Home" }} />
      <Tab.Screen name="Classwork" component={LecturerClassworkScreen} options={{ title: "Classwork" }} />
      <Tab.Screen name="LProfile" component={LecturerProfileScreen} options={{ title: "Profile" }} />
    </Tab.Navigator>
  );
}

function StudentStack() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="StudentTabs" component={StudentTabs} />
      <RootStack.Screen name="LessonExplain" component={LessonExplainScreen} />
    </RootStack.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();
  if (loading) return null;

  return (
    <NavigationContainer>
      {!user ? (
        <AuthStackNavigator />
      ) : user.role === "lecturer" ? (
        <LecturerTabs />
      ) : (
        <StudentStack />
      )}
    </NavigationContainer>
  );
}
