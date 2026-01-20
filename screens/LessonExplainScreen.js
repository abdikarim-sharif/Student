import React, { useMemo, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import client from "../src/config/client";

export default function LessonExplainScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const lesson = route.params?.lesson;

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  // ✅ Language tags
  const languages = ["Somali", "English", "Arabic"];
  const levels = ["Beginner", "Intermediate", "Advanced"];

  const [lang, setLang] = useState("Somali");
  const [level, setLevel] = useState("Beginner");

  const prompt = useMemo(() => {
    if (!lesson) return "";
    return `
You are Smart Student AI Tutor.

Generate a FULL detailed lesson in ${lang}.
Difficulty level: ${level}.
Lesson Title: ${lesson.title}
Topics: ${(lesson.topics || []).join(", ")}

Make it very clear and student-friendly:
1) Overview (short)
2) Explanation of each topic (step-by-step)
3) Examples (code/examples if needed)
4) Common mistakes
5) Quick summary (bullet points)
6) 5 practice questions (with answers)
7) Mini quiz (3 questions)

Return as clean text with headings.
`.trim();
  }, [lesson, lang, level]);

  const generateLesson = async () => {
    setError("");
    setResult("");
    setLoading(true);
    try {
      // ✅ IMPORTANT: baseURL already has /api so DO NOT write /api here
      const res = await client.post("/ai/summary", { content: prompt });
      setResult(res.data.summary || res.data.notes || "Lesson generated.");
    } catch (e) {
      console.log("AI Explain error:", e?.response?.status, e?.response?.data || e.message);
      setError(e?.response?.data?.message || e.message || "AI error");
    } finally {
      setLoading(false);
    }
  };

  if (!lesson) {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>No lesson selected.</Text>
      </SafeAreaView>
    );
  }

  const Tag = ({ active, label, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={{
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 999,
        backgroundColor: active ? "#4F46E5" : "#EEF2FF",
        marginRight: 8,
        marginBottom: 8,
      }}
    >
      <Text style={{ color: active ? "#fff" : "#4338CA", fontWeight: "900", fontSize: 12 }}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F4F7FF" }}>
      <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 30 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.9}>
          <Text style={{ color: "#2563EB", fontWeight: "900" }}>← Back</Text>
        </TouchableOpacity>

        <View style={{ marginTop: 12, backgroundColor: "#0B2A5B", borderRadius: 26, padding: 16 }}>
          <Text style={{ color: "#C7D2FE", fontWeight: "800" }}>{lesson.level || "Lesson"}</Text>
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "900", marginTop: 6 }}>
            {lesson.title}
          </Text>
          <Text style={{ color: "#D1D5DB", marginTop: 8 }}>
            Topics: {(lesson.topics || []).join(", ")}
          </Text>
        </View>

        {/* ✅ Language tags */}
        <Text style={{ marginTop: 16, fontWeight: "900", color: "#0F172A" }}>Choose Language</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 8 }}>
          {languages.map((l) => (
            <Tag key={l} label={l} active={lang === l} onPress={() => setLang(l)} />
          ))}
        </View>

        {/* ✅ Level tags */}
        <Text style={{ marginTop: 10, fontWeight: "900", color: "#0F172A" }}>Difficulty</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 8 }}>
          {levels.map((lv) => (
            <Tag key={lv} label={lv} active={level === lv} onPress={() => setLevel(lv)} />
          ))}
        </View>

        <TouchableOpacity
          onPress={generateLesson}
          activeOpacity={0.9}
          disabled={loading}
          style={{
            marginTop: 14,
            backgroundColor: "#4F46E5",
            borderRadius: 999,
            paddingVertical: 12,
            alignItems: "center",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? <ActivityIndicator color="#fff" /> : null}
          <Text style={{ color: "#fff", fontWeight: "900" }}>
            {loading ? "Generating..." : "Generate Full AI Lesson"}
          </Text>
        </TouchableOpacity>

        {error ? (
          <Text style={{ marginTop: 12, color: "#B91C1C", fontWeight: "900" }}>{error}</Text>
        ) : null}

        {result ? (
          <View style={{ marginTop: 12, backgroundColor: "#fff", borderRadius: 18, padding: 12, borderWidth: 1, borderColor: "#E6ECFF" }}>
            <Text style={{ fontWeight: "900", color: "#0F172A" }}>AI Lesson</Text>
            <Text style={{ marginTop: 8, color: "#0F172A", lineHeight: 20 }}>{result}</Text>
          </View>
        ) : (
          <Text style={{ marginTop: 12, color: "#94A3B8" }}>
            Select language + level, then tap “Generate Full AI Lesson”.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
