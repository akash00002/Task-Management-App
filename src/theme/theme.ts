import { DefaultTheme, DarkTheme } from "@react-navigation/native";

export const lightTheme = {
  ...DefaultTheme,

  colors: {
    ...DefaultTheme.colors,

    primary: "#6366F1",

    background: "#F3F4F6",

    card: "#FFFFFF",

    text: "#111827",

    border: "#E5E7EB",

    notification: "#EF4444",

    success: "#10B981",

    warning: "#F59E0B",

    danger: "#EF4444",

    muted: "#6B7280",

    secondaryText: "#9CA3AF",

    badgeBg: "#EEF2FF",

    shadow: "rgba(0,0,0,0.08)",
  },
};

export const darkTheme = {
  ...DarkTheme,

  colors: {
    ...DarkTheme.colors,

    primary: "#818CF8",

    background: "#0F172A",

    card: "#1E293B",

    text: "#F8FAFC",

    border: "#334155",

    notification: "#F87171",

    success: "#34D399",

    warning: "#FBBF24",

    danger: "#F87171",

    muted: "#94A3B8",

    secondaryText: "#64748B",

    badgeBg: "#312E81",

    shadow: "rgba(0,0,0,0.25)",
  },
};
