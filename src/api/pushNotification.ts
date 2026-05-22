export const sendPushNotification = async (
  fcmToken: string,
  title: string,
  body: string,
) => {
  const message = {
    to: fcmToken,
    sound: "default",
    title,
    body,
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
};
