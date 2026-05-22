import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";

import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  useColorScheme,
} from "react-native";

import { auth } from "../config/firebase";
import { RootState } from "../app/store";
import { setUser, clearUser } from "../features/auth/authSlice";

import AuthStack from "./AuthStack";
import AppStack from "./AppStack";

import { lightTheme, darkTheme } from "../theme/theme";

export default function AppNavigator() {
  const dispatch = useDispatch();

  const userId = useSelector((s: RootState) => s.auth.userId);

  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          setUser({
            userId: user.uid,
            email: user.email!,
          }),
        );
      } else {
        dispatch(clearUser());
      }

      setLoading(false);
    });

    return unsub;
  }, []);

  if (loading) {
    return (
      <View
        style={[
          styles.loaderContainer,
          {
            backgroundColor: isDark
              ? darkTheme.colors.background
              : lightTheme.colors.background,
          },
        ]}
      >
        <View
          style={[
            styles.loaderCard,
            {
              backgroundColor: isDark
                ? darkTheme.colors.card
                : lightTheme.colors.card,
            },
          ]}
        >
          <ActivityIndicator
            size="large"
            color={
              isDark ? darkTheme.colors.primary : lightTheme.colors.primary
            }
          />

          <Text
            style={[
              styles.loadingTitle,
              {
                color: isDark ? darkTheme.colors.text : lightTheme.colors.text,
              },
            ]}
          >
            Task Manager
          </Text>

          <Text
            style={[
              styles.loadingSubtitle,
              {
                color: isDark
                  ? darkTheme.colors.muted
                  : lightTheme.colors.muted,
              },
            ]}
          >
            Preparing your workspace...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <NavigationContainer theme={isDark ? darkTheme : lightTheme}>
      {userId ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  loaderCard: {
    width: "100%",
    borderRadius: 28,
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,

    elevation: 5,
  },

  loadingTitle: {
    marginTop: 18,
    fontSize: 22,
    fontWeight: "700",
  },

  loadingSubtitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "500",
  },
});
