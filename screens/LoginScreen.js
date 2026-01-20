import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen({ navigation, route }) {
  const { login, loading } = useAuth();

  const [role, setRole] = useState("student"); // student | lecturer
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // ✅ Haddii uu ka yimid Register, buuxi email/password/role
  useEffect(() => {
    if (route?.params?.email || route?.params?.password || route?.params?.role) {
      setRole(route.params?.role ?? "student");
      setEmail(route.params?.email ?? "");
      setPassword(route.params?.password ?? "");
      setError("");
    }
  }, [route?.params]);

  const onLogin = async () => {
    setError("");
    try {
      await login({ email, password, role });

      // ✅ Login success → Direct Home
      navigation.reset({
        index: 0,
        routes: [{ name: role === "student" ? "StudentTabs" : "LecturerTabs" }],
      });
    } catch (e) {
      setError(e.message || "Login failed");
    }
  };

  const Chip = ({ label, active, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={{
        paddingVertical: 8,
        paddingHorizontal: 12,
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

  const switchRole = (r) => {
    setRole(r);
    setEmail("");
    setPassword("");
    setError("");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F6F7FB" }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 28 }}>
        <Text style={{ fontSize: 26, fontWeight: "900", color: "#111827" }}>
          Welcome back
        </Text>

        <Text style={{ marginTop: 14, fontWeight: "900", color: "#0F172A" }}>
          Login as
        </Text>
        <View style={{ flexDirection: "row", marginTop: 8 }}>
          <Chip
            label="Student"
            active={role === "student"}
            onPress={() => switchRole("student")}
          />
          <Chip
            label="Lecturer"
            active={role === "lecturer"}
            onPress={() => switchRole("lecturer")}
          />
        </View>

        <View
          style={{
            marginTop: 14,
            backgroundColor: "#FFFFFF",
            borderRadius: 24,
            padding: 16,
            borderWidth: 1,
            borderColor: "#EEF2FF",
          }}
        >
          <Text style={{ fontWeight: "900", color: "#0F172A" }}>Email</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#F8FAFC",
              borderRadius: 16,
              paddingHorizontal: 12,
              marginTop: 8,
              borderWidth: 1,
              borderColor: "#E5E7EB",
            }}
          >
            <Ionicons name="mail-outline" size={18} color="#64748B" />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="email"
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
              keyboardType="email-address"
              style={{ flex: 1, padding: 12, color: "#0F172A" }}
            />
          </View>

          <Text style={{ fontWeight: "900", color: "#0F172A", marginTop: 12 }}>
            Password
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#F8FAFC",
              borderRadius: 16,
              paddingHorizontal: 12,
              marginTop: 8,
              borderWidth: 1,
              borderColor: "#E5E7EB",
            }}
          >
            <Ionicons name="lock-closed-outline" size={18} color="#64748B" />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="password"
              placeholderTextColor="#94A3B8"
              secureTextEntry
              style={{ flex: 1, padding: 12, color: "#0F172A" }}
            />
          </View>

          {error ? (
            <Text style={{ marginTop: 10, color: "#B91C1C", fontWeight: "800" }}>
              {error}
            </Text>
          ) : null}

          <TouchableOpacity
            onPress={onLogin}
            activeOpacity={0.9}
            disabled={loading}
            style={{
              marginTop: 14,
              backgroundColor: "#5B21B6",
              borderRadius: 999,
              paddingVertical: 14,
              alignItems: "center",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: "#fff", fontWeight: "900" }}>Login</Text>
            )}
          </TouchableOpacity>

          {role === "student" ? (
            <TouchableOpacity
              onPress={() => navigation.navigate("Register")}
              activeOpacity={0.9}
              style={{ marginTop: 14, alignItems: "center" }}
            >
              <Text style={{ color: "#64748B" }}>
                No account?{" "}
                <Text style={{ color: "#5B21B6", fontWeight: "900" }}>
                  Create account
                </Text>
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
