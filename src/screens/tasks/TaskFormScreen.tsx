import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@react-navigation/native";
import NetInfo from "@react-native-community/netinfo";
import { AppDispatch, RootState } from "../../app/store";
import { addTask, editTask } from "../../features/tasks/tasksThunks";
import { scheduleTaskReminder } from "../../notifications/notificationService";

export default function TaskFormScreen({ route, navigation }: any) {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((s: RootState) => s.auth.userId!);
  const tasks = useSelector((s: RootState) => s.tasks.items);
  const taskId = route.params?.taskId;
  const existingTask = tasks.find((t) => t.id === taskId);
  const { colors } = useTheme();

  const [title, setTitle] = useState(existingTask?.title ?? "");
  const [description, setDescription] = useState(
    existingTask?.description ?? "",
  );
  const [reminderMinutes, setReminderMinutes] = useState("");

  useEffect(() => {
    navigation.setOptions({ title: taskId ? "Edit Task" : "New Task" });
  }, [taskId]);

  const handleSave = async () => {
    if (!title.trim()) return Alert.alert("Error", "Title is required");
    const { isConnected } = await NetInfo.fetch();
    if (existingTask) {
      dispatch(
        editTask({
          ...existingTask,
          title,
          description,
          synced: !!isConnected,
        }),
      );
    } else {
      dispatch(addTask(title, description, userId, !!isConnected));
    }
    if (reminderMinutes && parseInt(reminderMinutes) > 0) {
      const triggerDate = new Date();
      triggerDate.setMinutes(
        triggerDate.getMinutes() + parseInt(reminderMinutes),
      );
      await scheduleTaskReminder(title, title, triggerDate);
      Alert.alert(
        "Reminder Set",
        `You'll be reminded in ${reminderMinutes} minute(s)`,
      );
    }
    navigation.goBack();
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <Text style={[styles.label, { color: colors.text }]}>Title *</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            color: colors.text,
          },
        ]}
        placeholder="What needs to be done?"
        placeholderTextColor={colors.border}
        value={title}
        onChangeText={setTitle}
      />
      <Text style={[styles.label, { color: colors.text }]}>Description</Text>
      <TextInput
        style={[
          styles.input,
          styles.textArea,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            color: colors.text,
          },
        ]}
        placeholder="Add details (optional)"
        placeholderTextColor={colors.border}
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />
      <Text style={[styles.label, { color: colors.text }]}>
        Remind me in (minutes)
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            color: colors.text,
          },
        ]}
        placeholder="e.g. 30"
        placeholderTextColor={colors.border}
        value={reminderMinutes}
        onChangeText={setReminderMinutes}
        keyboardType="numeric"
      />
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={handleSave}
      >
        <Text style={styles.buttonText}>
          {taskId ? "Update Task" : "Add Task"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.cancelButton, { borderColor: colors.border }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={[styles.cancelText, { color: colors.text }]}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, flexGrow: 1 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 20,
  },
  textArea: { height: 120 },
  button: {
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  cancelButton: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
  },
  cancelText: { fontSize: 16 },
});
