// context/ThemeContext.js
import React, { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

const lightColors = {
  appBg: "#f3f4f6",
  screenBg: "#f3f4f6",
  cardBg: "#ffffff",
  textPrimary: "#111827",
  textSecondary: "#6b7280",
};

const darkColors = {
  appBg: "#020617",
  screenBg: "#020617",
  cardBg: "#0f172a",
  textPrimary: "#e5e7eb",
  textSecondary: "#9ca3af",
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  const colors = isDark ? darkColors : lightColors;

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
