import { useState } from "react";
import SignupPage from "../components/SignupForm";
import LoginPage from "./LoginPage";

export default function AuthPage() {
  const [showSignup, setShowSignup] = useState(true);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 shadow-md">
      <div className="flex justify-center mb-6">
        <button
          className={`btn ${showSignup ? "btn-active" : ""}`}
          onClick={() => setShowSignup(true)}
        >
          Sign Up
        </button>
        <button
          className={`btn ${!showSignup ? "btn-active" : ""}`}
          onClick={() => setShowSignup(false)}
        >
          Log In
        </button>
      </div>

      {showSignup ? <SignupPage /> : <LoginPage />}
    </div>
  );
}