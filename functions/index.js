const {
  onDocumentCreated,
  onDocumentUpdated,
} = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getMessaging } = require("firebase-admin/messaging");

initializeApp();

// Trigger when a new task is created
exports.sendTaskNotification = onDocumentCreated(
  "tasks/{taskId}",
  async (event) => {
    const task = event.data?.data();
    if (!task) return null;

    const db = getFirestore();

    // Get user's push token from Firestore
    const userDoc = await db.collection("users").doc(task.userId).get();
    const fcmToken = userDoc.data()?.fcmToken;

    if (!fcmToken) {
      console.log("No FCM token found for user:", task.userId);
      return null;
    }

    const message = {
      token: fcmToken,
      notification: {
        title: "📋 New Task Created",
        body: task.title,
      },
      data: {
        taskId: event.params.taskId,
        userId: task.userId,
      },
      android: {
        priority: "high",
        notification: {
          channelId: "default",
          sound: "default",
        },
      },
      apns: {
        payload: {
          aps: {
            sound: "default",
            badge: 1,
          },
        },
      },
    };

    try {
      await getMessaging().send(message);
      console.log("FCM notification sent for task:", task.title);
    } catch (e) {
      console.log("FCM send error:", e);
    }

    return null;
  },
);

// Trigger when task is updated
exports.sendTaskUpdateNotification = onDocumentUpdated(
  "tasks/{taskId}",
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();

    if (!before || !after) return null;

    // Only notify if completed status changed
    if (before.completed === after.completed) return null;

    const db = getFirestore();
    const userDoc = await db.collection("users").doc(after.userId).get();
    const fcmToken = userDoc.data()?.fcmToken;

    if (!fcmToken) return null;

    const message = {
      token: fcmToken,
      notification: {
        title: after.completed ? "✅ Task Completed" : "🔄 Task Reopened",
        body: after.title,
      },
      data: {
        taskId: event.params.taskId,
      },
    };

    try {
      await getMessaging().send(message);
      console.log("FCM update notification sent:", after.title);
    } catch (e) {
      console.log("FCM send error:", e);
    }

    return null;
  },
);
