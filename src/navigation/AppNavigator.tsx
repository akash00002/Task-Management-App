import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { View, ActivityIndicator } from "react-native";
import { auth } from "../config/firebase";
import { RootState } from "../app/store";
import { setUser, clearUser } from "../features/auth/authSlice";
import AuthStack from "./AuthStack";
import AppStack from "./AppStack";
import { lightTheme, darkTheme } from "../theme/theme";
import { useColorScheme } from "react-native";

export default function AppNavigator() {
  const dispatch = useDispatch();
  const userId = useSelector((s: RootState) => s.auth.userId);
  const scheme = useColorScheme();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user?.uid ?? "no user");
      if (user) {
        dispatch(setUser({ userId: user.uid, email: user.email! }));
      } else {
        dispatch(clearUser());
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={scheme === "dark" ? darkTheme : lightTheme}>
      {userId ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
