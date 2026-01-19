// context/AuthContext.js
import React, { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ local users database (demo)
  const [usersDb, setUsersDb] = useState(() => [
    // STUDENT DEMO
    {
      _id: "s1",
      role: "student",
      name: "Alex Johnson",
      email: "student@test.com",
      password: "123456",
      studentId: "ST-0001",
      gender: "Male",
      phone: "0612345678",
    },
    // ✅ LECTURER DEMO
    {
      _id: "l1",
      role: "lecturer",
      name: "Dr. Ahmed Ali",
      email: "lecturer@test.com",
      password: "123456",
      lecturerId: "LEC-001",
      department: "Computer Science",
      phone: "0611111111",
    },
  ]);

  const register = async ({ name, email, password, studentId, gender, phone }) => {
    setLoading(true);
    try {
      const e = (email || "").trim().toLowerCase();
      const p = (password || "").trim();
      const n = (name || "").trim();

      if (!n || !e || !p) throw new Error("Name, Email and Password are required.");
      if (p.length < 4) throw new Error("Password must be at least 4 characters.");

      const exists = usersDb.some((u) => u.email.toLowerCase() === e);
      if (exists) throw new Error("This email is already registered. Please login.");

      const newUser = {
        _id: "s" + Date.now(),
        role: "student",
        name: n,
        email: e,
        password: p,
        studentId: (studentId || "ST-" + Math.floor(Math.random() * 9000 + 1000)).trim(),
        gender: gender || "Male",
        phone: (phone || "").trim(),
      };

      setUsersDb((prev) => [newUser, ...prev]);
      setUser({ ...newUser, password: undefined });
      return true;
    } finally {
      setLoading(false);
    }
  };

  const login = async ({ email, password, role = "student" }) => {
    setLoading(true);
    try {
      const e = (email || "").trim().toLowerCase();
      const p = (password || "").trim();
      if (!e || !p) throw new Error("Email and Password are required.");

      // ✅ Find by role + email
      const found = usersDb.find((u) => u.role === role && u.email.toLowerCase() === e);
      if (!found) {
        throw new Error(
          role === "lecturer"
            ? "Lecturer account not found."
            : "Student account not found. Please register first."
        );
      }
      if (found.password !== p) throw new Error("Wrong password.");

      setUser({ ...found, password: undefined });
      return true;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Create NEW student profile from Profile screen (local demo)
  const createStudentProfile = async ({
    name = "New Student",
    email,
    password = "123456",
    studentId,
    gender = "Male",
    phone = "",
  } = {}) => {
    setLoading(true);
    try {
      const n = (name || "").trim() || "New Student";
      const e = (email || `student${Date.now()}@test.com`).trim().toLowerCase();
      const p = (password || "123456").trim();

      const exists = usersDb.some((u) => u.email.toLowerCase() === e);
      if (exists) throw new Error("Email already exists. Use another email.");

      const newUser = {
        _id: "s" + Date.now(),
        role: "student",
        name: n,
        email: e,
        password: p,
        studentId: (studentId || "ST-" + Math.floor(Math.random() * 9000 + 1000)).trim(),
        gender,
        phone: (phone || "").trim(),
      };

      setUsersDb((prev) => [newUser, ...prev]);
      setUser({ ...newUser, password: undefined });
      return newUser;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update CURRENT logged-in user (sync usersDb + user)
  const updateCurrentUserProfile = async (updates = {}) => {
    setLoading(true);
    try {
      if (!user?._id) throw new Error("No logged in user.");

      // update usersDb (keep password inside usersDb)
      setUsersDb((prev) =>
        prev.map((u) => {
          if (u._id !== user._id) return u;
          return { ...u, ...updates };
        })
      );

      // update current user state (never store password here)
      setUser((prev) => ({ ...(prev || {}), ...updates }));
      return true;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => setUser(null);
  const signOut = () => setUser(null);

  const value = useMemo(
    () => ({
      user,
      setUser,
      loading,
      usersDb,
      register,
      login,
      logout,
      signOut,

      // ✅ NEW (Profile features)
      createStudentProfile,
      updateCurrentUserProfile,
    }),
    [user, loading, usersDb]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
