"use server";

import { promises as fs } from "fs";
import path from "path";
import { redirect } from "next/navigation";

export enum TodoStatus {
  Task = "task",
  Deleted = "deleted",
  Completed = "completed",
}

export interface TodoItem {
  id: string;
  text: string;
  status: TodoStatus;
}

const filePath = path.join(process.cwd(), "data", "todos.json");

async function readTodos(): Promise<TodoItem[]> {
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
}

async function saveTodos(todos: TodoItem[]) {
  await fs.writeFile(filePath, JSON.stringify(todos, null, 2));
}

const createId = (): string => {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  };


export async function addTodo(formData: FormData) {
  "use server";
  const text = formData.get("text")?.toString().trim();
  if (!text) return;

  const todos = await readTodos();
  todos.unshift({ id: createId(), text, status: TodoStatus.Task });
  await saveTodos(todos);

  redirect("/");
}


export async function completeTodo(formData: FormData) {
  "use server";
  const id = formData.get("id")?.toString();
  if (!id) return;

  const todos = (await readTodos()).map(t =>
    t.id === id ? { ...t, status: TodoStatus.Completed } : t
  );
  await saveTodos(todos);

  redirect("/");
}


export async function deleteTodo(formData: FormData) {
  "use server";
  const id = formData.get("id")?.toString();
  if (!id) return;

  const todos = (await readTodos()).map(t =>
    t.id === id ? { ...t, status: TodoStatus.Deleted } : t
  );
  await saveTodos(todos);

  redirect("/"); 
}

// Get todos
export async function getTodos(): Promise<TodoItem[]> {
  return await readTodos();
}
