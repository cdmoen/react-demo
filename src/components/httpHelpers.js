import { clearTodosList, resetAllForms } from "./resetHelpers.js";
import { saveCookie, getCookie, clearAuthCookies } from "./cookieHelpers.js";

// REGISTER USER
async function registerNewUser(name, pass) {
  try {
    const response = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: name,
        password: pass,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Registration successful: ", data);
    globalMessage.classList = "message success";
    globalMessage.textContent = "Registration Successful!";

    return true;
  } catch (error) {
    console.error("Registration failed: ", error);
    globalMessage.classList = "message error";
    globalMessage.textContent = "Registration Failed!";
    throw error;
  }
}

// LOGIN
async function loginUser(name, pass) {
  try {
    if (getCookie("token")) {
      if (!window.confirm(`You're already logged in. Switch users?`)) {
        return;
      } else {
        logoutUser();
        resetAllForms();
        clearTodosList();
      }
    }

    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: name,
        password: pass,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.json()}`);
    }

    // extract and save user name, id, and authentication token as cookies
    const data = await response.json();
    const userName = data.username;
    const userID = data.id;
    const userToken = data.token;
    saveCookie("userID", userID, 1);
    saveCookie("userName", userName, 1);
    saveCookie("token", userToken, 1);

    logoutButton.removeAttribute("disabled");
    authUserLabel.textContent = `Logged in as ${userName}`;
    globalMessage.classList = "message success";
    globalMessage.textContent = "Logged in successfully!";
    tabTodos.classList.remove("disabled");
    console.log(
      "Logged in successfully: id = ",
      userID,
      " username = ",
      userName,
      " auth = ",
      userToken,
    );
    return true;
  } catch (error) {
    console.error("Login failed: ", error);
    globalMessage.classList = "message error";
    globalMessage.textContent = "Login Failed!";
    throw error;
  }
}

// LOGOUT
async function logoutUser() {
  // retrieve token from cookies
  const token = getCookie("token");
  const userID = getCookie("userID");
  const userName = getCookie("userName");

  try {
    const response = await fetch("http://localhost:3000/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.json()}`);
    }

    const authUserLabel = document.querySelector("#authUserLabel");
    const logoutButton = document.querySelector("#logoutButton");
    logoutButton.setAttribute("disabled", true);
    authUserLabel.textContent = `Not logged in`;
    globalMessage.classList = "message success";
    globalMessage.textContent = "Logged out successfully!";
    tabTodos.classList.add("disabled");
    clearTodosList();

    clearAuthCookies();
    const data = await response.json();
    console.log("Logged out successfully: ", data.message);
    return true;
  } catch (error) {
    globalMessage.classList = "message error";
    globalMessage.textContent = "Logout Failed!";
    console.error("Logout failed: ", error);
    throw error;
  }
}

// NEW TODO
async function createTodo(todoTitle, todoDescription) {
  const token = getCookie("token");
  try {
    const response = await fetch("http://localhost:3000/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: todoTitle,
        description: todoDescription,
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.json()}`);
    }
    const data = await response.json();
    const id = data.id;
    const title = data.title;
    const description = data.description;
    const completed = data.completed;
    const createdAt = data.createdAt;
    console.log(
      `Todo created successfully: \ntitle = ${title}, \ndescription = ${description}, \ncompleted = ${completed}, \ncreatedAt = ${createdAt}`,
    );
    clearTodosList();
    getTodos();
    return true;
  } catch (error) {
    console.error("Todo creation failed: ", error);

    globalMessage.classList = "message error";
    globalMessage.textContent = "Create Todo Failed!";
    throw error;
  }
}

// GET ALL TODOS
async function getTodos() {
  try {
    const token = getCookie("token");
    const response = await fetch("http://localhost:3000/todos", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.json()}`);
    }
    const data = await response.json();
    data.forEach((item) => {
      // -------------------------To Do Item Read-Only Display -----------------//
      const todoItem = document.createElement("div");
      todoItem.classList.add("todo-item");
      todoItem.dataset.id = item.id;

      const todoTitle = document.createElement("h2");
      todoTitle.classList.add("todo-title");
      todoTitle.textContent = item.title;

      const todoDescription = document.createElement("p");
      todoDescription.classList.add("todo-description");
      todoDescription.textContent = item.description;

      const todoActions = document.createElement("div");
      todoActions.classList.add("todo-actions");

      // ---------------------------------------------------------------------//

      // ------- To Do EDITABLE FORM (initially hidden)------------- //
      const todoEdit = document.createElement("form");
      const todoEditTitle = document.createElement("input");
      const todoEditDescription = document.createElement("input");
      const todoEditSubmit = document.createElement("input");
      const todoEditCompleted = document.createElement("input");
      todoEditTitle.type = "text";
      todoEditTitle.value = item.title;
      todoEditDescription.type = "text";
      todoEditDescription.value = item.description;
      todoEditSubmit.type = "submit";
      todoEditCompleted.type = "checkbox";
      todoEditCompleted.checked = item.completed;
      todoEdit.appendChild(todoEditTitle);
      todoEdit.appendChild(todoEditDescription);
      todoEdit.appendChild(todoEditCompleted);
      todoEdit.appendChild(todoEditSubmit);
      todoEdit.classList.add("hidden");
      todoEdit.dataset.id = item.id;
      todoEdit.dataset.title = item.title;
      todoEdit.dataset.description = item.description;
      todoEdit.dataset.completed = item.completed;
      todoEdit.addEventListener("submit", (e) => {
        e.preventDefault();
        editTodo(
          todoEdit.dataset.id,
          todoEditTitle.value,
          todoEditDescription.value,
          todoEditCompleted.checked,
        );
        clearTodosList();
        getTodos();
        todoEdit.classList.add("hidden");
        todoTitle.classList.remove("hidden");
        todoDescription.classList.remove("hidden");
        todoActions.classList.remove("hidden");
      });
      todoItem.appendChild(todoEdit);
      /* ------------------------------------------------------*/

      const deleteButton = document.createElement("button");
      deleteButton.classList.add("btn-delete");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", (e) => {
        e.preventDefault();
        deleteTodo(todoItem.dataset.id);
        clearTodosList();
        getTodos();
      });

      const editButton = document.createElement("button");
      editButton.classList.add("btn-edit");
      editButton.textContent = "Edit";
      editButton.addEventListener("click", (e) => {
        e.preventDefault();
        todoEdit.classList.remove("hidden");
        todoTitle.classList.add("hidden");
        todoDescription.classList.add("hidden");
        todoActions.classList.add("hidden");
      });

      const completedForm = document.createElement("form");
      completedForm.classList.add("completed-form");

      const toggleComplete = document.createElement("input");
      toggleComplete.type = "checkbox";
      toggleComplete.checked = item.completed;
      toggleComplete.classList.add("btn-toggle");

      todoActions.appendChild(deleteButton);
      todoActions.appendChild(editButton);
      todoActions.appendChild(toggleComplete);
      todoItem.appendChild(todoTitle);
      todoItem.appendChild(todoDescription);
      todosList.appendChild(todoItem);
      todoItem.appendChild(todoActions);
    });
    return data;
  } catch (error) {
    console.error("Todo retrieval failed: ", error);

    globalMessage.classList = "message error";
    globalMessage.textContent = "Retrieve Todos Failed!";
    throw error;
  }
}

// DELETE TODO
async function deleteTodo(todoID) {
  try {
    const token = getCookie("token");
    const response = await fetch(`http://localhost:3000/todos/${todoID}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    console.log("Todo deleted successfully: ");
  } catch (error) {
    console.error("Todo deletion failed: ", error);
  }
}

// EDIT TODO
async function editTodo(todoID, todoTitle, todoDescription, todoCompleted) {
  try {
    const token = getCookie("token");

    const response = await fetch(`http://localhost:3000/todos/${todoID}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: todoTitle,
        description: todoDescription,
        completed: todoCompleted,
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
  } catch (error) {
    console.log("Failed to edit todo:  ", error);
  }
}

export {
  registerNewUser,
  loginUser,
  logoutUser,
  createTodo,
  getTodos,
  editTodo,
  deleteTodo,
};
