import React, { lazy, Suspense } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ActivityIndicator, View } from "react-native";

// ← lazy load screens instead of importing directly
const TaskListScreen = lazy(() => import("../screens/tasks/TaskListScreen"));
const TaskFormScreen = lazy(() => import("../screens/tasks/TaskFormScreen"));

const Stack = createStackNavigator();

const Fallback = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <ActivityIndicator size="large" color="#4F46E5" />
  </View>
);

export default function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="TaskList" options={{ title: "My Tasks" }}>
        {(props) => (
          <Suspense fallback={<Fallback />}>
            <TaskListScreen {...props} />
          </Suspense>
        )}
      </Stack.Screen>
      <Stack.Screen name="TaskForm" options={{ title: "Task" }}>
        {(props) => (
          <Suspense fallback={<Fallback />}>
            <TaskFormScreen {...props} />
          </Suspense>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
