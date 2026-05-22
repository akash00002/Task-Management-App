import React, { useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
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
  useNetworkSync();

  useEffect(() => {
    dispatch(loadTasks(userId));
  }, [userId]);

  // Add logout button in header
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            Alert.alert("Logout", "Are you sure you want to logout?", [
              { text: "Cancel", style: "cancel" },
              {
                text: "Logout",
                style: "destructive",
                onPress: () => dispatch(logout()),
              },
            ]);
          }}
          style={{ marginRight: 16 }}
        >
          <Text
            style={{ color: colors.primary, fontSize: 16, fontWeight: "600" }}
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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.envBadge,
          {
            backgroundColor:
              ENV === "production"
                ? "#EF4444"
                : ENV === "staging"
                  ? "#F59E0B"
                  : "#10B981",
          },
        ]}
      >
        <Text style={styles.envText}>ENV: {ENV}</Text>
      </View>
      <FlatList
        data={items}
        keyExtractor={(t) => t.id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onEdit={(task) =>
              navigation.navigate("TaskForm", { taskId: task.id })
            }
          />
        )}
        removeClippedSubviews
        maxToRenderPerBatch={10}
        windowSize={5}
      />
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate("TaskForm")}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  envBadge: {
    padding: 4,
    paddingHorizontal: 10,
    alignSelf: "flex-start",
    margin: 8,
    borderRadius: 4,
  },
  envText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  fabText: { color: "#fff", fontSize: 28 },
});
