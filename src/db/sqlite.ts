import * as SQLite from "expo-sqlite";
import { Task } from "../types";

let db: SQLite.SQLiteDatabase;

export const getDB = async () => {
  if (db) return db;
  db = await SQLite.openDatabaseAsync("tasks.db");
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      completed INTEGER DEFAULT 0,
      userId TEXT NOT NULL,
      createdAt INTEGER,
      updatedAt INTEGER,
      synced INTEGER DEFAULT 0
    );
  `);
  return db;
};

export const localSaveTask = async (task: Task) => {
  const db = await getDB();
  await db.runAsync(
    `INSERT OR REPLACE INTO tasks 
     (id, title, description, completed, userId, createdAt, updatedAt, synced)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      task.id,
      task.title,
      task.description ?? "",
      task.completed ? 1 : 0,
      task.userId,
      task.createdAt,
      task.updatedAt,
      task.synced ? 1 : 0,
    ],
  );
};

export const localGetTasks = async (userId: string): Promise<Task[]> => {
  const db = await getDB();
  const rows = await db.getAllAsync<any>(
    "SELECT * FROM tasks WHERE userId = ? ORDER BY createdAt DESC",
    [userId],
  );
  return rows.map((row) => ({
    ...row,
    completed: row.completed === 1,
    synced: row.synced === 1,
  }));
};

export const localDeleteTask = async (id: string) => {
  const db = await getDB();
  await db.runAsync("DELETE FROM tasks WHERE id = ?", [id]);
};

export const getUnsyncedTasks = async (): Promise<Task[]> => {
  const db = await getDB();
  const rows = await db.getAllAsync<any>(
    "SELECT * FROM tasks WHERE synced = 0",
  );
  return rows.map((row) => ({
    ...row,
    completed: row.completed === 1,
    synced: false,
  }));
};
