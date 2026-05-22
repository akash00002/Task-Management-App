import React, { lazy, Suspense } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ActivityIndicator, View } from "react-native";

const LoginScreen = lazy(() => import("../screens/auth/LoginScreen"));
const SignUpScreen = lazy(() => import("../screens/auth/SignUpScreen"));

const Stack = createStackNavigator();

const Fallback = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <ActivityIndicator size="large" color="#4F46E5" />
  </View>
);

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login">
        {(props) => (
          <Suspense fallback={<Fallback />}>
            <LoginScreen {...props} />
          </Suspense>
        )}
      </Stack.Screen>
      <Stack.Screen name="SignUp">
        {(props) => (
          <Suspense fallback={<Fallback />}>
            <SignUpScreen {...props} />
          </Suspense>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
