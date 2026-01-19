import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";

export default function StudentProfileScreen() {
  const {
    user,
    signOut,
    createStudentProfile,
    updateCurrentUserProfile,
  } = useAuth();

  const [name, setName] = useState("");
  const [gender, setGender] = useState("Male");
  const [studentId, setStudentId] = useState("");
  const [phone, setPhone] = useState("");

  // marka user isbedelo, form-ka update ha noqdo
  useEffect(() => {
    setName(user?.name || "");
    setGender(user?.gender || "Male");
    setStudentId(user?.studentId || "");
    setPhone(user?.phone || "");
  }, [user]);

  const saveProfile = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Fadlan geli magaca.");
      return;
    }

    await updateCurrentUserProfile({
      name: name.trim(),
      gender,
      studentId: studentId.trim(),
      phone: phone.trim(),
    });

    Alert.alert("Success", "Profile waa la kaydiyay.");
  };

  const createNewProfile = async () => {
    await createStudentProfile({
      name: "New Student",
      gender: "Male",
    });
  };

  const Chip = ({ label, active, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingVertical: 8,
        paddingHorizontal: 14,
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
        <Text style={{ fontSize: 22, fontWeight: "900", color: "#111827" }}>
          Profile
        </Text>
        <Text style={{ color: "#64748B", marginTop: 4 }}>
          Current user:{" "}
          <Text style={{ fontWeight: "900", color: "#111827" }}>
            {user?.name || "None"}
          </Text>
        </Text>

        <View
          style={{
            marginTop: 16,
            backgroundColor: "#fff",
            borderRadius: 24,
            padding: 16,
          }}
        >
          {/* New profile */}
          <TouchableOpacity
            onPress={createNewProfile}
            style={{
              backgroundColor: "#0F172A",
              borderRadius: 999,
              paddingVertical: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "900" }}>
              Create New Profile
            </Text>
          </TouchableOpacity>

          {/* Name */}
          <Text style={{ marginTop: 16, fontWeight: "900" }}>Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Student name"
            style={{
              marginTop: 8,
              borderWidth: 1,
              borderColor: "#E5E7EB",
              borderRadius: 16,
              padding: 12,
            }}
          />

          {/* Gender */}
          <Text style={{ marginTop: 12, fontWeight: "900" }}>Gender</Text>
          <View style={{ flexDirection: "row", marginTop: 8 }}>
            <Chip label="Male" active={gender === "Male"} onPress={() => setGender("Male")} />
            <Chip
              label="Female"
              active={gender === "Female"}
              onPress={() => setGender("Female")}
            />
          </View>

          {/* Student ID */}
          <Text style={{ marginTop: 12, fontWeight: "900" }}>Student ID</Text>
          <TextInput
            value={studentId}
            onChangeText={setStudentId}
            placeholder="ST-0001"
            style={{
              marginTop: 8,
              borderWidth: 1,
              borderColor: "#E5E7EB",
              borderRadius: 16,
              padding: 12,
            }}
          />

          {/* Phone */}
          <Text style={{ marginTop: 12, fontWeight: "900" }}>Phone</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="+252..."
            keyboardType="phone-pad"
            style={{
              marginTop: 8,
              borderWidth: 1,
              borderColor: "#E5E7EB",
              borderRadius: 16,
              padding: 12,
            }}
          />

          {/* Save */}
          <TouchableOpacity
            onPress={saveProfile}
            style={{
              marginTop: 16,
              backgroundColor: "#5B21B6",
              borderRadius: 999,
              paddingVertical: 14,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "900" }}>
              Save Profile
            </Text>
          </TouchableOpacity>

          {/* Logout */}
          <TouchableOpacity
            onPress={signOut}
            style={{
              marginTop: 12,
              backgroundColor: "#111827",
              borderRadius: 999,
              paddingVertical: 14,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "900" }}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
