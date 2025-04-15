import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setUser } = useUser();
  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    fetch("http://localhost:5555/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    })
      .then((r) => {
        if (r.ok) return r.json();
        throw new Error("Login failed");
      })
      .then((data) => {
        setUser(data); // Set user context
        navigate("/home"); // Redirect to home page
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 shadow-md rounded-xl">
      <h2 className="text-2xl font-semibold mb-4">Log In</h2>
      <form
        onSubmit={handleLogin}
        className="space-y-4"
        onChange={(e) =>
          setForm({ ...form, [e.target.name]: e.target.value })
        }
      >
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          className="input w-full"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          className="input w-full"
          required
        />
        <button type="submit" className="btn w-full" disabled={loading}>
          {loading ? "Logging in..." : "Log In"}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}
