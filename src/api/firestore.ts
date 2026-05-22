import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { Task } from "../types";

export const syncTaskToFirestore = async (task: Task) => {
  await setDoc(doc(db, "tasks", task.id), task);
};

export const fetchTasksFromFirestore = async (
  userId: string,
): Promise<Task[]> => {
  const q = query(
    collection(db, "tasks"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data() as Task);
};

export const deleteTaskFromFirestore = async (id: string) => {
  await deleteDoc(doc(db, "tasks", id));
};
