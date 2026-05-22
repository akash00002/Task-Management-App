import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
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

  const isDark = useColorScheme() === "dark";

  const [title, setTitle] = useState(existingTask?.title ?? "");

  const [description, setDescription] = useState(
    existingTask?.description ?? "",
  );

  const [reminderMinutes, setReminderMinutes] = useState("");

  useEffect(() => {
    navigation.setOptions({
      title: taskId ? "Edit Task" : "New Task",
    });
  }, [taskId]);

  const handleSave = async () => {
    if (!title.trim()) {
      return Alert.alert("Missing Title", "Please enter a task title");
    }

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
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: `${colors.primary}15`,
              },
            ]}
          >
            <Text
              style={[
                styles.icon,
                {
                  color: colors.primary,
                },
              ]}
            >
              📝
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
            {taskId ? "Edit Task" : "Create Task"}
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color: colors.muted,
              },
            ]}
          >
            Organize your work efficiently
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
          {/* Title */}
          <View style={styles.inputWrapper}>
            <Text
              style={[
                styles.label,
                {
                  color: colors.text,
                },
              ]}
            >
              Title *
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
              placeholder="What needs to be done?"
              placeholderTextColor={colors.secondaryText}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* Description */}
          <View style={styles.inputWrapper}>
            <Text
              style={[
                styles.label,
                {
                  color: colors.text,
                },
              ]}
            >
              Description
            </Text>

            <TextInput
              style={[
                styles.input,
                styles.textArea,
                {
                  backgroundColor: isDark ? `${colors.border}40` : "#FFFFFF",

                  borderColor: colors.border,

                  color: colors.text,
                },
              ]}
              placeholder="Add task details..."
              placeholderTextColor={colors.secondaryText}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
          </View>

          {/* Reminder */}
          <View style={styles.inputWrapper}>
            <Text
              style={[
                styles.label,
                {
                  color: colors.text,
                },
              ]}
            >
              Reminder (minutes)
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
              placeholder="e.g. 30"
              placeholderTextColor={colors.secondaryText}
              value={reminderMinutes}
              onChangeText={setReminderMinutes}
              keyboardType="numeric"
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity
            activeOpacity={0.9}
            style={[
              styles.button,
              {
                backgroundColor: colors.primary,
              },
            ]}
            onPress={handleSave}
          >
            <Text style={styles.buttonText}>
              {taskId ? "Update Task" : "Create Task"}
            </Text>
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.cancelButton,
              {
                borderColor: colors.border,
                backgroundColor: colors.card,
              },
            ]}
            onPress={() => navigation.goBack()}
          >
            <Text
              style={[
                styles.cancelText,
                {
                  color: colors.text,
                },
              ]}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
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

    paddingHorizontal: 24,
    paddingVertical: 32,
  },

  header: {
    marginBottom: 30,
  },

  iconContainer: {
    width: 68,
    height: 68,

    borderRadius: 22,

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 22,
  },

  icon: {
    fontSize: 30,
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

  textArea: {
    minHeight: 120,
  },

  button: {
    height: 58,

    borderRadius: 18,

    alignItems: "center",
    justifyContent: "center",

    marginTop: 10,
  },

  buttonText: {
    color: "#FFFFFF",

    fontSize: 16,
    fontWeight: "700",
  },

  cancelButton: {
    height: 58,

    borderWidth: 1,

    borderRadius: 18,

    alignItems: "center",
    justifyContent: "center",

    marginTop: 14,
  },

  cancelText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
