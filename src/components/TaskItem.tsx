import React, { memo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";

import { useTheme } from "@react-navigation/native";
import { Task } from "../types";

interface Props {
  task: Task;
  onToggle: (task: Task) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

const TaskItem = memo(({ task, onToggle, onDelete, onEdit }: Props) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onEdit(task)}
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: colors.shadow,
        },
      ]}
    >
      <TouchableOpacity
        onPress={() => onToggle(task)}
        style={[
          styles.checkbox,
          {
            borderColor: task.completed ? colors.primary : colors.border,

            backgroundColor: task.completed ? colors.primary : "transparent",
          },
        ]}
      >
        {task.completed && <Text style={styles.check}>✓</Text>}
      </TouchableOpacity>

      <View style={styles.content}>
        <Text
          numberOfLines={1}
          style={[
            styles.title,
            { color: colors.text },
            task.completed && styles.completedText,
          ]}
        >
          {task.title}
        </Text>

        <View style={styles.bottomRow}>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: task.completed
                  ? `${colors.success}20`
                  : `${colors.warning}20`,
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                {
                  color: task.completed ? colors.success : colors.warning,
                },
              ]}
            >
              {task.completed ? "Completed" : "Pending"}
            </Text>
          </View>

          {!task.synced && (
            <View
              style={[
                styles.syncBadge,
                {
                  backgroundColor: `${colors.danger}20`,
                },
              ]}
            >
              <Text
                style={[
                  styles.syncText,
                  {
                    color: colors.danger,
                  },
                ]}
              >
                Not Synced
              </Text>
            </View>
          )}
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          Alert.alert(
            "Delete Task",
            "Are you sure you want to delete this task?",
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Delete",
                style: "destructive",
                onPress: () => onDelete(task.id),
              },
            ],
          );
        }}
        style={[
          styles.deleteButton,
          {
            backgroundColor: `${colors.danger}15`,
          },
        ]}
      >
        <Text
          style={[
            styles.deleteIcon,
            {
              color: colors.danger,
            },
          ]}
        >
          ✕
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",

    marginHorizontal: 16,
    marginVertical: 8,

    padding: 16,

    borderRadius: 22,
    borderWidth: 1,

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.08,
    shadowRadius: 8,

    elevation: 5,
  },

  checkbox: {
    width: 28,
    height: 28,

    borderRadius: 14,
    borderWidth: 2,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 14,
  },

  check: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },

  content: {
    flex: 1,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
  },

  completedText: {
    textDecorationLine: "line-through",
    opacity: 0.45,
  },

  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },

  syncBadge: {
    marginLeft: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  syncText: {
    fontSize: 11,
    fontWeight: "700",
  },

  deleteButton: {
    width: 38,
    height: 38,

    borderRadius: 19,

    alignItems: "center",
    justifyContent: "center",

    marginLeft: 12,
  },

  deleteIcon: {
    fontSize: 18,
    fontWeight: "700",
  },
});

export default TaskItem;
