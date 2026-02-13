import { useState } from "react";
import LoginForm from "./components/LoginForm";
import RegistrationForm from "./components/RegistrationForm";
import TodoList from "./components/TodoList";
import Tabs from "./components/Tabs";
import GlobalMessage from "./Components/GlobalMessage";
import Header from "./components/Header";
import "./App.css";
import logoutRequest from "./modules/LogoutRequest";

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [globalMessage, setGlobalMessage] = useState("");

  async function handleLogout() {
    try {
      if (token) {
        await logoutRequest(token);
      }
    } catch (err) {
      console.error(err);
    }

    // Clear local state
    setToken(null);
    setUser(null);
    setTodos([]);
  }

  return (
    <>
      <Header user={user} onLogout={handleLogout} className="header" />
      <main>
        <Tabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isTodosDisabled={!token}
          className="tabs"
        />
        <GlobalMessage message={globalMessage} className="message" />
        {activeTab === "login" && (
          <LoginForm setToken={setToken} setUser={setUser} />
        )}
        {activeTab === "register" && (
          <RegistrationForm setToken={setToken} setUser={setUser} />
        )}
        {activeTab === "todos" && <TodoList token={token} />}
      </main>
    </>
  );
}

export default App;
