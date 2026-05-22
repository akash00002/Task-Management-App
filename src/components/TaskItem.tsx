import React, { memo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
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
    <View
      style={[
        styles.row,
        { borderColor: colors.border, backgroundColor: colors.card },
      ]}
    >
      <TouchableOpacity onPress={() => onToggle(task)} style={styles.check}>
        <Text style={styles.checkIcon}>{task.completed ? "✅" : "⬜"}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onEdit(task)} style={styles.title}>
        <Text
          style={[
            styles.text,
            { color: colors.text },
            task.completed && styles.done,
          ]}
        >
          {task.title}
        </Text>
        {!task.synced && <Text style={styles.unsynced}>⚠ Not synced</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onDelete(task.id)}>
        <Text style={styles.del}>🗑</Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  check: { marginRight: 12 },
  checkIcon: { fontSize: 20 },
  title: { flex: 1 },
  text: { fontSize: 16 },
  done: { textDecorationLine: "line-through", opacity: 0.4 },
  unsynced: { fontSize: 11, color: "#F59E0B", marginTop: 2 },
  del: { fontSize: 20 },
});

export default TaskItem;
