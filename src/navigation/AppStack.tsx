import React, { lazy, Suspense } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  useColorScheme,
} from "react-native";

import { lightTheme, darkTheme } from "../theme/theme";

const TaskListScreen = lazy(() => import("../screens/tasks/TaskListScreen"));

const TaskFormScreen = lazy(() => import("../screens/tasks/TaskFormScreen"));

const Stack = createStackNavigator();

const Fallback = () => {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <View
      style={[
        styles.loaderContainer,
        {
          backgroundColor: theme.colors.background,
        },
      ]}
    >
      <View
        style={[
          styles.loaderCard,
          {
            backgroundColor: theme.colors.card,
            shadowColor: theme.colors.shadow,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />

        <Text
          style={[
            styles.loadingTitle,
            {
              color: theme.colors.text,
            },
          ]}
        >
          Loading...
        </Text>

        <Text
          style={[
            styles.loadingSubtitle,
            {
              color: theme.colors.muted,
            },
          ]}
        >
          Preparing your workspace
        </Text>
      </View>
    </View>
  );
};

export default function AppStack() {
  const scheme = useColorScheme();

  const isDark = scheme === "dark";

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.card,

          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },

        headerTintColor: theme.colors.text,

        headerTitleStyle: {
          fontSize: 22,
          fontWeight: "700",
        },

        headerTitleAlign: "center",

        cardStyle: {
          backgroundColor: theme.colors.background,
        },

        gestureEnabled: true,

        presentation: "card",
      }}
    >
      <Stack.Screen
        name="TaskList"
        options={{
          title: "My Tasks",
        }}
      >
        {(props) => (
          <Suspense fallback={<Fallback />}>
            <TaskListScreen {...props} />
          </Suspense>
        )}
      </Stack.Screen>

      <Stack.Screen
        name="TaskForm"
        options={{
          title: "Task Details",
        }}
      >
        {(props) => (
          <Suspense fallback={<Fallback />}>
            <TaskFormScreen {...props} />
          </Suspense>
        )}
      </Stack.Screen>
    </Stack.Navigator>
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

    paddingVertical: 40,
    paddingHorizontal: 24,

    borderRadius: 28,

    alignItems: "center",

    borderWidth: 1,

    shadowOffset: {
      width: 0,
      height: 6,
    },

    shadowOpacity: 0.1,
    shadowRadius: 12,

    elevation: 6,
  },

  loadingTitle: {
    marginTop: 18,
    fontSize: 18,
    fontWeight: "700",
  },

  loadingSubtitle: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "500",
  },
});
