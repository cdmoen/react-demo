import { useState } from "react";

function RegistrationForm({ setToken, setUser }) {
  const [user, setUsername] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleRegister(e) {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user, password: pass }),
      });

      if (!response.ok) {
        const data = await response.json();
        console.log(data);
        throw new Error(data.message || "Registration failed");
      }

      const data = await response.json();
      setSuccess("Registration successful!");

      // Optional: auto-login after registration if backend returns token
      if (data.token) {
        setToken(data.token);
        setUser(data.username);
      }

      // Clear form
      setUsername("");
      setPass("");
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.message);
      setSuccess("");
    }
  }

  return (
    <section id="registerSection">
      <form onSubmit={handleRegister}>
        <h2>Register</h2>
        <div className="field">
          <label for="registerUsername">Username</label>
          <input
            id="registerUsername"
            type="text"
            placeholder="Username"
            value={user}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label for="registerPassword">Password</label>
          <input
            id="registerPassword"
            type="password"
            placeholder="Password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
      </form>
    </section>
  );
}

export default RegistrationForm;
