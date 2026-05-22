import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import { useColorScheme } from "react-native";

import LoginScreen from "../screens/auth/LoginScreen";
import SignUpScreen from "../screens/auth/SignUpScreen";

import { lightTheme, darkTheme } from "../theme/theme";

const Stack = createStackNavigator();

export default function AuthStack() {
  const isDark = useColorScheme() === "dark";

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,

        gestureEnabled: true,

        cardStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />

      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
}
