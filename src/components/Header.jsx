import logoutRequest from "../modules/LogoutRequest";

function Header({ user, onLogout }) {
  return (
    <header>
      <h1>Todo List App</h1>
      <div className="auth-status">
        <span>{user ? `Logged in as ${user}` : "Not logged in"}</span>
        <button onClick={onLogout} disabled={!user}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
