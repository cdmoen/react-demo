import { useState, useEffect } from "react";

function TodoItem({ todo, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description);

  // Keep local state synced if parent updates
  useEffect(() => {
    setEditTitle(todo.title);
    setEditDescription(todo.description);
  }, [todo]);

  const hasChanges =
    editTitle !== todo.title || editDescription !== todo.description;

  async function handleSave() {
    if (!hasChanges) return;

    await onUpdate(todo.id, {
      title: editTitle,
      description: editDescription,
    });

    setIsEditing(false);
  }

  function handleCancel() {
    setEditTitle(todo.title);
    setEditDescription(todo.description);
    setIsEditing(false);
  }

  function handleTitleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      handleCancel();
    }
  }

  function handleDescriptionKeyDown(e) {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      handleCancel();
    }
  }

  return (
    <li className={isEditing ? "todo-row editing" : "todo-row"}>
      <div className="todo-title">
        <label className="todo-label">
          <span>Name</span>
          {isEditing ? (
            <input
              className="edit-input"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleTitleKeyDown}
            />
          ) : (
            <h3
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
              }}
            >
              {todo.title}
            </h3>
          )}
        </label>
      </div>

      <div className="todo-description">
        <label className="todo-label">
          <span>Description</span>
          {isEditing ? (
            <textarea
              className="edit-input textarea"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              onKeyDown={handleDescriptionKeyDown}
            />
          ) : (
            <p
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
              }}
            >
              {todo.description}
            </p>
          )}
        </label>
      </div>

      <div className="todo-actions">
        {isEditing ? (
          <>
            <button
              className="btn-save"
              onClick={handleSave}
              disabled={!hasChanges}
            >
              Save
            </button>
            <button className="btn-cancel" onClick={handleCancel}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <label
              className="btn-toggle"
              style={{
                backgroundColor: todo.completed
                  ? "rgb(0, 192, 96)"
                  : "rgba(192, 0, 128, 0.3)",
              }}
            >
              <span>{todo.completed ? "Completed" : "Not Completed"}</span>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() =>
                  onUpdate(todo.id, { completed: !todo.completed })
                }
              />
            </label>

            <button className="btn-edit" onClick={() => setIsEditing(true)}>
              Edit
            </button>

            <button className="btn-delete" onClick={() => onDelete(todo.id)}>
              Delete
            </button>
          </>
        )}
      </div>
    </li>
  );
}

export default TodoItem;
