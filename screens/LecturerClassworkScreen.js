import React from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LecturerClassworkScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F6F7FB" }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 22, fontWeight: "900", color: "#111827" }}>Classwork</Text>
        <Text style={{ marginTop: 6, color: "#64748B" }}>
          Here you will create assignments & quizzes (next step).
        </Text>

        <View style={{ marginTop: 16, backgroundColor: "#FFFFFF", borderRadius: 24, padding: 16, borderWidth: 1, borderColor: "#EEF2FF" }}>
          <Text style={{ fontWeight: "900", color: "#0F172A" }}>No classwork yet</Text>
          <Text style={{ marginTop: 8, color: "#64748B" }}>
            Add your first assignment and share with students.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
