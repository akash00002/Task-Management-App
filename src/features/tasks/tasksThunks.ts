import uuid from "react-native-uuid";
import NetInfo from "@react-native-community/netinfo";
import { doc, getDoc } from "firebase/firestore";
import { AppDispatch } from "../../app/store";
import { upsertTask, removeTask, setTasks } from "./tasksSlice";
import {
  localSaveTask,
  localGetTasks,
  localDeleteTask,
  getUnsyncedTasks,
} from "../../db/sqlite";
import {
  syncTaskToFirestore,
  deleteTaskFromFirestore,
} from "../../api/firestore";
import { sendPushNotification } from "../../api/pushNotification";
import { db } from "../../config/firebase";
import { Task } from "../../types";

export const loadTasks = (userId: string) => async (dispatch: AppDispatch) => {
  const tasks = await localGetTasks(userId);
  dispatch(setTasks(tasks));
};

export const addTask =
  (title: string, description: string, userId: string, isOnline: boolean) =>
  async (dispatch: AppDispatch) => {
    const task: Task = {
      id: uuid.v4() as string,
      title,
      description,
      completed: false,
      userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      synced: isOnline,
    };
    await localSaveTask(task);
    dispatch(upsertTask(task));

    if (isOnline) {
      await syncTaskToFirestore(task);

      // Send push notification
      try {
        const userDoc = await getDoc(doc(db, "users", userId));
        const expoPushToken = userDoc.data()?.expoPushToken;
        if (expoPushToken) {
          await sendPushNotification(
            expoPushToken,
            "📋 New Task Added",
            `"${title}" has been added to your tasks`,
          );
        }
      } catch (e) {
        console.log("Push notification error:", e);
      }
    }
  };

export const editTask = (task: Task) => async (dispatch: AppDispatch) => {
  const updated = { ...task, updatedAt: Date.now() };
  await localSaveTask(updated);
  dispatch(upsertTask(updated));
  const { isConnected } = await NetInfo.fetch();
  if (isConnected) await syncTaskToFirestore({ ...updated, synced: true });
};

export const toggleTask =
  (task: Task, isOnline: boolean) => async (dispatch: AppDispatch) => {
    const updated = {
      ...task,
      completed: !task.completed,
      updatedAt: Date.now(),
      synced: isOnline,
    };
    await localSaveTask(updated);
    dispatch(upsertTask(updated));

    if (isOnline) {
      await syncTaskToFirestore(updated);

      // Send push notification on completion
      if (updated.completed) {
        try {
          const userDoc = await getDoc(doc(db, "users", task.userId));
          const expoPushToken = userDoc.data()?.expoPushToken;
          if (expoPushToken) {
            await sendPushNotification(
              expoPushToken,
              "✅ Task Completed",
              `"${task.title}" marked as complete`,
            );
          }
        } catch (e) {
          console.log("Push notification error:", e);
        }
      }
    }
  };

export const deleteTask =
  (id: string, isOnline: boolean) => async (dispatch: AppDispatch) => {
    await localDeleteTask(id);
    dispatch(removeTask(id));
    if (isOnline) await deleteTaskFromFirestore(id);
  };

export const syncPendingTasks = () => async (dispatch: AppDispatch) => {
  const unsynced = await getUnsyncedTasks();
  console.log("Unsynced tasks:", unsynced.length);

  for (const task of unsynced) {
    try {
      const syncedTask = { ...task, synced: true };
      await syncTaskToFirestore(syncedTask);
      await localSaveTask(syncedTask);
      dispatch(upsertTask(syncedTask));
      console.log("Synced task:", task.title);
    } catch (e) {
      console.log("Sync failed for task:", task.title, e);
    }
  }
};
