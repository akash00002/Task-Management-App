import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { AppDispatch } from "../../app/store";
import { setUser, clearUser, setLoading, setError } from "./authSlice";
import { registerForPushNotifications } from "../../notifications/notificationService";

export const signUp =
  (email: string, password: string) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      dispatch(setUser({ userId: user.uid, email: user.email! }));

      // Save tokens on signup
      const { expoPushToken, fcmToken } = await registerForPushNotifications();
      await setDoc(
        doc(db, "users", user.uid),
        { expoPushToken, fcmToken, updatedAt: Date.now() },
        { merge: true },
      );
    } catch (e: any) {
      dispatch(setError(e.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const login =
  (email: string, password: string) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      dispatch(setUser({ userId: user.uid, email: user.email! }));

      // Save tokens on login
      const { expoPushToken, fcmToken } = await registerForPushNotifications();
      await setDoc(
        doc(db, "users", user.uid),
        { expoPushToken, fcmToken, updatedAt: Date.now() },
        { merge: true },
      );
    } catch (e: any) {
      dispatch(setError(e.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const logout = () => async (dispatch: AppDispatch) => {
  await signOut(auth);
  dispatch(clearUser());
};
