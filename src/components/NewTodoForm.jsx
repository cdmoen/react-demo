import { useState } from "react";

function NewTodoForm({ setGlobalMessage, token, onAdd }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: title, description: description }),
      });

      if (!response.ok) {
        throw new Error("Failed to create todo");
      }

      const newTodo = await response.json();

      // Tell parent to update state
      onAdd(newTodo);
      setGlobalMessage({
        text: "Todo created successfully",
        type: "success",
      });

      // Clear form
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error(err);
      setGlobalMessage({
        text: "Failed to create todo",
        type: "error",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="field">
        <label>Title</label>
        <input
          type="text"
          value={title}
          required
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="field">
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <button type="submit">Add Todo</button>
    </form>
  );
}

export default NewTodoForm;
