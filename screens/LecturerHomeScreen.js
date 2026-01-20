import React from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";

export default function LecturerHomeScreen() {
  const { user } = useAuth();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F6F7FB" }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 22, fontWeight: "900", color: "#111827" }}>
          Welcome, {user?.name || "Lecturer"}
        </Text>
        <Text style={{ marginTop: 6, color: "#64748B" }}>
          Manage classwork, assessments, and students.
        </Text>

        <View style={{ marginTop: 16, backgroundColor: "#0F766E", borderRadius: 24, padding: 16 }}>
          <Text style={{ color: "#D1FAE5", fontWeight: "800" }}>Quick Overview</Text>
          <Text style={{ marginTop: 8, color: "#fff", fontWeight: "900" }}>• Create Assignments</Text>
          <Text style={{ marginTop: 6, color: "#fff", fontWeight: "900" }}>• Auto-grade Submissions</Text>
          <Text style={{ marginTop: 6, color: "#fff", fontWeight: "900" }}>• Review Student Progress</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
