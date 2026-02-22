import { useState, useEffect } from "react";
import LoginForm from "./components/LoginForm";
import RegistrationForm from "./components/RegistrationForm";
import TodoList from "./components/TodoList";
import Tabs from "./components/Tabs";
import GlobalMessage from "./Components/GlobalMessage";
import Header from "./components/Header";
import "./App.css";
import logoutRequest from "./modules/LogoutRequest";
import { storeLocally } from "./modules/storeLocally";
import MovieForm from "./components/MovieForm";

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => localStorage.getItem("user"));
  const [activeTab, setActiveTab] = useState("login");
  const [globalMessage, setGlobalMessage] = useState("");

  // Store token in local storage so that login persists upon page refresh
  storeLocally("token", token);
  // Store Username locally so that username is still displayed in header when page refreshes
  storeLocally("user", user);

  async function handleLogout() {
    try {
      if (token) {
        await logoutRequest(token);
        setGlobalMessage({
          text: "Logout successful",
          type: "success",
        });
      }
    } catch (err) {
      console.error(err);
      setGlobalMessage({
        text: "Logout failed",
        type: "error",
      });
    }

    // Clear local state
    setToken(null);
    setActiveTab("login");
    setUser(null);
  }

  useEffect(() => {
    if (!globalMessage) return;

    const timer = setTimeout(() => {
      setGlobalMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [globalMessage]);

  return (
    <>
      <Header
        token={token}
        user={user}
        onLogout={handleLogout}
        className="header"
      />
      <main>
        <MovieForm />
        <Tabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isTodosDisabled={!token}
          className="tabs"
        />
        <GlobalMessage message={globalMessage} className="message" />
        {activeTab === "login" && (
          <LoginForm
            setGlobalMessage={setGlobalMessage}
            setToken={setToken}
            setUser={setUser}
          />
        )}
        {activeTab === "register" && (
          <RegistrationForm
            setGlobalMessage={setGlobalMessage}
            setToken={setToken}
            setUser={setUser}
          />
        )}
        {activeTab === "todos" && (
          <TodoList setGlobalMessage={setGlobalMessage} token={token} />
        )}
      </main>
    </>
  );
}

export default App;
