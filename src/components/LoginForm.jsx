import { useState } from "react";

function LoginForm({ setToken, setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();

      setToken(data.token); // store token in parent
      setUser(data.username); // store username in parent
      setError(""); // clear any previous errors
    } catch (err) {
      console.error(err);
      setError("Invalid username or password");
    }
  }

  return (
    <section id="loginSection">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="field">
          <label for="loginUsername">Username</label>
          <input
            id="loginUsername"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label for="loginPassword">Password</label>
          <input
            id="loginPassword"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Log In</button>
        </div>
      </form>
    </section>
  );
}

export default LoginForm;
