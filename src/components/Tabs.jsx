function Tabs({ activeTab, setActiveTab, isTodosDisabled }) {
  return (
    <div className="tabs">
      <button
        className={activeTab === "login" ? "active" : ""}
        onClick={() => setActiveTab("login")}
      >
        Login
      </button>
      <button
        className={activeTab === "register" ? "active" : ""}
        onClick={() => setActiveTab("register")}
      >
        Register
      </button>
      <button
        className={isTodosDisabled ? "disabled" : ""}
        onClick={() => !isTodosDisabled && setActiveTab("todos")}
      >
        Todos
      </button>
    </div>
  );
}
export default Tabs;
