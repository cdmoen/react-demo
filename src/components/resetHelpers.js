import { getCookie } from "./cookieHelpers.js";

// Helper function to clear todos list
function clearTodosList() {
  todosList.innerHTML = "";
}

// Helper function to reset all form entry text
function resetAllForms() {
  todoForm.reset();
  loginForm.reset();
  registerForm.reset();
}

// Function to restore login state upon refresh
function restoreLoginState() {
  const cookieData = document.cookie.split(";");
  console.log(cookieData);

  if (getCookie("token")) {
    tabTodos.classList.remove("disabled");
    logoutButton.removeAttribute("disabled");
    authUserLabel.textContent = `Logged in as ${getCookie("userName")}`;
  } else {
    tabTodos.classList.add("disabled");
    logoutButton.setAttribute("disabled", true);
    authUserLabel.textContent = `Not logged in`;
    resetAllForms();
    clearTodosList();
    todosSection.classList.add("hidden");
    globalMessage.classList = "hidden";
    globalMessage.textContent = "";
  }
}

export { clearTodosList, resetAllForms, restoreLoginState };
