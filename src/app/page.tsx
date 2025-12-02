"use client";

import React from "react";
import styles from "./page.module.css";

enum TodoStatus {
  Task = "task",
  Deleted = "deleted",
  Completed = "completed",
}

interface TodoItem {
  id: string;
  text: string;
  status: TodoStatus;
}

interface TodoState {
  input: string;
  todos: TodoItem[];
}

class TodoApp extends React.Component<unknown, TodoState> {
  constructor(props: unknown) {
    super(props);
    this.state = {
      input: "",
      todos: [],
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleAddTodo = this.handleAddTodo.bind(this);
    this.handleDeleteTodo = this.handleDeleteTodo.bind(this);
    this.handleCompleteTodo = this.handleCompleteTodo.bind(this);
  }

  private createId(): string {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
    return `${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .slice(2, 10)}`;
  }

  handleInputChange(event: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({ input: event.target.value });
  }

  handleAddTodo(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const trimmed = this.state.input.trim();
    if (!trimmed) {
      return;
    }

    const newTodo: TodoItem = {
      id: this.createId(),
      text: trimmed,
      status: TodoStatus.Task,
    };

    this.setState((prevState) => ({
      input: "",
      todos: [newTodo, ...prevState.todos],
    }));
  }

  handleDeleteTodo(id: string): void {
    this.setState((prevState) => ({
      ...prevState,
      todos: prevState.todos.map((todo) =>
        todo.id === id ? { ...todo, status: TodoStatus.Deleted } : todo
      ),
    }));
  }

  handleCompleteTodo(id: string): void {
    this.setState((prevState) => ({
      ...prevState,
      todos: prevState.todos.map((todo) =>
        todo.id === id ? { ...todo, status: TodoStatus.Completed } : todo
      ),
    }));
  }

  render(): React.ReactNode {
    const { input, todos } = this.state;

    const activeTasks = todos.filter(
      (todo) => todo.status === TodoStatus.Task
    );
    const deletedTasks = todos.filter(
      (todo) => todo.status === TodoStatus.Deleted
    );
    const completed = todos.filter(
      (todo) => todo.status === TodoStatus.Completed
    );

    const tasks = [...activeTasks, ...deletedTasks];

    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.container}>
            <h1 className={styles.title}>Todo List</h1>

            <form className={styles.form} onSubmit={this.handleAddTodo}>
              <input
                type="text"
                value={input}
                onChange={this.handleInputChange}
                placeholder="Add a new task"
                className={styles.input}
              />
              <button type="submit" className={styles.button}>
                Add
              </button>
            </form>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Tasks</h2>
              {tasks.length === 0 ? (
                <p className={styles.emptyText}>No tasks yet.</p>
              ) : (
                <ul className={styles.list}>
                  {tasks.map((todo) => (
                    <li key={todo.id} className={styles.listItem}>
                      <span
                        className={
                          todo.status === TodoStatus.Deleted
                            ? styles.deletedText
                            : styles.taskText
                        }
                      >
                        {todo.text}
                      </span>
                      <div className={styles.actions}>
                        <button
                          className={styles.smallButton}
                          onClick={() => this.handleCompleteTodo(todo.id)}
                          type="button"
                        >
                          Complete
                        </button>
                        <button
                          className={styles.smallButton}
                          onClick={() => this.handleDeleteTodo(todo.id)}
                          type="button"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Completed</h2>
              {completed.length === 0 ? (
                <p className={styles.emptyText}>No completed tasks.</p>
              ) : (
                <ul className={styles.list}>
                  {completed.map((todo) => (
                    <li key={todo.id} className={styles.listItem}>
                      <span className={styles.completedText}>{todo.text}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </main>
      </div>
    );
  }
}

export default TodoApp;
