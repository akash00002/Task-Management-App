import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ActivityIndicator, View } from "react-native";
import { store, persistor } from "./src/app/store";
import AppNavigator from "./src/navigation/AppNavigator";
import { requestNotificationPermission } from "./src/notifications/notificationService";

export default function App() {
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color="#4F46E5" />
          </View>
        }
        persistor={persistor}
      >
        <AppNavigator />
      </PersistGate>
    </Provider>
  );
}
