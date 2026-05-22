import { useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";
import { useDispatch } from "react-redux";
import { syncPendingTasks } from "../features/tasks/tasksThunks";
import { AppDispatch } from "../app/store";

export const useNetworkSync = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        dispatch(syncPendingTasks());
      }
    });

    const unsub = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        dispatch(syncPendingTasks());
      }
    });

    return unsub;
  }, [dispatch]);
};
