import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";

export default function RegisterScreen({ navigation }) {
  const { register, login, loading } = useAuth();

  const [role, setRole] = useState("student"); // student | lecturer
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
      setError("Please fill required fields");
      return;
    }

    try {
      await register({
        name,
        email,
        password,
        studentId,
        gender,
        phone,
        role,
      });

      // AUTO LOGIN
      await login({ email, password, role });

      // DIRECT HOME
      navigation.reset({
        index: 0,
        routes: [
          {
            name: role === "student" ? "StudentTabs" : "LecturerTabs",
          },
        ],
      });
    } catch (e) {
      setError(e.message || "Register failed");
    }
  };

  const Chip = ({ label, active, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 999,
        backgroundColor: active ? "#5B21B6" : "#EEF2FF",
        marginRight: 8,
      }}
    >
      <Text style={{ color: active ? "#fff" : "#4338CA", fontWeight: "900" }}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F6F7FB" }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: "#5B21B6", fontWeight: "900" }}>← Back</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 26, fontWeight: "900", marginTop: 10 }}>
          Create account
        </Text>

        <View
          style={{
            marginTop: 16,
            backgroundColor: "#fff",
            borderRadius: 24,
            padding: 16,
          }}
        >
          <Text style={{ fontWeight: "900" }}>I am a:</Text>
          <View style={{ flexDirection: "row", marginVertical: 10 }}>
            <Chip
              label="Student"
              active={role === "student"}
              onPress={() => setRole("student")}
            />
            <Chip
              label="Lecturer"
              active={role === "lecturer"}
              onPress={() => setRole("lecturer")}
            />
          </View>

          <Text style={{ fontWeight: "900" }}>Full name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            style={{
              marginTop: 8,
              backgroundColor: "#F8FAFC",
              borderRadius: 16,
              padding: 12,
            }}
          />

          <Text style={{ fontWeight: "900", marginTop: 12 }}>Gender</Text>
          <View style={{ flexDirection: "row", marginTop: 8 }}>
            <Chip
              label="Male"
              active={gender === "Male"}
              onPress={() => setGender("Male")}
            />
            <Chip
              label="Female"
              active={gender === "Female"}
              onPress={() => setGender("Female")}
            />
          </View>

          {role === "student" && (
            <>
              <Text style={{ fontWeight: "900", marginTop: 12 }}>
                Student ID (optional)
              </Text>
              <TextInput
                value={studentId}
                onChangeText={setStudentId}
                placeholder="ST-0001"
                style={{
                  marginTop: 8,
                  backgroundColor: "#F8FAFC",
                  borderRadius: 16,
                  padding: 12,
                }}
              />
            </>
          )}

          <Text style={{ fontWeight: "900", marginTop: 12 }}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="email"
            autoCapitalize="none"
            style={{
              marginTop: 8,
              backgroundColor: "#F8FAFC",
              borderRadius: 16,
              padding: 12,
            }}
          />

          <Text style={{ fontWeight: "900", marginTop: 12 }}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="password"
            secureTextEntry
            style={{
              marginTop: 8,
              backgroundColor: "#F8FAFC",
              borderRadius: 16,
              padding: 12,
            }}
          />

          {error ? (
            <Text style={{ marginTop: 10, color: "#B91C1C", fontWeight: "800" }}>
              {error}
            </Text>
          ) : null}

          <TouchableOpacity
            onPress={onRegister}
            disabled={loading}
            style={{
              marginTop: 16,
              backgroundColor: "#5B21B6",
              borderRadius: 999,
              paddingVertical: 14,
              alignItems: "center",
            }}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: "#fff", fontWeight: "900" }}>Sign up</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
