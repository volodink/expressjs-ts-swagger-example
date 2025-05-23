import fs from "fs/promises";
import { DATA_FILE } from "./app";


// Инициализация файла данных
export async function createFile() {
    try {
        await fs.access(DATA_FILE);
    } catch {
        await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2));
    }
}
// Чтение данных
export async function readTodos() {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
}
// Запись данных
export async function writeTodos(todos: any[]) {
    await fs.writeFile(DATA_FILE, JSON.stringify(todos, null, 2));
}
