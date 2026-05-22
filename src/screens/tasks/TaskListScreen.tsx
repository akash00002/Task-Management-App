import React, { useEffect, useCallback } from "react";

import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  useColorScheme,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";

import { useTheme } from "@react-navigation/native";

import NetInfo from "@react-native-community/netinfo";

import { RootState, AppDispatch } from "../../app/store";

import {
  loadTasks,
  toggleTask,
  deleteTask,
} from "../../features/tasks/tasksThunks";

import { logout } from "../../features/auth/authThunks";

import { useNetworkSync } from "../../hooks/useNetworkSync";

import TaskItem from "../../components/TaskItem";

import { Task } from "../../types";

import { ENV } from "@env";

export default function TaskListScreen({ navigation }: any) {
  const dispatch = useDispatch<AppDispatch>();

  const { items } = useSelector((s: RootState) => s.tasks);

  const userId = useSelector((s: RootState) => s.auth.userId!);

  const { colors } = useTheme();

  const isDark = useColorScheme() === "dark";

  useNetworkSync();

  useEffect(() => {
    dispatch(loadTasks(userId));
  }, [userId]);

  // Header Logout Button
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            Alert.alert("Logout", "Are you sure you want to logout?", [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Logout",
                style: "destructive",
                onPress: () => dispatch(logout()),
              },
            ]);
          }}
          style={styles.logoutButton}
        >
          <Text
            style={[
              styles.logoutText,
              {
                color: colors.primary,
              },
            ]}
          >
            Logout
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, colors]);

  const handleToggle = useCallback(
    async (task: Task) => {
      const { isConnected } = await NetInfo.fetch();

      dispatch(toggleTask(task, !!isConnected));
    },
    [dispatch],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      const { isConnected } = await NetInfo.fetch();

      dispatch(deleteTask(id, !!isConnected));
    },
    [dispatch],
  );

  const getEnvColor = () => {
    switch (ENV) {
      case "production":
        return colors.danger;

      case "staging":
        return colors.warning;

      default:
        return colors.success;
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      {/* Top Section */}
      <View style={styles.topContainer}>
        {/* Environment Badge */}
        <View
          style={[
            styles.envBadge,
            {
              backgroundColor: `${getEnvColor()}20`,
            },
          ]}
        >
          <View
            style={[
              styles.envDot,
              {
                backgroundColor: getEnvColor(),
              },
            ]}
          />

          <Text
            style={[
              styles.envText,
              {
                color: getEnvColor(),
              },
            ]}
          >
            {ENV?.toUpperCase()}
          </Text>
        </View>

        {/* Task Counter */}
        <Text
          style={[
            styles.taskCount,
            {
              color: colors.muted,
            },
          ]}
        >
          {items.length} Task
          {items.length !== 1 ? "s" : ""}
        </Text>
      </View>

      {/* Task List */}
      <FlatList
        data={items}
        keyExtractor={(t) => t.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        removeClippedSubviews
        maxToRenderPerBatch={10}
        windowSize={5}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>

            <Text
              style={[
                styles.emptyTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              No Tasks Yet
            </Text>

            <Text
              style={[
                styles.emptySubtitle,
                {
                  color: colors.muted,
                },
              ]}
            >
              Start by creating your first task
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onEdit={(task) =>
              navigation.navigate("TaskForm", {
                taskId: task.id,
              })
            }
          />
        )}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        activeOpacity={0.9}
        style={[
          styles.fab,
          {
            backgroundColor: colors.primary,
            shadowColor: colors.shadow,
          },
        ]}
        onPress={() => navigation.navigate("TaskForm")}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  topContainer: {
    flexDirection: "row",

    alignItems: "center",
    justifyContent: "space-between",

    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },

  envBadge: {
    flexDirection: "row",

    alignItems: "center",

    paddingVertical: 6,
    paddingHorizontal: 12,

    borderRadius: 999,
  },

  envDot: {
    width: 8,
    height: 8,

    borderRadius: 999,

    marginRight: 8,
  },

  envText: {
    fontSize: 12,
    fontWeight: "700",
  },

  taskCount: {
    fontSize: 14,
    fontWeight: "600",
  },

  logoutButton: {
    marginRight: 16,
  },

  logoutText: {
    fontSize: 15,
    fontWeight: "700",
  },

  listContent: {
    paddingTop: 8,
    paddingBottom: 120,
  },

  emptyContainer: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    marginTop: 120,

    paddingHorizontal: 40,
  },

  emptyIcon: {
    fontSize: 72,
    marginBottom: 20,
  },

  emptyTitle: {
    fontSize: 24,
    fontWeight: "800",
  },

  emptySubtitle: {
    marginTop: 10,

    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,

    fontWeight: "500",
  },

  fab: {
    position: "absolute",

    bottom: 28,
    right: 24,

    width: 64,
    height: 64,

    borderRadius: 32,

    alignItems: "center",
    justifyContent: "center",

    shadowOffset: {
      width: 0,
      height: 8,
    },

    shadowOpacity: 0.18,
    shadowRadius: 14,

    elevation: 10,
  },

  fabText: {
    color: "#FFFFFF",

    fontSize: 34,
    fontWeight: "300",

    marginTop: -2,
  },
});
