import React, { useMemo, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";

export default function StudentHomeScreen({ navigation }) {
  const { user } = useAuth();
  const [q, setQ] = useState("");

  const displayName = user?.name || "Student";

  const cards = useMemo(
    () => [
      { title: "AI Lesson", desc: "Select lesson & get AI explain", go: () => navigation.navigate("Courses") },
      { title: "AI Notes", desc: "Generate summaries & notes", go: () => navigation.navigate("Notes") },
      { title: "Profile", desc: "Update your info", go: () => navigation.navigate("Profile") },
    ],
    [navigation]
  );

  const onSearch = () => {
    const text = (q || "").trim();
    if (!text) return;
    navigation.navigate("Courses", { q: text });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F6F7FB" }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 28 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View>
            <Text style={{ color: "#64748B", fontWeight: "700" }}>Welcome</Text>
            <Text style={{ fontSize: 22, fontWeight: "900", color: "#111827" }}>Hi {displayName} 👋</Text>
          </View>
          <View style={{ height: 46, width: 46, borderRadius: 16, backgroundColor: "#EEF2FF", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#E5E7EB" }}>
            <Text style={{ fontWeight: "900", color: "#5B21B6" }}>{displayName?.[0]?.toUpperCase() || "S"}</Text>
          </View>
        </View>

        {/* Search */}
        <View style={{ marginTop: 14, backgroundColor: "#FFFFFF", borderRadius: 18, padding: 12, borderWidth: 1, borderColor: "#EEF2FF" }}>
          <Text style={{ fontWeight: "900", color: "#0F172A" }}>Search</Text>
          <TextInput
            value={q}
            onChangeText={setQ}
            onSubmitEditing={onSearch}
            returnKeyType="search"
            placeholder="Search lesson (Python, SQL, Web...)"
            placeholderTextColor="#94A3B8"
            style={{ marginTop: 8, backgroundColor: "#F8FAFC", borderRadius: 14, padding: 12, borderWidth: 1, borderColor: "#E5E7EB", color: "#0F172A" }}
          />
          <TouchableOpacity onPress={onSearch} activeOpacity={0.9}
            style={{ marginTop: 10, backgroundColor: "#5B21B6", borderRadius: 999, paddingVertical: 12, alignItems: "center" }}>
            <Text style={{ color: "#fff", fontWeight: "900" }}>Search</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Cards */}
        <Text style={{ marginTop: 18, fontSize: 16, fontWeight: "900", color: "#0F172A" }}>Quick Actions</Text>
        <View style={{ marginTop: 10, gap: 10 }}>
          {cards.map((c) => (
            <TouchableOpacity key={c.title} onPress={c.go} activeOpacity={0.9}
              style={{ backgroundColor: "#FFFFFF", borderRadius: 22, padding: 14, borderWidth: 1, borderColor: "#EEF2FF" }}>
              <Text style={{ fontWeight: "900", color: "#0F172A", fontSize: 15 }}>{c.title}</Text>
              <Text style={{ marginTop: 6, color: "#64748B" }}>{c.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Feature Banner */}
        <View style={{ marginTop: 18, backgroundColor: "#0B2A5B", borderRadius: 26, padding: 16 }}>
          <Text style={{ color: "#C7D2FE", fontWeight: "800" }}>Featured</Text>
          <Text style={{ marginTop: 6, color: "#fff", fontWeight: "900", fontSize: 16 }}>
            Smart Student AI Tutor
          </Text>
          <Text style={{ marginTop: 6, color: "#D1D5DB" }}>
            Learn lessons with AI + generate notes + practice.
          </Text>

          <TouchableOpacity onPress={() => navigation.navigate("Courses")} activeOpacity={0.9}
            style={{ marginTop: 12, backgroundColor: "#5B21B6", borderRadius: 999, paddingVertical: 12, alignItems: "center" }}>
            <Text style={{ color: "#fff", fontWeight: "900" }}>Start Learning</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
