import { useState } from "react";
import LoginForm from "./components/LoginForm";
import RegistrationForm from "./components/RegistrationForm";
import TodoList from "./TodoList";
import Tabs from "./components/Tabs";
import GlobalMessage from "./Components/GlobalMessage";

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [];

  return (
    <div className="app">
      <Header user="" onLogout={handleLogout} />
      <Tabs activeTab="" setActiveTab={""} isTodosDisabled={""} />
      <GlobalMessage />
      {!token ? (
        <div>
          {showRegister ? (
            <RegistrationForm setToken={setToken} setUser={setUser} />
          ) : (
            <LoginForm setToken={setToken} setUser={setUser} />
          )}

          <button onClick={() => setShowRegister(!showRegister)}>
            {showRegister ? "Back to Login" : "Register New User"}
          </button>
        </div>
      ) : (
        <div>
          <p>Welcome, {user}</p>
          <button
            onClick={() => {
              setToken(null);
              setUser(null);
            }}
          >
            Log Out
          </button>
          <TodoList token={token} />
        </div>
      )}
    </div>
  );
}

export default App;
