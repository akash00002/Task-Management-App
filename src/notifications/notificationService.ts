import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import Constants from "expo-constants";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const requestNotificationPermission = async () => {
  if (Platform.OS === "android" && Constants.appOwnership === "expo") {
    return true;
  }
  const permissions = await Notifications.requestPermissionsAsync();
  return Object.values(permissions).some((v) => v === true || v === "granted");
};

export const registerForPushNotifications = async (): Promise<{
  expoPushToken: string | null;
  fcmToken: string | null;
}> => {
  if (Platform.OS === "android" && Constants.appOwnership === "expo") {
    return { expoPushToken: null, fcmToken: null };
  }

  const permissions = await Notifications.requestPermissionsAsync();

  // Check any truthy permission value
  const isGranted = Object.values(permissions).some(
    (v) => v === true || v === "granted",
  );

  if (!isGranted) {
    return { expoPushToken: null, fcmToken: null };
  }

  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  let expoPushToken: string | null = null;
  try {
    expoPushToken = (await Notifications.getExpoPushTokenAsync({ projectId }))
      .data;
  } catch (e) {}

  let fcmToken: string | null = null;
  if (Platform.OS === "android") {
    try {
      const deviceToken = await Notifications.getDevicePushTokenAsync();
      fcmToken = deviceToken.data;
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#4F46E5",
      });
    } catch (e) {}
  }

  return { expoPushToken, fcmToken };
};

export const scheduleTaskReminder = async (
  title: string,
  body: string,
  triggerDate: Date,
) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "📋 Task Reminder",
        body,
        data: { title },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: triggerDate,
      },
    });
  } catch (e) {}
};

export const cancelReminder = async (notificationId: string) => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (e) {}
};
