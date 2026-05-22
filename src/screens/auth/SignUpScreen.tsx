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

import { signUp } from "../../features/auth/authThunks";

import { AppDispatch, RootState } from "../../app/store";

export default function SignUpScreen({ navigation }: any) {
  const dispatch = useDispatch<AppDispatch>();

  const { loading, error } = useSelector((s: RootState) => s.auth);

  const { colors } = useTheme();

  const isDark = useColorScheme() === "dark";

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirm, setConfirm] = useState("");

  const handleSignUp = () => {
    if (!email || !password || !confirm) {
      return Alert.alert("Missing Fields", "Please fill in all fields");
    }

    if (password !== confirm) {
      return Alert.alert("Password Error", "Passwords do not match");
    }

    if (password.length < 6) {
      return Alert.alert(
        "Weak Password",
        "Password must be at least 6 characters",
      );
    }

    dispatch(signUp(email, password));
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
              ✨
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
            Create Account
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color: colors.muted,
              },
            ]}
          >
            Start managing your tasks smarter
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
              placeholder="Create a password"
              placeholderTextColor={colors.secondaryText}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {/* Confirm Password */}
          <View style={styles.inputWrapper}>
            <Text
              style={[
                styles.label,
                {
                  color: colors.text,
                },
              ]}
            >
              Confirm Password
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
              placeholder="Confirm your password"
              placeholderTextColor={colors.secondaryText}
              value={confirm}
              onChangeText={setConfirm}
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

          {/* Sign Up Button */}
          <TouchableOpacity
            activeOpacity={0.9}
            style={[
              styles.button,
              {
                backgroundColor: colors.primary,
              },
            ]}
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Create Account</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate("Login")}
        >
          <Text
            style={[
              styles.footerText,
              {
                color: colors.muted,
              },
            ]}
          >
            Already have an account?{" "}
            <Text
              style={[
                styles.footerLink,
                {
                  color: colors.primary,
                },
              ]}
            >
              Login
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
