import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";

export default function RegisterScreen({ navigation }) {
  const { register, loading } = useAuth();

  const [role, setRole] = useState("Student"); // Cusub: Student ama Lecturer
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [gender, setGender] = useState("Male");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onRegister = async () => {
    setError("");
    if (!name || !email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      // Waxaan u diraynaa xogta oo uu la socdo "role"
      await register({ name, email, password, studentId, gender, phone, role });
      
      Alert.alert("Success", "Account created successfully!");
      // Nadiifi textbox-yada kadib markuu save dhaho
      setName("");
      setEmail("");
      setPassword("");
      setStudentId("");
      setPhone("");
      
      // U dir Login si uu u galo asaga oo isticmaalaya xogtiisa gaarka ah
      navigation.navigate("Login");
    } catch (e) {
      setError(e.message || "Register failed");
    }
  };

  const Chip = ({ label, active, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={{
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 999,
        backgroundColor: active ? "#5B21B6" : "#EEF2FF",
        marginRight: 8,
      }}
    >
      <Text style={{ color: active ? "#fff" : "#4338CA", fontWeight: "900" }}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F6F7FB" }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 28 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.9}>
          <Text style={{ color: "#5B21B6", fontWeight: "900" }}>← Back</Text>
        </TouchableOpacity>

        <Text style={{ marginTop: 10, fontSize: 26, fontWeight: "900", color: "#111827" }}>Create account</Text>
        <Text style={{ marginTop: 6, color: "#64748B" }}>Register with your unique details.</Text>

        <View style={{ marginTop: 16, backgroundColor: "#FFFFFF", borderRadius: 24, padding: 16, borderWidth: 1, borderColor: "#EEF2FF" }}>
          
          {/* DOORASHADA ROLE-KA */}
          <Text style={{ fontWeight: "900", color: "#0F172A", marginBottom: 8 }}>I am a:</Text>
          <View style={{ flexDirection: "row", marginBottom: 16 }}>
            <Chip label="Student" active={role === "Student"} onPress={() => setRole("Student")} />
            <Chip label="Lecturer" active={role === "Lecturer"} onPress={() => setRole("Lecturer")} />
          </View>

          <Text style={{ fontWeight: "900", color: "#0F172A" }}>Full name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor="#94A3B8"
            style={{ marginTop: 8, backgroundColor: "#F8FAFC", borderRadius: 16, padding: 12, borderWidth: 1, borderColor: "#E5E7EB", color: "#0F172A" }}
          />

          <Text style={{ fontWeight: "900", color: "#0F172A", marginTop: 12 }}>Gender</Text>
          <View style={{ flexDirection: "row", marginTop: 8 }}>
            <Chip label="Male" active={gender === "Male"} onPress={() => setGender("Male")} />
            <Chip label="Female" active={gender === "Female"} onPress={() => setGender("Female")} />
          </View>

          {/* KALIYA MUUJI STUDENT ID HADII UU STUDENT YAHAY */}
          {role === "Student" && (
            <>
              <Text style={{ fontWeight: "900", color: "#0F172A", marginTop: 12 }}>Student ID (optional)</Text>
              <TextInput
                value={studentId}
                onChangeText={setStudentId}
                placeholder="ST-0001"
                placeholderTextColor="#94A3B8"
                style={{ marginTop: 8, backgroundColor: "#F8FAFC", borderRadius: 16, padding: 12, borderWidth: 1, borderColor: "#E5E7EB", color: "#0F172A" }}
              />
            </>
          )}

          <Text style={{ fontWeight: "900", color: "#0F172A", marginTop: 12 }}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="example@email.com"
            placeholderTextColor="#94A3B8"
            autoCapitalize="none"
            keyboardType="email-address"
            style={{ marginTop: 8, backgroundColor: "#F8FAFC", borderRadius: 16, padding: 12, borderWidth: 1, borderColor: "#E5E7EB", color: "#0F172A" }}
          />

          <Text style={{ fontWeight: "900", color: "#0F172A", marginTop: 12 }}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Create your password"
            placeholderTextColor="#94A3B8"
            secureTextEntry
            style={{ marginTop: 8, backgroundColor: "#F8FAFC", borderRadius: 16, padding: 12, borderWidth: 1, borderColor: "#E5E7EB", color: "#0F172A" }}
          />

          {error ? (
            <Text style={{ marginTop: 10, color: "#B91C1C", fontWeight: "800" }}>{error}</Text>
          ) : null}

          <TouchableOpacity
            onPress={onRegister}
            activeOpacity={0.9}
            disabled={loading}
            style={{
              marginTop: 16,
              backgroundColor: "#5B21B6",
              borderRadius: 999,
              paddingVertical: 14,
              alignItems: "center",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "#fff", fontWeight: "900" }}>Sign up</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Login")} activeOpacity={0.9} style={{ marginTop: 14, alignItems: "center" }}>
            <Text style={{ color: "#64748B" }}>
              Already have account? <Text style={{ color: "#5B21B6", fontWeight: "900" }}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}