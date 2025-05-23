import fs from "fs/promises";
import path from "path";
import { DATA_FILE } from "../config/constants";
import { Todo } from "../models/todo.model";

const initializeFile = async () => {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, "[]");
  }
};

const readFile = async (): Promise<Todo[]> => {
  await initializeFile();
  const data = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(data);
};

export const TodoRepository = {
  findAll: async (): Promise<Todo[]> => await readFile(),
  saveAll: async (todos: Todo[]) => await fs.writeFile(DATA_FILE, JSON.stringify(todos)),
  getNextId: (todos: Todo[]) => todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1,
};
