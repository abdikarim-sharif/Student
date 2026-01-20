import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";

export default function LecturerProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F6F7FB" }}>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 22, fontWeight: "900", color: "#111827" }}>Lecturer Profile</Text>
        <Text style={{ marginTop: 6, color: "#64748B" }}>Your account details</Text>

        <View style={{ marginTop: 16, backgroundColor: "#FFFFFF", borderRadius: 24, padding: 16, borderWidth: 1, borderColor: "#EEF2FF" }}>
          <Text style={{ fontWeight: "900", color: "#0F172A" }}>Name</Text>
          <Text style={{ marginTop: 4, color: "#64748B" }}>{user?.name}</Text>

          <Text style={{ marginTop: 12, fontWeight: "900", color: "#0F172A" }}>Email</Text>
          <Text style={{ marginTop: 4, color: "#64748B" }}>{user?.email}</Text>

          <Text style={{ marginTop: 12, fontWeight: "900", color: "#0F172A" }}>Department</Text>
          <Text style={{ marginTop: 4, color: "#64748B" }}>{user?.department || "N/A"}</Text>

          <TouchableOpacity
            onPress={logout}
            activeOpacity={0.9}
            style={{ marginTop: 16, backgroundColor: "#0F172A", borderRadius: 999, paddingVertical: 14, alignItems: "center" }}
          >
            <Text style={{ color: "#fff", fontWeight: "900" }}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
