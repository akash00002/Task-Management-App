import { DefaultTheme, DarkTheme } from "@react-navigation/native";

export const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#4F46E5",
    background: "#F9FAFB",
    card: "#FFFFFF",
    text: "#111827",
    border: "#E5E7EB",
    notification: "#EF4444",
  },
};

export const darkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: "#818CF8",
    background: "#111827",
    card: "#1F2937",
    text: "#F9FAFB",
    border: "#374151",
    notification: "#F87171",
  },
};
