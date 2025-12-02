import styles from "./page.module.css";
import { TodoStatus, TodoItem, addTodo, completeTodo, deleteTodo, getTodos } from "./actions";

export default async function Page() {
  const todos: TodoItem[] = await getTodos();

  const activeTasks = todos.filter(t => t.status === TodoStatus.Task);
  const deletedTasks = todos.filter(t => t.status === TodoStatus.Deleted);
  const completedTasks = todos.filter(t => t.status === TodoStatus.Completed);

  // Active tasks first, then deleted tasks in order they were deleted (bottom)
  const tasks = [...activeTasks, ...deletedTasks];

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Todo List</h1>

          {/* Add Todo */}
          <form action={addTodo} className={styles.form}>
            <input
              type="text"
              name="text"
              placeholder="Add a new task"
              className={styles.input}
              autoFocus
            />
            <button type="submit" className={styles.button}>Add</button>
          </form>

          {/* Tasks */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Tasks</h2>
            {tasks.length === 0 ? (
              <p className={styles.emptyText}>No tasks yet.</p>
            ) : (
              <ul className={styles.list}>
                {tasks.map(todo => (
                  <li key={todo.id} className={styles.listItem}>
                    <span style={{ textDecoration: todo.status === TodoStatus.Deleted ? "line-through" : "none" }}>
                      {todo.text}
                    </span>
                    <div className={styles.actions}>
                      {todo.status !== TodoStatus.Deleted && (
                        <>
                          <form action={completeTodo}>
                            <input type="hidden" name="id" value={todo.id} />
                            <button type="submit" className={styles.smallButton}>Complete</button>
                          </form>
                          <form action={deleteTodo}>
                            <input type="hidden" name="id" value={todo.id} />
                            <button type="submit" className={styles.smallButton}>Delete</button>
                          </form>
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Completed */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Completed</h2>
            {completedTasks.length === 0 ? (
              <p>No completed tasks.</p>
            ) : (
              <ul className={styles.list}>
                {completedTasks
                  .slice()
                  .reverse() // newest completed on top
                  .map(todo => (
                    <li key={todo.id}>{todo.text}</li>
                  ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
