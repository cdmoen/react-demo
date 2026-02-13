import { useState } from "react";

function TodoItem({ todo, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description);

  const handleSave = () => {
    onUpdate(todo.id, {
      title: editTitle,
      description: editDescription,
    });
    setIsEditing(false);
  };

  return (
    <li>
      {/* Completed Checkbox */}
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onUpdate(todo.id, { completed: !todo.completed })}
      />

      {isEditing ? (
        <>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <input
            type="text"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          />
          <button onClick={handleSave}>Save</button>
        </>
      ) : (
        <>
          <h3
            style={{
              textDecoration: todo.completed ? "line-through" : "none",
            }}
          >
            {todo.title}
          </h3>
          <p>{todo.description}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </>
      )}

      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </li>
  );
}

export default TodoItem;
