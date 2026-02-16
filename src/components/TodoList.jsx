import { useState, useEffect } from "react";
import NewTodoForm from "./NewTodoForm";
import TodoItem from "./TodoItem";

function TodoList({ setGlobalMessage, token }) {
  const [todos, setTodos] = useState([]);

  // ADD NEW Todo
  const handleAddTodo = (newTodo) => {
    setTodos((prev) => [...prev, newTodo]);
  };

  // DELETE Todo
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/todos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      // Update local state
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // EDIT Todo
  const handleUpdate = async (id, updatedFields) => {
    try {
      const response = await fetch(`http://localhost:3000/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedFields),
      });

      if (!response.ok) {
        throw new Error("Update failed");
      }

      const updatedTodo = await response.json();
      setGlobalMessage({
        text: "Successful update",
        type: "success",
      });

      // Update state with returned todo
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? updatedTodo : todo)),
      );
    } catch (err) {
      setGlobalMessage({
        text: "Update failed",
        type: "error",
      });
      console.error(err);
    }
  };

  useEffect(() => {
    async function fetchTodos() {
      const res = await fetch("http://localhost:3000/todos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTodos(data);
    }
    fetchTodos();
  }, [token]);

  return (
    <section id="todosSection">
      <div className="todos-header">
        <h2>New Todo</h2>
      </div>

      <NewTodoForm
        setGlobalMessage={setGlobalMessage}
        token={token}
        onAdd={handleAddTodo}
      />

      <ul className="todos-list">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        ))}
      </ul>
    </section>
  );
}

export default TodoList;
