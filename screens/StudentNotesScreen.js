// screens/StudentNotesScreen.js
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import client from "../src/config/client";

const CARD = {
  backgroundColor: "#ffffff",
  borderRadius: 20,
  padding: 16,
  shadowColor: "#000",
  shadowOpacity: 0.06,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 6 },
  elevation: 2,
};

const StudentNotesScreen = () => {
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [aiNotes, setAiNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);

  const canGenerate = useMemo(() => {
    return !!pdfFile || !!topic.trim() || !!content.trim();
  }, [pdfFile, topic, content]);

  const pickPdf = async () => {
    try {
      setError("");

      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets?.[0];
      if (!file?.uri) {
        setError("PDF lama helin. Isku day mar kale.");
        return;
      }

      // some android devices don't return mimeType => fallback
      const picked = {
        uri: file.uri,
        name: file.name || "document.pdf",
        type: file.mimeType || "application/pdf",
        size: file.size,
      };

      setPdfFile(picked);

      // haddii topic madhan yahay, ku buuxi magaca pdf-ka
      if (!topic.trim()) setTopic((file.name || "PDF Notes").replace(".pdf", ""));
    } catch (e) {
      console.log("Pick PDF error:", e);
      setError("Document picker wuu fashilmay. Hubi permissions ama isku day mar kale.");
    }
  };

  const clearPdf = () => {
    setPdfFile(null);
  };

  const generateFromPdf = async () => {
    const form = new FormData();

    // IMPORTANT: React Native needs file object as below
    form.append("file", {
      uri: pdfFile.uri,
      name: pdfFile.name,
      type: pdfFile.type,
    });

    form.append("title", topic.trim() || pdfFile.name);
    form.append("level", "undergraduate");
    form.append("focus", "lecture notes and summary");

    // if your axios baseURL already includes /api
    // this will hit: /api/ai/notes/pdf
    const res = await client.post("/ai/notes/pdf", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data.notes;
  };

  const generateFromText = async () => {
    const res = await client.post("/ai/notes", {
      title: topic.trim(),
      description: (content.trim() || topic.trim()).trim(),
      level: "undergraduate",
      focus: "lecture notes and summary",
    });
    return res.data.notes;
  };

  const handleGenerateNotes = async () => {
    if (!canGenerate) {
      setError("Fadlan geli topic/qoraal ama dooro PDF.");
      return;
    }

    setError("");
    setAiNotes("");
    setLoading(true);

    try {
      let notes = "";

      if (pdfFile) {
        notes = await generateFromPdf();
      } else {
        notes = await generateFromText();
      }

      setAiNotes(notes);

      const title = (topic.trim() || pdfFile?.name || "Untitled").trim();
      setHistory((prev) => [
        {
          id: Date.now().toString(),
          topic: title,
          notes,
          preview: notes.slice(0, 140) + (notes.length > 140 ? "..." : ""),
          createdAt: new Date().toISOString(),
          source: pdfFile ? "PDF" : "TEXT",
        },
        ...prev,
      ]);
    } catch (err) {
      // Your screenshot shows HTML error => route missing
      const raw = err?.response?.data;
      console.log("Notes AI error:", raw || err.message);

      // If server returns HTML, raw could be string
      const msg =
        (typeof raw === "string" && raw.includes("Cannot POST"))
          ? "Backend route-ka PDF ma jiro (Cannot POST). Fadlan ku dar /api/ai/notes/pdf server-ka."
          : raw?.message || "Notes lama soo saarin. Isku day mar kale.";

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const openHistory = (item) => {
    Alert.alert(item.topic, item.notes?.slice(0, 3500) || "No notes");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f3f4f6" }}>
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 16, paddingTop: 48 }}
        contentContainerStyle={{ paddingBottom: 28 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 22, fontWeight: "800", color: "#111827" }}>
            Notes & Summary
          </Text>
          <Text style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
            Ku shaqee topic/qoraal ama PDF. AI ayaa kuu soo saaraya notes nadiif ah + summary.
          </Text>
        </View>

        {/* Input Card */}
        <View style={CARD}>
          {/* PDF Actions */}
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
              onPress={pickPdf}
              disabled={loading}
              style={{
                flex: 1,
                backgroundColor: "#111827",
                borderRadius: 999,
                paddingVertical: 11,
                alignItems: "center",
                opacity: loading ? 0.7 : 1,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>
                {pdfFile ? "Change PDF" : "Upload PDF"}
              </Text>
            </TouchableOpacity>

            {pdfFile ? (
              <TouchableOpacity
                onPress={clearPdf}
                disabled={loading}
                style={{
                  backgroundColor: "#ef4444",
                  borderRadius: 999,
                  paddingVertical: 11,
                  paddingHorizontal: 16,
                  alignItems: "center",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "800", fontSize: 13 }}>
                  Remove
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Selected PDF */}
          <View style={{ marginTop: 10 }}>
            {pdfFile ? (
              <View
                style={{
                  backgroundColor: "#f9fafb",
                  borderRadius: 14,
                  padding: 10,
                  borderWidth: 1,
                  borderColor: "#e5e7eb",
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: "700", color: "#111827" }}>
                  Selected PDF
                </Text>
                <Text style={{ fontSize: 12, color: "#374151", marginTop: 2 }}>
                  {pdfFile.name}
                  {pdfFile.size ? ` • ${(pdfFile.size / 1024 / 1024).toFixed(2)}MB` : ""}
                </Text>
              </View>
            ) : (
              <Text style={{ fontSize: 12, color: "#9ca3af" }}>
                No PDF selected. (Optional)
              </Text>
            )}
          </View>

          {/* Topic */}
          <Text style={{ fontSize: 12, fontWeight: "700", marginTop: 14, color: "#111827" }}>
            Topic
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "#e5e7eb",
              borderRadius: 14,
              paddingHorizontal: 12,
              paddingVertical: 10,
              marginTop: 6,
              backgroundColor: "#fff",
              color: "#111827",
            }}
            placeholder="e.g. Recursion in algorithms"
            placeholderTextColor="#9ca3af"
            value={topic}
            onChangeText={setTopic}
          />

          {/* Lecture text */}
          <Text style={{ fontSize: 12, fontWeight: "700", marginTop: 12, color: "#111827" }}>
            Lecture Text (Optional)
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "#e5e7eb",
              borderRadius: 14,
              paddingHorizontal: 12,
              paddingVertical: 10,
              minHeight: 120,
              marginTop: 6,
              textAlignVertical: "top",
              backgroundColor: "#fff",
              color: "#111827",
            }}
            multiline
            placeholder="Paste paragraphs, lecture notes..."
            placeholderTextColor="#9ca3af"
            value={content}
            onChangeText={setContent}
          />

          {/* Generate Button */}
          <TouchableOpacity
            style={{
              marginTop: 14,
              backgroundColor: canGenerate ? "#4f46e5" : "#a5b4fc",
              borderRadius: 999,
              paddingVertical: 12,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              opacity: loading ? 0.75 : 1,
            }}
            onPress={handleGenerateNotes}
            disabled={loading || !canGenerate}
          >
            {loading ? (
              <>
                <ActivityIndicator size="small" color="#ffffff" style={{ marginRight: 8 }} />
                <Text style={{ color: "#fff", fontWeight: "800", fontSize: 13 }}>
                  Generating...
                </Text>
              </>
            ) : (
              <Text style={{ color: "#fff", fontWeight: "800", fontSize: 13 }}>
                Generate Notes & Summary
              </Text>
            )}
          </TouchableOpacity>

          {/* Error */}
          {error ? (
            <View
              style={{
                marginTop: 10,
                backgroundColor: "#fef2f2",
                borderColor: "#fecaca",
                borderWidth: 1,
                padding: 10,
                borderRadius: 14,
              }}
            >
              <Text style={{ color: "#b91c1c", fontSize: 12, fontWeight: "700" }}>
                {error}
              </Text>
            </View>
          ) : null}
        </View>

        {/* AI Result */}
        <View style={[CARD, { marginTop: 14 }]}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ fontSize: 16, fontWeight: "900", color: "#111827" }}>
              AI Notes
            </Text>
            {aiNotes ? (
              <Text style={{ fontSize: 12, color: "#6b7280" }}>
                Source: {pdfFile ? "PDF" : "Text"}
              </Text>
            ) : null}
          </View>

          {aiNotes ? (
            <Text style={{ marginTop: 8, fontSize: 13, lineHeight: 20, color: "#111827" }}>
              {aiNotes}
            </Text>
          ) : (
            <Text style={{ marginTop: 8, fontSize: 13, color: "#9ca3af" }}>
              Notes-ka AI-ga ayaa halkan ka soo muuqan doona.
            </Text>
          )}
        </View>

        {/* History */}
        <View style={[CARD, { marginTop: 14 }]}>
          <Text style={{ fontSize: 16, fontWeight: "900", color: "#111827" }}>
            Recent Sessions
          </Text>

          {history.length === 0 ? (
            <Text style={{ marginTop: 8, fontSize: 13, color: "#9ca3af" }}>
              History-kan waa session kaliya. Haddii app-ka xirmo wuu lumi karaa ilaa backend kaydin lagu daro.
            </Text>
          ) : (
            <View style={{ marginTop: 8 }}>
              {history.slice(0, 8).map((h) => (
                <TouchableOpacity
                  key={h.id}
                  onPress={() => openHistory(h)}
                  style={{
                    paddingVertical: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: "#e5e7eb",
                  }}
                >
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: 13, fontWeight: "800", color: "#111827" }}>
                      {h.topic}
                    </Text>
                    <Text style={{ fontSize: 11, color: "#6b7280" }}>{h.source}</Text>
                  </View>
                  <Text style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                    {h.preview}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default StudentNotesScreen;
