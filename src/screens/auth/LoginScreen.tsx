import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useColorScheme,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";

import { useTheme } from "@react-navigation/native";

import { login } from "../../features/auth/authThunks";

import { AppDispatch, RootState } from "../../app/store";

export default function LoginScreen({ navigation }: any) {
  const dispatch = useDispatch<AppDispatch>();

  const { loading, error } = useSelector((s: RootState) => s.auth);

  const { colors } = useTheme();

  const isDark = useColorScheme() === "dark";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      return Alert.alert("Missing Fields", "Please fill in all fields");
    }

    dispatch(login(email, password));
  };

  return (
    <KeyboardAvoidingView
      style={[
        styles.flex,
        {
          backgroundColor: colors.background,
        },
      ]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View
            style={[
              styles.logoContainer,
              {
                backgroundColor: `${colors.primary}15`,
              },
            ]}
          >
            <Text
              style={[
                styles.logoText,
                {
                  color: colors.primary,
                },
              ]}
            >
              ✓
            </Text>
          </View>

          <Text
            style={[
              styles.title,
              {
                color: colors.text,
              },
            ]}
          >
            Welcome Back
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color: colors.muted,
              },
            ]}
          >
            Sign in to continue managing your tasks
          </Text>
        </View>

        {/* Form Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              shadowColor: colors.shadow,
            },
          ]}
        >
          {/* Email */}
          <View style={styles.inputWrapper}>
            <Text
              style={[
                styles.label,
                {
                  color: colors.text,
                },
              ]}
            >
              Email
            </Text>

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? `${colors.border}40` : "#FFFFFF",
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder="Enter your email"
              placeholderTextColor={colors.secondaryText}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password */}
          <View style={styles.inputWrapper}>
            <Text
              style={[
                styles.label,
                {
                  color: colors.text,
                },
              ]}
            >
              Password
            </Text>

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? `${colors.border}40` : "#FFFFFF",
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder="Enter your password"
              placeholderTextColor={colors.secondaryText}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {/* Error */}
          {!!error && (
            <View
              style={[
                styles.errorContainer,
                {
                  backgroundColor: `${colors.danger}15`,
                },
              ]}
            >
              <Text
                style={[
                  styles.errorText,
                  {
                    color: colors.danger,
                  },
                ]}
              >
                {error}
              </Text>
            </View>
          )}

          {/* Login Button */}
          <TouchableOpacity
            activeOpacity={0.9}
            style={[
              styles.button,
              {
                backgroundColor: colors.primary,
              },
            ]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate("SignUp")}
        >
          <Text
            style={[
              styles.footerText,
              {
                color: colors.muted,
              },
            ]}
          >
            Don’t have an account?{" "}
            <Text
              style={[
                styles.footerLink,
                {
                  color: colors.primary,
                },
              ]}
            >
              Sign Up
            </Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },

  header: {
    marginBottom: 36,
  },

  logoContainer: {
    width: 68,
    height: 68,

    borderRadius: 22,

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 24,
  },

  logoText: {
    fontSize: 30,
    fontWeight: "800",
  },

  title: {
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -1,
  },

  subtitle: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "500",
  },

  card: {
    borderRadius: 28,
    borderWidth: 1,

    padding: 22,

    shadowOffset: {
      width: 0,
      height: 8,
    },

    shadowOpacity: 0.08,
    shadowRadius: 16,

    elevation: 8,
  },

  inputWrapper: {
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 10,
  },

  input: {
    borderWidth: 1,
    borderRadius: 18,

    paddingHorizontal: 16,
    paddingVertical: 16,

    fontSize: 16,
    fontWeight: "500",
  },

  errorContainer: {
    paddingVertical: 12,
    paddingHorizontal: 14,

    borderRadius: 14,

    marginBottom: 18,
  },

  errorText: {
    fontSize: 14,
    fontWeight: "600",
  },

  button: {
    height: 58,

    borderRadius: 18,

    alignItems: "center",
    justifyContent: "center",

    marginTop: 8,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  footerText: {
    marginTop: 28,

    textAlign: "center",

    fontSize: 15,
    fontWeight: "500",
  },

  footerLink: {
    fontWeight: "700",
  },
});
