import React, { useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";

export default function StudentCoursesScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();

  // ✅ Lessons only (student selects lesson)
  const lessons = useMemo(
    () => [
      { id: "L1", title: "Introduction to Python", level: "Year 1", topics: ["Variables", "Loops", "Functions"] },
      { id: "L2", title: "Database Systems (SQL)", level: "Year 1", topics: ["Tables", "SELECT", "JOIN"] },
      { id: "L3", title: "Web Development", level: "Year 2", topics: ["HTML", "CSS", "JavaScript"] },
      { id: "L4", title: "Data Structures", level: "Year 2", topics: ["Arrays", "Stacks", "Queues", "Trees"] },
    ],
    []
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors?.appBg || "#F4F7FF" }}>
      <View style={{ paddingHorizontal: 18, paddingTop: 10, paddingBottom: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: "900", color: colors?.text || "#0F172A" }}>
          Select Lesson
        </Text>
        <Text style={{ fontSize: 12, color: colors?.mutedText || "#6B7280", marginTop: 4 }}>
          Choose a lesson and AI will explain it.
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 28 }}>
        {lessons.map((lesson) => (
          <TouchableOpacity
            key={lesson.id}
            activeOpacity={0.9}
            onPress={() => navigation.navigate("LessonExplain", { lesson })}
            style={{
              backgroundColor: colors?.card || "#FFF",
              borderRadius: 22,
              padding: 14,
              borderWidth: 1,
              borderColor: "#E6ECFF",
              marginBottom: 10,
            }}
          >
            <Text style={{ fontSize: 12, color: "#2563EB", fontWeight: "800" }}>{lesson.level}</Text>
            <Text style={{ fontSize: 16, fontWeight: "900", color: colors?.text || "#0F172A", marginTop: 4 }}>
              {lesson.title}
            </Text>
            <Text style={{ fontSize: 12, color: colors?.mutedText || "#64748B", marginTop: 6 }}>
              Topics: {(lesson.topics || []).join(", ")}
            </Text>

            <View
              style={{
                marginTop: 12,
                backgroundColor: "#4F46E5",
                borderRadius: 999,
                paddingVertical: 10,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "900" }}>AI Explain</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
