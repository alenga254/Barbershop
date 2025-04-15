import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function SignupForm() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input change
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Handle form submission
  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(""); // Reset error on new submit

    fetch("http://localhost:5555/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    })
      .then((r) => {
        if (r.ok) return r.json();
        throw new Error("Signup failed");
      })
      .then((data) => {
        setUser(data); // Auto-login user after signup
        navigate("/home"); // Redirect to home page
      })
      .catch((err) => {
        setError(err.message); // Display error message
        setLoading(false);
      });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-6 shadow-md rounded-xl">
      <h2 className="text-xl font-bold mb-4">Signup</h2>
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
        className="input w-full mb-3"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="input w-full mb-3"
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        className="input w-full mb-3"
        required
      />
      <button type="submit" className="btn w-full" disabled={loading}>
        {loading ? "Signing up..." : "Sign Up"}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
